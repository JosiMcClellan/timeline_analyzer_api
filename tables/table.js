const environment = process.env.NODE_ENV || 'development'
const configuration = require('../knexfile')[environment]
const table = require('knex')(configuration)

module.exports = table;
