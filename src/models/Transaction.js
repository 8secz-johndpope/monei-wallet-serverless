const dynamoDb = require('serverless-dynamodb-client');

const TABLE_NAME = process.env.TRANSACTIONS_TABLE;

// Create new transaction
const createTransaction = data => {
  const item = {
    createdAt: Date.now(),
    updatedAt: Date.now(),
    status: 'pending',
    ...data
  };
  return dynamoDb.doc
    .put({
      TableName: TABLE_NAME,
      Item: item
    })
    .promise()
    .then(() => item);
};

// batch update transactions from array of blockchain receipts
const batchUpdate = transactions => {
  const items = transactions.map(trx => ({
    PutRequest: {
      Item: trx
    }
  }));
  const params = {
    RequestItems: {
      [TABLE_NAME]: items
    }
  };
  return dynamoDb.doc.batchWrite(params).promise();
};

// update transaction from blockchain receipt
const updateFromReceipt = async receipt => {
  const data = {
    updatedAt: Date.now(),
    id: receipt.transactionHash,
    status: receipt.status ? 'completed' : 'failed'
  };
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id: data.id
    },
    ExpressionAttributeNames: {
      '#status': 'status'
    },
    ExpressionAttributeValues: {
      ':status': data.status,
      ':updatedAt': data.updatedAt
    },
    UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt',
    ReturnValues: 'ALL_NEW'
  };
  const {Attributes} = await dynamoDb.doc.update(params).promise();
  return Attributes;
};

// find all transactions by user address
const findByAddress = async address => {
  const paramsTo = {
    TableName: TABLE_NAME,
    IndexName: 'to-index',
    ExpressionAttributeNames: {
      '#to': 'to'
    },
    KeyConditionExpression: '#to = :toAddress',
    ExpressionAttributeValues: {':toAddress': address}
  };

  const paramsFrom = {
    TableName: TABLE_NAME,
    IndexName: 'from-index',
    ExpressionAttributeNames: {
      '#from': 'from'
    },
    KeyConditionExpression: '#from = :toAddress',
    ExpressionAttributeValues: {':toAddress': address}
  };

  const [itemsTo, itemsFrom] = await Promise.all([
    dynamoDb.doc.query(paramsTo).promise(),
    dynamoDb.doc.query(paramsFrom).promise()
  ]);

  const items = itemsTo.Items.concat(itemsFrom.Items);
  return items.sort((a, b) => a.createdAt < b.createdAt);
};

module.exports = {
  create: createTransaction,
  findByAddress,
  batchUpdate,
  updateFromReceipt
};
