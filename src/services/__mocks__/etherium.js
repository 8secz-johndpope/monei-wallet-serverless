const etherium = jest.genMockFromModule('../etherium');
const EventEmitter = require('events').EventEmitter;

let balanceShouldReturn = 100;

const callStub = jest.fn();
callStub.mockReturnValue(Promise.resolve(balanceShouldReturn));

const estimateGasMock = jest.fn();
estimateGasMock.mockReturnValue(Promise.resolve(100));

const sendEventEmitter = new EventEmitter();

const transferMock = jest.fn();
transferMock.mockReturnValue({
  estimateGas: estimateGasMock,
  send: () => sendEventEmitter
});

const balanceOfStub = jest.fn();
balanceOfStub.mockReturnValue({
  call: callStub
});
etherium.token = {
  methods: {
    balanceOf: balanceOfStub,
    transfer: transferMock
  }
};

etherium._balanceShouldReturn = balance => {
  balanceShouldReturn = balance;
};
etherium._balanceShouldReturnError = value => {
  if (value) {
    callStub.mockReturnValue(Promise.reject(new Error('unavailable')));
  }
};
etherium._sendEmitEvent = (event, value) => {
  sendEventEmitter.emit(event, value);
};

etherium.web3 = {
  eth: {
    accounts: {
      create: () => ({
        privateKey: 'privateKey',
        address: 'address'
      })
    }
  }
};

module.exports = etherium;
