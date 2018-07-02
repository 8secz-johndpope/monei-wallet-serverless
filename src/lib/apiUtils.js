const DEFAULT_HEADERS = {
  'Access-Control-Allow-Origin': '*', // Required for CORS support to work
  'Access-Control-Allow-Credentials': true // Required for cookies, authorization headers with HTTPS
};

/**
 * Creates lambda API gateway response
 * @param body
 * @param statusCode
 * @param headers
 * @returns {{statusCode: number, headers: {'Access-Control-Allow-Origin': string, 'Access-Control-Allow-Credentials': boolean}, body: string}}
 */
const response = (body, {statusCode = 500, headers} = {}) => ({
  statusCode,
  headers: {...DEFAULT_HEADERS, ...headers},
  body: JSON.stringify(body)
});

exports.respinse = response;

exports.success = (body, {statusCode = 200, headers} = {}) => response(body, {statusCode, headers});

exports.fail = error => response(error, {statusCode: error.statusCode});

exports.redirect = url => ({
  statusCode: 302,
  headers: {
    ...DEFAULT_HEADERS,
    Location: url
  }
});
