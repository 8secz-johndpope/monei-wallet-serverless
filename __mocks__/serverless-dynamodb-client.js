const dynamodb = jest.genMockFromModule('serverless-dynamodb-client');

const putMock = jest.fn();
const putPromiseMock = jest.fn();
putPromiseMock.mockReturnValue(Promise.resolve());
putMock.mockReturnValue({
  promise: putPromiseMock
});

const queryMock = jest.fn();
const queryPromiseMock = jest.fn();
queryPromiseMock.mockReturnValue(
  Promise.resolve({
    Items: [{id: 1, createdAt: 1}, {id: 2, createdAt: 2}]
  })
);
queryMock.mockReturnValue({
  promise: queryPromiseMock
});

const batchWriteMock = jest.fn();
const batchWritePromiseMock = jest.fn();
batchWritePromiseMock.mockReturnValue(Promise.resolve({}));
batchWriteMock.mockReturnValue({
  promise: batchWritePromiseMock
});

dynamodb.doc = {
  put: putMock,
  query: queryMock,
  batchWrite: batchWriteMock
};

module.exports = dynamodb;
