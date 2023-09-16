// @ts-ignore
import ParseServer from 'parse-server';
// @ts-ignore
import config from './config';
// @ts-ignore
import MoralisEthAdapter from './auth/MoralisEthAdapter';

export const parseServer = new ParseServer({
  databaseURI: config.DATABASE_URI,
  cloud: config.CLOUD_PATH,
  serverURL: config.SERVER_URL,
  verifyUserEmails:true,
  cors: {
    // Especifica los dominios permitidos aquí
    // Por ejemplo, puedes permitir solicitudes desde http://tuapp.com
    origins: ['http://localhost:3000/'],
    // Opciones de cabeceras permitidas
    // ...
  },
  emailVerifyTokenValidityDuration: 2 * 60 * 60,
  publicServerURL: config.SERVER_URL,
  appName: config.APP_NAME,
  appId: config.APPLICATION_ID,
  masterKey: config.MASTER_KEY,
  emailAdapter: {
    module: 'parse-server'
  },
  auth: {
    moralisEth: {
      module: MoralisEthAdapter,
    },
  },
});
