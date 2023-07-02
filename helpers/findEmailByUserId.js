/**
 * @param {string} id
 * @param {object} userDatabase
 * 
 * @description This function will find the email of a user by their id
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
  return false;
}

module.exports = findEmailByUserId;