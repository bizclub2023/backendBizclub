/* eslint-disable etc/no-commented-out-code */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import cors from 'cors';
import express from 'express';
// @ts-ignore
import Moralis from 'moralis';
import config from './config';
import { parseServer } from './parseServer';
// @ts-ignore
import { streamsSync } from '@moralisweb3/parse-server';
import http from 'http';
// @ts-ignore
import ParseServer from 'parse-server';
import { parseDashboard } from "./parseDashboard";
import { parseEventData } from './utils/parseEventData';
// @ts-ignore
import { parseUpdate } from './utils/parseUpdate';
// @ts-ignore
import { errorHandler } from './middlewares/errorHandler';
const stripe = require('stripe')('pk_test_51NV05cGc5cz7uc72xTzSNZNeg3dsIWX9hZo4Y7nZH5WnFF8nuEJJwhSGviE29JHXzm8zovxToQDDVjLzfND57MWj00NdjCWocu');

const Web3 = require('web3');

export const app = express();
const endpointSecret = 'whsec_...';

const port = config.HTTP_PORT;

Moralis.start({
  apiKey: config.MORALIS_API_KEY,
});

const verifySignature = (req: any, secret: string) => {

  const providedSignature = req.headers["x-signature"]
  if(!providedSignature) {throw new Error("Signature not provided")}
  const generatedSignature= Web3.utils.sha3(JSON.stringify(req.body)+secret)
  if(generatedSignature !== providedSignature) {throw new Error("Invalid Signature")}

}

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '50mb' }));

app.use(cors());

app.use(
  streamsSync(parseServer, {
    apiKey: config.MORALIS_API_KEY_STREAMS,
    webhookUrl: config.STREAMS_WEBHOOK_URL
    }
  ),
);

app.use(`/server`, parseServer.app);
app.use(`/dashboard`, parseDashboard);

app.use(errorHandler);

app.use(express.static('public'));

app.post(`/webhook`, async (req: any, res: any) => {
  console.log(`PaymentIntent `);

  let event = req.body;

  // Only verify the event if you have an endpoint secret defined.
  // Otherwise use the basic event deserialized with JSON.parse
  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = req.headers['stripe-signature'];
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        endpointSecret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return res.sendStatus(400);
    }
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send();
});

app.post(`/streams`, async (req: any, res: any) => {
  try{
    verifySignature(req, config.MORALIS_API_KEY)
    const { data, _tagName, eventName }: any = parseEventData(req);
    console.log(data);
    await parseUpdate(`SFS_${eventName}`, data);
    return res.status(200).json();
  }catch(error){
    console.log('errorStream', error)
  }
  res.send('ok');

})


const httpServer = http.createServer(app);
httpServer.listen(port, async () => {
  if (config.USE_STREAMS) {
    // eslint-disable-next-line no-console
    console.log(
      `Moralis Server is running on port ${port} and stream webhook url ${config.STREAMS_WEBHOOK_URL}`,
    );
  } else {
    // eslint-disable-next-line no-console
    console.log(`Moralis Server is running on port ${port}.`);
  }
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);