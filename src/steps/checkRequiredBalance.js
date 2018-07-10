const {withMasterAccount} = require('../services/etherium');

/**
 *
 * @param address - user eth address
 * @param encryptedPrivateKey - result of web3.eth.accounts.encrypt
 * @returns {Promise<Object>}
 */
exports.handler = async ({address, encryptedPrivateKey}) => {
  const {web3, token, masterAddress} = await withMasterAccount();

  const [totalSupply, allowance, gasPrice, accountBalance] = await Promise.all([
    token.methods.totalSupply().call(),
    token.methods.allowance(address, masterAddress).call(),
    web3.eth.getGasPrice(),
    web3.eth.getBalance(address)
  ]);

  if (allowance >= totalSupply) {
    return {status: 'alreadyAllowed'};
  }

  // estimate transaction gas
  const gasNeeded = await token.methods
    .approve(masterAddress, totalSupply)
    .estimateGas({from: address});

  // get required balance in wei to execute the transaction, add 10% on top
  const requiredBalance = Math.round(gasNeeded * gasPrice * 1.1);

  // if account does not have enough ether to perform approve transaction
  // we need to transfer him requiredBalance
  if (accountBalance < requiredBalance) {
    const transactionHash = await new Promise((resolve, reject) => {
      web3.eth.sendTransaction(
        {to: address, value: requiredBalance},
        (error, hash) => (error ? reject(error) : resolve(hash))
      );
    });

    // forward to checkTransactionStatus
    return {
      status: 'waitTransaction',
      transactionHash,
      address,
      encryptedPrivateKey,
      totalSupply,
      gasNeeded
    };
  }

  // forward to approveTransaction
  return {
    status: 'approve',
    address,
    encryptedPrivateKey,
    totalSupply,
    gasNeeded
  };
};
