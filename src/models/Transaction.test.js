const Transaction = require('./Transaction');
const dynamodb = require('serverless-dynamodb-client');

jest.mock('serverless-dynamodb-client');

test('create transaction', async () => {
  const transaction = await Transaction.create({test: 1});
  expect(dynamodb.doc.put).toHaveBeenCalledTimes(1);
  expect(transaction.status).toEqual('pending');
});

test('findByAddress', async () => {
  const transactions = await Transaction.findByAddress('address');

  // twice - because we need to query from and later to addresses
  expect(dynamodb.doc.query).toHaveBeenCalledTimes(2);

  // check number of returning Items
  expect(transactions.length).toEqual(4);

  // checking order
  expect(transactions[0].id).toEqual(1);
  expect(transactions[3].id).toEqual(2);
});

test('batchUpdate', async () => {
  await Transaction.batchUpdate(['addr1', 'addr2']);
  expect(dynamodb.doc.batchWrite).toHaveBeenCalledTimes(1);
});

test('batchUpdate with more than 25 items', async () => {
  const transactions = [];
  for (let i = 0; i < 26; i++) {
    transactions.push(`addr${i}`);
  }
  let error = null;
  try {
    await Transaction.batchUpdate(transactions);
  } catch (err) {
    error = err;
  }
  expect(error).not.toBeNull();
  //expect(dynamodb.doc.batchWrite).toHaveBeenCalledTimes(1);
});
