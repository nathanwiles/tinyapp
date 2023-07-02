const {
  findIdByEmail,
  findUrlsByUserId,
  findEmailByUserId,
  generateRandomString,
  formatLongURL,
  readDatabase,
  saveDatabase,
} = require("../helpers/helpersIndex.js");

const { assert } = require("chai");

const testUrlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userId: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userId: "aJ48lW" },
  i3BoG1: { longURL: "https://www.facebook.ca", userId: "aJ48lW" },
};

const testUsers = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

describe("findIdByEmail", function () {
  it("should return a user with valid email", function () {
    const userId = findIdByEmail("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    assert.equal(userId, expectedUserID);
  });
  it("should return false if email does not exist in database", function () {
    const userId = findIdByEmail("user@notright.com", testUsers);
    const expectedUserID = false;
    assert.equal(userId, expectedUserID);
  });
});

describe("findUrlsByUserId", function () {
  it("should return an object of urls belonging to user id", function () {
    const urls = findUrlsByUserId("aJ48lW", testUrlDatabase);
    const expectedUrls = {
      b6UTxQ: { longURL: "https://www.tsn.ca", userId: "aJ48lW" },
      i3BoGr: { longURL: "https://www.google.ca", userId: "aJ48lW" },
      i3BoG1: { longURL: "https://www.facebook.ca", userId: "aJ48lW" },
    };
    assert.deepEqual(urls, expectedUrls);
  });
  it("should return an empty object if user has no urls", function () {
    const urls = findUrlsByUserId("aJ48ls", testUrlDatabase);
    const expectedUrls = {};
    assert.deepEqual(urls, expectedUrls);
  });
});

describe("findEmailByUserId", function () {
  it("should return an email belonging to user id", function () {
    const email = findEmailByUserId("userRandomID", testUsers);
    const expectedEmail = "user@example.com";
    assert.equal(email, expectedEmail);
  });
  it("should return false if user id does not exist in database", function () {
    const email = findEmailByUserId("userRandomID2", testUsers);
    const expectedEmail = false;
    assert.equal(email, expectedEmail);
  });
});

describe("generateRandomString", function () {
  it("should return a string of 6 characters", function () {
    const randomString = generateRandomString(6);
    const expectedLength = 6;
    assert.equal(randomString.length, expectedLength);
  });
});

describe("formatLongURL", function () {
  it("should return a string with http:// added to the beginning", function () {
    const formattedURL = formatLongURL("www.google.com");
    const expectedURL = "http://www.google.com";
    assert.equal(formattedURL, expectedURL);
  });
  it("should return a string with https:// added to the beginning", function () {
    const formattedURL = formatLongURL("https://www.google.com");
    const expectedURL = "https://www.google.com";
    assert.equal(formattedURL, expectedURL);
  });
});

describe("readDatabase", function () {
  it("should throw error if invalid file path", async function () {
    const database = await readDatabase("./test/invalid_path.json").catch(
      (err) => err);
    assert.equal(database, "Error: ENOENT: no such file or directory, open './test/invalid_path.json'");
  });
  it("should return object matching testUrlDatabase", async function () {
    const database = await readDatabase("./test/testUrlDatabase.json");
    assert.deepEqual(database, testUrlDatabase);
  });
});

describe("saveDatabase", function () {
  it("should return true on success", async function () {
    const bool = await saveDatabase(
      "./test/testUrlDatabase.json",
      testUrlDatabase
    ).then(() => true);
    assert.isTrue(bool);
  });

});
