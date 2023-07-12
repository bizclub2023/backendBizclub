import Moralis from 'moralis';
import { authRequests } from '../store';
import { ParseServerRequest } from '../utils/ParseServerRequest';
import config from '../config';

const serverRequest = new ParseServerRequest();

interface ParseUser {
  objectId: string;
}

export interface RequestMessage {
  address: string;
  chain: string;
  network: string;
}

const STATEMENT = 'Welcome to Koolinart, Please sign this message to confirm your identity.';
const EXPIRATION_TIME = 9000000;
const TIMEOUT = 15;


export async function requestMessage({
  address,
  chain,
  networkType,
}: {
  address: string;
  chain?: string;
  networkType: 'evm' | 'solana';
}) {
  if (networkType === 'evm' && chain) {
    return requestMessageEvm({ address, chain, networkType });
  }
  if (networkType === 'solana') {
    return requestMessageSol({ address, networkType });
  }
  throw new Error(`Invalid network: ${networkType}`);
}


async function requestMessageEvm({
  address,
  chain,
  networkType,
}: {
  address: string;
  chain: string;
  networkType: 'evm';
}) {
  const url = new URL(config.SERVER_URL_AUTH);
  const urltoString = url?.toString()
  const now = new Date();
  const expirationTime = new Date(now.getTime() + EXPIRATION_TIME);

  const result = await Moralis.Auth.requestMessage({
    address,
    chain,
    networkType,
    domain: url.hostname,
    uri: urltoString,
    statement: STATEMENT,
    notBefore: now?.toISOString(),
    expirationTime: expirationTime?.toISOString(),
    timeout: TIMEOUT,
  });

  const { message, id, profileId } = result.toJSON();
  authRequests.set(message, { id, profileId });

  return message;
}

async function requestMessageSol({ address, networkType }: { address: string; networkType: 'solana' }) {

  const url = new URL(config.SERVER_URL_AUTH);
  const urltoString = url?.toString()
  const now = new Date();
  const expirationTime = new Date(now.getTime() + EXPIRATION_TIME);

  const result = await Moralis.Auth.requestMessage({
    address,
    networkType,
    network: 'devnet',
    domain: url.hostname,
    statement: STATEMENT,
    uri: urltoString,
    expirationTime: expirationTime?.toISOString(),
    timeout: TIMEOUT,
  });

  const { message, id, profileId } = result.toJSON();
  authRequests.set(message, { id, profileId });

  return message;
}

export interface VerifyMessage {
  network: string;
  signature: string;
  message: string;
}

export async function verifyMessage({ network, signature, message }: VerifyMessage) {
  const storedData = authRequests.get(message);

  if (!storedData) {
    throw new Error('Invalid message');
  }

  const { id: storedId, profileId: storedProfileId } = storedData;

  const authData = {
    id: storedProfileId,
    authId: storedId,
    message,
    signature,
    network,
  };

  // Authenticate
  const user = await serverRequest.post<ParseUser>({
    endpoint: `/users`,
    params: {
      authData: {
        moralis: authData,
      },
    },
    useMasterKey: true,
  });

  // Update user moralisProfile column
  await serverRequest.put({
    endpoint: `/users/${user.objectId}`,
    params: {
      moralisProfileId: storedProfileId,
    },
    useMasterKey: true,
  });

  // Get authenticated user
  const updatedUser = await serverRequest.get({
    endpoint: `/users/${user.objectId}`,
    useMasterKey: true,
  });

  return updatedUser;
}
