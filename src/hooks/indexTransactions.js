const connectionClass = require('http-aws-es');
const elasticsearch = require('elasticsearch');
const attr = require('dynamodb-data-types').AttributeValue;
const {notifyTrxCreated, notifyTrxUpdated} = require('../services/userNotifier');

const elasticSearch = process.env.ELASTICSEARCH;
let AWS = require('aws-sdk');
const credentials = new AWS.EnvironmentCredentials('AWS');

const esClient = new elasticsearch.Client({
  host: elasticSearch,
  //log: 'trace',
  connectionClass,
  amazonES: {
    credentials: credentials,
    region: process.env.SLS_REGION
  }
});

/**
 * Keep document in sync in Elasticsearch index
 *
 * @param {*} index index name
 * @param {*} indexType index type
 * @param {*} doc document to be indexed
 */
const indexDocument = (index, indexType, doc) => {
  const body = attr.unwrap(doc.dynamodb.NewImage);
  console.log(JSON.stringify(body, null, 2));
  switch (doc.eventName) {
    case 'INSERT':
      return Promise.all([
        notifyTrxCreated(body),
        esClient.index({
          index,
          type: indexType,
          id: doc.dynamodb.Keys.id.S,
          body
        })
      ]);
    case 'MODIFY':
      return Promise.all([
        notifyTrxUpdated(body),
        esClient.update({
          index,
          type: indexType,
          id: doc.dynamodb.Keys.id.S,
          body: {
            doc: body
          }
        })
      ]);
    case 'REMOVE':
      return esClient.delete({
        index,
        type: indexType,
        id: doc.dynamodb.Keys.id.S
      });
    default:
      return Promise.resolve();
  }
};

module.exports.handler = async event => {
  const indexing = event.Records.map(rec => indexDocument('transactions', 'transactions', rec));
  return Promise.all(indexing);
};
