const AWS = require('aws-sdk');
const iot = new AWS.IotData({endpoint: process.env.IOT_ENDPOINT});

const notifyByAddress = (address, data) => {
  return iot.publish({topic: address, payload: JSON.stringify(data)}).promise();
};

/**
 * Notifies user about incoming transaction
 * @param trx - dynamoDB transaction
 * @returns {Promise<[any]>}
 */
const notifyTrxCreated = trx => {
  const event = {
    type: 'TRX_CREATED',
    payload: {...trx, income: true}
  };
  return notifyByAddress(trx.to, event);
};

/**
 * Notifies both sender and receiver users about updated transaction status
 * @param trx - dynamoDB transaction
 * @returns {Promise<[any]>}
 */
const notifyTrxUpdated = trx => {
  return Promise.all([
    notifyByAddress(trx.from, {
      type: 'TRX_UPDATED',
      payload: trx
    }),
    notifyByAddress(trx.to, {
      type: 'TRX_UPDATED',
      payload: {...trx, income: true}
    })
  ]);
};

module.exports = {
  notifyByAddress,
  notifyTrxCreated,
  notifyTrxUpdated
};
