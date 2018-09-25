import Web3 from 'web3';
import {getSecretValue} from './secrets';

import HDWalletProvider from 'truffle-hdwallet-provider';
import {abi as tokenABI} from '../token';

export const web3 = new Web3(process.env.INFURA_URL);
export const token = new web3.eth.Contract(tokenABI, process.env.TOKEN_ADDRESS);
export const masterAddress = process.env.MASTER_ADDRESS;

/**
 * Fetches mnemonic phrase from aws secret storage and initializes web3 master account from the mnemonic
 * Function that uses this method should have a policy:
 *
 * - Effect: Allow
 *   Action: secretsmanager:GetSecretValue
 *   Resource: "arn:aws:secretsmanager:#{AWS::Region}:#{AWS::AccountId}:secret:${self:custom.config.MNEMONIC_KEY}-*"
 *
 * @returns {Promise<{web3: Web3, token: Contract, masterAddress: String}>}
 */
export const withMasterAccount = async () => {
  const mnemonic = await getSecretValue(process.env.MNEMONIC_KEY);
  web3.setProvider(new HDWalletProvider(mnemonic, process.env.INFURA_URL));
  const masterAddress = web3.currentProvider.addresses[0];
  web3.eth.defaultAccount = web3.currentProvider.addresses[0];

  // reinitialize token to use master account
  const token = new web3.eth.Contract(tokenABI, process.env.TOKEN_ADDRESS);

  return {web3, token, masterAddress};
};
