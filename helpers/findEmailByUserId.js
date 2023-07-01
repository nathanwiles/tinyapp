/**
 * @param {string} id
 * @param {object} userDatabase
 * 
 * @returns {string} email
 * 
 */

const findEmailByUserId = (id, userDatabase) => {
  for (const user in userDatabase) {
    if (userDatabase[user].id === id) {
      return userDatabase[user].email;
    }
  }
  return null;
}

module.exports = findEmailByUserId;