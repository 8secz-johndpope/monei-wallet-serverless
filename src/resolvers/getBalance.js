import {token} from '../services/etherium';

// returns user token balance
export default async function(event) {
  const address = event.identity.claims['custom:eth_address'];
  const balance = await token.methods.balanceOf(address).call();
  return Number(balance);
}
