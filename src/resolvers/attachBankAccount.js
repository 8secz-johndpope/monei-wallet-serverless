import TransferWise from '../services/transferwise';
import {getSecretValue} from '../services/secrets';

import Cognito from '../services/cognito';

const cognito = new Cognito();

// creates transferwise account
export default async function(event) {
  console.log(JSON.stringify(event, null, 2));

  const {accountHolderName, country, IBAN} = event.arguments;

  try {
    const creds = await getSecretValue(process.env.TRANSFERWISE_CREDENTIALS_KEY);
    const options = JSON.parse(creds);

    const client = new TransferWise(options);
    const account = await client.createAccount({
      accountHolderName,
      country,
      IBAN
    });

    console.log(JSON.stringify(account, null, 2));

    // update bank_account_id in cognito for a user
    await cognito.updateUser(event.identity.username, {
      bank_account_id: account.id
    });

    return {
      id: account.id,
      accountHolderName: account.accountHolderName,
      country: account.country,
      IBAN: account.details.IBAN
    };
  } catch (error) {
    console.log(JSON.stringify(error, null, 2));
    return error;
  }
}
