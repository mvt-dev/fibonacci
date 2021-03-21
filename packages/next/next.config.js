const withTM = require('next-transpile-modules')(["@fibonacci/services"]);

module.exports = withTM();