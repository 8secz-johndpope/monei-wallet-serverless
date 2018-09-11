const {getSecretValue} = require('./src/services/secrets');
const TransferWise = require('./src/services/transferwise');

(async function() {
  const creds = await getSecretValue(process.env.TRANSFERWISE_CREDENTIALS_KEY);
  const options = JSON.parse(creds);
  options.profile = 256;
  const client = new TransferWise(options);
  try {
    const account = await client.createAccount({
      accountHolderName: 'John Doe',
      country: 'ES',
      IBAN: 'ES1020903200500041045040'
    });
    console.log(account);
    const confirm = await client.transfer({targetAccount: account.id, amount: 100});
    console.log(confirm);
  } catch (error) {
    console.log(error);
  }
})();
