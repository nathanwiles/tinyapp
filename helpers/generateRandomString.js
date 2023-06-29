/**
 * @param {length} number representing the length of the string to be generated
 * @returns {string} a random string of 10 characters
 */

const generateRandomString = function (length) {
  let string = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length ; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    const randomChar = characters[randomIndex];
    string += randomChar;
  }
  return string;
}

module.exports = generateRandomString;