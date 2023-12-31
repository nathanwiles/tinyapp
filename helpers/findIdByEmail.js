/**
 * @description Checks if email exists in userDatabase
 * @param {string} email
 * @param {object} userDatabase
 * 
 * @description This function will find the id of a user by their email
 * 
 * @returns {boolean || string} userID if email exists in userDatabase, false otherwise
 */

const findIdByEmail = (email, userDatabase) => {
  for (const user in userDatabase) {
    if (userDatabase[user].email === email) {
      return userDatabase[user].id;
    }
  }
  return false;
};

module.exports = findIdByEmail;