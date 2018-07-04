const axios = require('axios');
const qs = require('qs');

const SUCCESS_RE = /^(000\.000\.|000\.100\.1|000\.[36]|000\.400\.0|000\.400\.100|000\.200)/;

exports.isSuccessful = transactionResult => {
  try {
    const resultCode = transactionResult.result.code;
    return SUCCESS_RE.test(resultCode);
  } catch (err) {
    return false;
  }
};

exports.getDescription = transactionResult => {
  try {
    return transactionResult.result.description;
  } catch (error) {
    return '';
  }
};
