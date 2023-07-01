/**
 * @description: This file is used to compile and export all the helper functions
 */

const findEmailByUserId = require('./findEmailByUserId');
const findUrlsByUserId = require('./findUrlsByUserId');
const formatLongURL = require('./formatLongURL');
const findIdByEmail = require('./findIdByEmail');
const {saveDatabase, readDatabase} = require('./databaseIO.js');
const generateRandomString = require('./generateRandomString');

module.exports = {
  formatLongURL,
  readDatabase,
  saveDatabase,
  generateRandomString,
  findIdByEmail,
  findUrlsByUserId,
  findEmailByUserId,
};