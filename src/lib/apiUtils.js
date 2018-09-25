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
export const response = (body, {statusCode = 500, headers} = {}) => ({
  statusCode,
  headers: {...DEFAULT_HEADERS, ...headers},
  body: JSON.stringify(body)
});

export function success(body, {statusCode = 200, headers} = {}) {
  return response(body, {statusCode, headers});
}

export function fail(error) {
  return response(error, {statusCode: error.statusCode});
}

export function redirect(url) {
  return {
    statusCode: 302,
    headers: {
      ...DEFAULT_HEADERS,
      Location: url
    }
  };
}
