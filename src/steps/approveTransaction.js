import {masterAddress, token, web3} from '../services/etherium';

import {getSecretValue} from '../services/secrets';

export default async function({totalSupply, gasNeeded, encryptedPrivateKey}) {
  // fetch aws password from secret manager
  const encryptPassword = await getSecretValue(process.env.ENCRYPT_PASSWORD_KEY);
  const account = web3.eth.accounts.decrypt(encryptedPrivateKey, encryptPassword);

  web3.eth.accounts.wallet.add(account);

  const transactionHash = await new Promise((resolve, reject) => {
    token.methods
      .approve(masterAddress, totalSupply)
      .send(
        {from: account.address, gas: gasNeeded},
        (error, hash) => (error ? reject(error) : resolve(hash))
      );
  });

  // forward to checkTransactionStatus
  return {
    transactionHash,
    status: 'pending'
  };
}
