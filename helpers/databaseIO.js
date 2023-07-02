const fs = require("fs");

/**
 * @param {string} filePath
 * 
 * @description: This function reads a JSON file and returns a promise to parse the data
 * 
 * @returns  {Promise} returns parsedData on success.
 */

function readDatabase(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        const parsedData = data ? JSON.parse(data) : {};
        resolve(parsedData);
      }
    });
  });
}


/**
 * 
 * @param {*} filePath 
 * @param {*} data 
 * 
 * @description: This function returns a promise to write JSON data to a specified file.
 * 
 * @returns {Promise} returns nothing on success.
 */
function saveDatabase(filePath, data) {
  return new Promise((resolve, reject) => {
    const stringData = JSON.stringify(data, null, 2);
    fs.writeFile(filePath, stringData, "utf-8", (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

module.exports = { readDatabase, saveDatabase };