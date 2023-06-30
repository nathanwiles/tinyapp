/**
 * @description Checks if email exists in userDatabase
 * @param {string} email
 * @param {object} userDatabase
 * @returns {boolean} true if email exists in userDatabase, false otherwise
 */

const userExists = (email, userDatabase) => {
  for (const user in userDatabase) {
    if (userDatabase[user].email === email) {
      return user.id;
    }
  }
  return false;
};

module.exports = userExists;