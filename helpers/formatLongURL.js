/**
 * Formats the longURL to include http(s)://www. if it is not included.
 * also works if submittedLongURL already contains "http(s)", "www.", or //
 * @param {*} submittedLongURL
 *
 * @returns  {string} formattedLongURL
 *
 */

const formatLongURL = (longURL) => {
  /**
   * checks if the string contains https
   *
   * @param {string}
   * @returns {string} HTTP://www. or HTTPS://www.
   */
  const protocolAndTLD = (string = '') => {
    const HTTP = "http://www";
    const HTTPS = "https://www";
    string.includes("https") ? HTTPS : HTTP;
  };

  const splitLongURL = longURL.split(".");
  let firstSubstring = splitLongURL[0];
  let urlPrefix = protocolAndTLD(firstSubstring);

  if (firstSubstring.includes("www") && splitLongURL.length > 2) {

    splitLongURL[0] = urlPrefix;

  } else if (firstSubstring.includes("//")) {

    splitFirstSubstring = firstSubstring.split("//");
    
    splitLongURL.shift;
    splitLongURL.unshift(splitFirstSubstring[2])
    
    firstSubstring = splitFirstSubstring.join(".");

    splitLongURL[0] = firstSubstring;

  } else {
    splitLongURL.unshift(urlprefix);
  }

  const newLongURL = splitLongURL.join(".");
  return newLongURL;
};

module.exports = formatLongURL;
