/**
 * @description: This file is used to compile and export all the helper functions
 */

const formatLongURL = require('./formatLongURL');
const generateTinyURL = require('./generateTinyURL');
const saveDatabase = require('./saveDatabase');

module.exports = {
  formatLongURL,
  generateTinyURL,
  saveDatabase,
};