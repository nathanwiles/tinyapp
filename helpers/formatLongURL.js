const { url } = require("inspector");

/**
 * checks if the string contains https
 *
 * @param {string}
 * @returns {string} HTTP:// or HTTPS://
 */
const getProtocol = (string = '') => {
  const HTTP = "http://";
  const HTTPS = "https://";
  return (string.includes("https") ? HTTPS : HTTP);
};


/**
 * Formats the longUrl to include http(s)://www. if it is not included.
 * also works if submittedLongUrl already contains "http(s)", "www.", or //
 * @param {*} submittedLongUrl
 *
 * @returns  {string} formattedLongUrl
 *
 */

const formatLongUrl = (longUrl) => {
  
  

  const splitLongUrl = longUrl.split(".");
  let firstSubstring = splitLongUrl[0];
  let urlPrefix = getProtocol(firstSubstring);
  let newLongUrl = "";
  if (firstSubstring.includes("//")) {

    splitFirstSubstring = firstSubstring.split("//");
    
    splitFirstSubstring.shift();
    splitFirstSubstring.unshift(urlPrefix);
    firstSubstring = splitFirstSubstring.join("");
    splitLongUrl[0] = firstSubstring;
    newLongUrl = splitLongUrl.join(".");
    
  } else {
    newLongUrl = urlPrefix + longUrl;
  }
  return newLongUrl;
};

module.exports = formatLongUrl;
