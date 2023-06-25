/**
 * saves a database to a specified path:
 * @param {*} path location of the database file
 * @param {*} database the database object to save
 * logs message to server console when a database is saved
 */

const saveDatabase = (path, database) => {
  fs.writeFile(path, JSON.stringify(database), "utf-8", (err) => {
    if (err) console.log(err);
    console.log(`Database saved! in ${path}`);
  });
};

module.exports = saveDatabase;
