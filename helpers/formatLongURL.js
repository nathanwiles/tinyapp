/**
 * Formats the longURL to include http://www. if it is not included.
 * 
 * @param {*} rawlongURL 
 * @returns  {string} formattedLongURL
 */

const formatLongURL = (longURL) => {
  
  const HTTPprefix = "http://www";
  const HTTPSprefix = "https://www";

  let splitLongURL = longURL.split(".");
  
  let firstElement = splitLongURL[0];
  
  // check if the first element contains http or www
  if (
    firstElement.includes("www") &&
    splitLongURL.length  > 2
    ) {

    firstElement = firstElement.includes("https") ? HTTPSprefix : HTTPprefix;
    splitLongURL[0] = firstElement;

  } else if (firstElement.includes("//")) {

    splitFirstElement = firstElement.split("//");

    splitFirstElement[0] = splitFirstElement[0].includes("https") ? HTTPSprefix : HTTPprefix;
    firstElement = splitFirstElement.join(".");

    splitLongURL[0] = firstElement;
  } else {
    splitLongURL.unshift(HTTPprefix);
  }

  const newLongURL = splitLongURL.join(".");
  return newLongURL;
}

module.exports = formatLongURL;