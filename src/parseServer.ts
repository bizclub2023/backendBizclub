// @ts-ignore
import ParseServer from 'parse-server';
import config from './config';
import MoralisEthAdapter from './auth/MoralisEthAdapter';
// @ts-ignore
import sendGridAdapter from 'parse-server-sendgrid-email-adapter';

export const parseServer = new ParseServer({
  databaseURI: config.DATABASE_URI,
  cloud: config.CLOUD_PATH,
  serverURL: config.SERVER_URL,
  publicServerURL: config.SERVER_URL,
  appName: config.APP_NAME,
  appId: config.APPLICATION_ID,
  masterKey: config.MASTER_KEY,
  cors: {   
    origins: ['*'],
  },
  auth: {
    moralisEth: {
      module: MoralisEthAdapter,
    },
  },
  verifyUserEmails: true,
  emailVerifyTokenValidityDuration: 2 * 60 * 60,
  emailAdapter: sendGridAdapter({
    apiKey: config.SENDGRID_MAIL_API_KEY, 
    from: config.SENDGRID_MAIL_SENDER,
    passwordResetEmailTemplate: config.SENDGRID_PASS_RESET_EMAIL_TEMPLATE,
    verificationEmailTemplate: config.SENDGRID_VERIFY_EMAIL_TEMPLATE
  })
}); 