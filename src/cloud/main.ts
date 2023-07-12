/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable etc/no-commented-out-code */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
declare const Parse: any;
import "./collections"
import "./functionMarket"
import "./renderNft"
import "./stripe"
import "./user"
import "./sendingEmails"


import { requestMessage, verifyMessage } from '../auth/authService';

Parse.Cloud.define('requestMessage', async ({ params }: any) => {
  
  const { address, chain, networkType } = params;

  const message = await requestMessage({
    address,
    chain,
    networkType,
  });
  return { message };
});

Parse.Cloud.define('requestVerifyMessage', async ({ params }: any) => {
  const { message, signature, network } = params;
  
  const user  = await verifyMessage({
    network,
    message, 
    signature
  });

  return { user  };
});

Parse.Cloud.define('getPluginSpecs', () => {
  // Not implemented, only excists to remove client-side errors when using the moralis-v1 package
  return [];
});

Parse.Cloud.define('getServerTime', () => {
  // Not implemented, only excists to remove client-side errors when using the moralis-v1 package
  return null;
});

export default Parse