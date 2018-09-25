export const getAccessTokenRes = {
  access_token: '4c0f5eaa-14e1-4019-9013-dfe9a5496f36',
  token_type: 'bearer',
  refresh_token: 'b90eddbb-d1e5-4e99-9bc7-c7994620bccb',
  expires_in: 43199,
  scope: 'transfers'
};

export const getAccessTokenError = {
  error: 'invalid_token',
  error_description: '8ac85ca4-6759-4dd0-9f68-6db722f33722'
};

export const createAccountReq = {
  accountHolderName: 'Joe British',
  country: 'ES',
  IBAN: 'ES1020903200500041045040'
};

export const createAccountRes = {
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

export const createQuoteRes = {
  id: 1291658,
  source: 'EUR',
  target: 'EUR',
  sourceAmount: 1,
  targetAmount: 0.4,
  type: 'REGULAR',
  rate: 1,
  createdTime: '2018-07-30T13:00:49.047Z',
  createdByUserId: 5461222,
  profile: 256,
  business: 256,
  rateType: 'FIXED',
  deliveryEstimate: '2018-08-03T13:00:49.047Z',
  fee: 0.6,
  allowedProfileTypes: ['PERSONAL', 'BUSINESS'],
  guaranteedTargetAmount: false,
  ofSourceAmount: true
};

export const createTransferReq = {targetAccount: 14177246, amount: 1};

export const createTransferRes = {
  id: 433003,
  user: 5461222,
  targetAccount: 14177246,
  sourceAccount: 14059675,
  quote: 1286857,
  status: 'incoming_payment_waiting',
  reference: 'MONEI Wallet payout',
  rate: 1,
  created: '2018-07-26 12:10:51',
  business: 256,
  transferRequest: null,
  details: {
    reference: 'MONEI Wallet payout'
  },
  hasActiveIssues: false,
  sourceCurrency: 'EUR',
  sourceValue: 9.4,
  targetCurrency: 'EUR',
  targetValue: 9.4,
  customerTransactionId: 'cd942384-c1d8-4b0f-9b30-772dadc94741'
};

export const confirmTransferRes = {
  type: 'BALANCE',
  status: 'COMPLETED',
  errorCode: null
};
