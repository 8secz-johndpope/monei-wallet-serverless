exports.getAccessTokenRes = {
  access_token: '4c0f5eaa-14e1-4019-9013-dfe9a5496f36',
  token_type: 'bearer',
  refresh_token: 'b90eddbb-d1e5-4e99-9bc7-c7994620bccb',
  expires_in: 43199,
  scope: 'transfers'
};

exports.getAccessTokenError = {
  error: 'invalid_token',
  error_description: '8ac85ca4-6759-4dd0-9f68-6db722f33722'
};

exports.createAccountReq = {
  accountHolderName: 'Joe British',
  country: 'ES',
  IBAN: 'ES1020903200500041045040'
};

exports.createAccountRes = {
  id: 14177246,
  business: 256,
  profile: 256,
  accountHolderName: 'Joe British',
  currency: 'EUR',
  country: 'ES',
  type: 'iban',
  details: {
    address: null,
    email: null,
    legalType: 'PRIVATE',
    accountNumber: null,
    sortCode: null,
    abartn: null,
    accountType: null,
    bankgiroNumber: null,
    ifscCode: null,
    bsbCode: null,
    institutionNumber: null,
    transitNumber: null,
    phoneNumber: null,
    bankCode: null,
    russiaRegion: null,
    routingNumber: null,
    branchCode: null,
    cpf: null,
    cardNumber: null,
    idType: null,
    idNumber: null,
    idCountryIso3: null,
    idValidFrom: null,
    idValidTo: null,
    clabe: null,
    swiftCode: null,
    dateOfBirth: null,
    clearingNumber: null,
    bankName: null,
    branchName: null,
    businessNumber: null,
    province: null,
    city: null,
    rut: null,
    token: null,
    cnpj: null,
    payinReference: null,
    pspReference: null,
    orderId: null,
    idDocumentType: null,
    idDocumentNumber: null,
    targetProfile: null,
    iban: 'ES1020903200500041045040',
    bic: null,
    IBAN: 'ES1020903200500041045040',
    BIC: null
  },
  user: 5461222
};
