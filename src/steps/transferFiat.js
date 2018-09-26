import TransferWise from '../services/transferwise';
import {getSecretValue} from '../services/secrets';

import Cognito from '../services/cognito';

const cognito = new Cognito();

export default async function(data) {
  JSON.stringify(data, null, 2);

  try {
    const amount = data.amount / 100;
    const creds = await getSecretValue(process.env.TRANSFERWISE_CREDENTIALS_KEY);
    const options = JSON.parse(creds);

    const client = new TransferWise(options);
  } catch (error) {}
}
