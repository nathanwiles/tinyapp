/**
 * @description: This file is used to compile and export all the helper functions
 */

const formatLongURL = require('./formatLongURL');
const findIdByEmail = require('./findIdByEmail');
const saveDatabase = require('./saveDatabase');
const generateRandomString = require('./generateRandomString');

module.exports = {
  formatLongURL,
  saveDatabase,
  generateRandomString,
  findIdByEmail
};