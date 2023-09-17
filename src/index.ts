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

const Web3 = require('web3');

export const app = express();

const port = config.HTTP_PORT;
const stripe = require('stripe')('pk_test_51NV05cGc5cz7uc72xTzSNZNeg3dsIWX9hZo4Y7nZH5WnFF8nuEJJwhSGviE29JHXzm8zovxToQDDVjLzfND57MWj00NdjCWocu');


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

app.use(cors({
  origin:["http://localhost:3000","https://bizclub-frontend.vercel.app"]
}));
// Configura las cabeceras CORS en Express
app.use(function(req, res, next) {
  // Permitir solicitudes desde el origen especificado
  res.header("Access-Control-Allow-Origin", "https://bizclub-frontend.vercel.app"); // Agrega aquí tu dominio
  // Otras cabeceras CORS necesarias
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Permitir credenciales si es necesario (depende de tu configuración)
  res.header("Access-Control-Allow-Credentials", true);

  // Continuar con la siguiente capa de middleware
  next();
});
app.use(
  streamsSync(parseServer, {
    apiKey: config.MORALIS_API_KEY_STREAMS,
    webhookUrl: config.STREAMS_WEBHOOK_URL,
   
    }
  ),
);

app.use(`/server`, parseServer.app);
app.use(`/dashboard`, parseDashboard);

app.use(errorHandler);

app.use(express.static('public'));


app.post(`/streams`, async (req: any, res: any) => {
  try {
    verifySignature(req, config.MORALIS_API_KEY)
    const { data, _tagName, eventName }: any = parseEventData(req);
    console.log(data);
    await parseUpdate(`SFS_${eventName}`, data);
    return res.status(200).json();
  } catch(error) {
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
