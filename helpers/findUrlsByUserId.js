/**
 * @description Find all urls by user
 * 
 * @param {string} id - user id
 * @param {object} urlDatabase - url database
 * @returns {object} urls - urls by user
 * 
 * @example
 * findUrlsByUser("userRandomID", urlDatabase);
 */

const findUrlsByUserId = (id, urlDatabase) => {
  const urls = {};
  for (const url in urlDatabase) {
    if (urlDatabase[url].userId === id) {
      urls[url] = urlDatabase[url];
    }
  }
  return urls;
}

/*
const test = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userId: "userRandomID" },
  "9sm5xK": { longURL: "http://www.google.com", userId: "userRandomID" },
  "9sm5xK": { longURL: "http://www.google.com", userId: "userRandomID" },
}

findUrlsByUserId("userRandomID", test);
*/


module.exports = findUrlsByUserId;