const {token} = require('../services/etherium');

// returns user token balance
exports.handler = async event => {
  const address = event.identity.claims['custom:eth_address'];
  const balance = await token.methods.balanceOf(address).call();
  return Number(balance);
};
