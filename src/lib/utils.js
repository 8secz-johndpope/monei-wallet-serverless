exports.parseBoolean = str => {
  if (str === 'true' || str === '') return true;
  if (str === 'false') return false;
  return str;
};
