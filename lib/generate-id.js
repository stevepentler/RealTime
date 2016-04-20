const crypto = require('crypto');

module.exports = (x) => {
  return crypto.randomBytes(x).toString('hex');
};