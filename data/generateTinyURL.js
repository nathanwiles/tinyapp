// generate random string function
const generateTinyURL = function () {
  let tinyURL = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    const randomChar = characters[randomIndex];
    tinyURL += randomChar;
  }
  return tinyURL;
};

module.exports = { generateTinyURL };