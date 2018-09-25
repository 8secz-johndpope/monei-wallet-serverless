const Transaction = jest.genMockFromModule('../Transaction');

Transaction.findByAddress = jest.fn();
Transaction.findByAddress.mockReturnValue(
  Promise.resolve([{id: 1, from: 'a', to: 'b', amount: 100}])
);

Transaction._findByAddressShouldReturnError = value => {
  if (value) {
    Transaction.findByAddress.mockReturnValue(Promise.reject(new Error('Error')));
  }
};

export default Transaction;
