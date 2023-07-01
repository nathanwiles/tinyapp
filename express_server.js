/*
 * Written by: Nathan Wiles
 * Description: This file contains the server code for the TinyApp project.
 * It is responsible for handling all requests and responses.
 * It imports its database from the database.json file and saves it on server shutdown.
 */
const express = require("express");
const fs = require("fs");
const cookieParser = require("cookie-parser");

const {
  formatLongURL,
  generateRandomString,
  saveDatabase,
  findIdByEmail,
  findUrlsByUserId,
  findEmailByUserId,
} = require("./helpers/index");

const urlDatabasePath = "./data/database.json";
const userDatabasePath = "./data/user_data.json";
class User {
  constructor(email, password) {
    this.id = generateRandomString(10);
    this.email = email;
    this.password = password;
  }
}

// Import database
let urls = {};
fs.readFile("./data/database.json", "utf-8", (err, data) => {
  if (err) {
    console.log(err);
  } else {
    // if no error, assign parsed data and log it
    if (!data) {
      console.log("URL Database empty!\n");
      urls = {};
    } else {
      urls = JSON.parse(data);
      console.log("Imported URL Database:\n");
    }
  }
});

let users;
fs.readFile("./data/user_data.json", "utf-8", (err, data) => {
  if (err) {
    console.log(err);
  } else if (!data) {
    console.log("User Database empty!\n");
    users = {};
  } else {
    users = JSON.parse(data);
    console.log("Imported User Database:\n");
  }
});

// Setup server
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");
let userId;

// Middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  if (req.cookies.user_id) {
    userId = req.cookies.user_id;
  } else {
    userId = null;
  }
  next();
});

// GET requests
app.get("/register", (req, res) => {
  if (userId) {
    res.redirect("/urls");
  }
  res.render("user_register", {email :findEmailByUserId(userId, users)});
});

app.get("/login", (req, res) => {
  if (userId) {
    res.redirect("/urls");
  }
  
  res.render("user_login", {email :findEmailByUserId(userId, users)});
});

app.get("/urls", (req, res) => {
  const templateVars = {
    userId,
    email: findEmailByUserId(userId, users),
    userUrls: findUrlsByUserId(userId, urls),
  };
  if (!userId) {
    res.redirect("/login");
  } else {
    res.render("urls_index", templateVars);
  }
});

app.get("/urls/new", (req, res) => {

  if (!userId) {
    res.redirect("/login");
  } else {
    res.render("urls_new", {email :findEmailByUserId(userId, users)});
  }
});

app.get("/", (req, res) => {
  res.render("tinyapp_home", {email :findEmailByUserId(userId, users)});
});

app.get("/urls.json", (req, res) => {
  if (userId) {
    res.json(getUrlsByUser(userId, urls));
  } else {
    res.status(401);
    res.render("urls_error", {email : false, error : "Please login to view and edit URLs"})
  }
});

app.get("/hello", (req, res) => {
  res.send("<html<body>Hello <b>World</b></body></html>\n");
});

app.get("/urls/:urlId", (req, res) => {
  if (!userId) {
    res.status(401);
    res.render("urls_error", {email : false, error : "Please login to view and edit URLs"});
  } else {
    const urlId = req.params.urlId;
    const email = findEmailByUserId(userId, users);
    const templateVars = {
      urlId : req.params.urlId,
      longURL: urlId ? urls[urlId].longURL : null,
      email,
    };
    if (!urls[urlId]) {
      res.status(404);
      res.render("urls_error", {email, error : `URL: ${urlId} not found`});
    }

    res.render("urls_show", templateVars);
  }
});

app.get("/u/:id", (req, res) => {
  const urlId = req.params.id;
  const longURL = urls[urlId].longURL;

  if (urls[urlId]) {
    res.redirect(longURL);
  }

  res.status(404);
  res.render("urls_error", {email : findEmailByUserId(userId, users), error : "URL not found"});
});

// Post requests
app.post("/urls", (req, res) => {
  const submittedLongURL = req.body.longURL;
  const newLongURL = formatLongURL(submittedLongURL);
  const newTinyURL = generateRandomString(6);
  urls[newTinyURL] = {};
  urls[newTinyURL].longURL = newLongURL;
  urls[newTinyURL].userId = userId;

  console.log(`Received new tinyURL, saving database...`);

  saveDatabase(urlDatabasePath, urls);

  res.redirect(`/urls/${newTinyURL}`);
});
app.post("/register", (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(400);
    res.send("400 Bad Request: Missing email or password");
  }

  email = req.body.email;
  const password = req.body.password;
  const newUser = new User(email, password);

  if (findIdByEmail(email, users)) {
    res.status(400);
    res.send("400 Bad Request: Email already registered");
  } else {
    users[newUser.id] = newUser;
    saveDatabase(userDatabasePath, users);
    res.cookie("user_id", newUser.id);
    res.redirect("/urls");
  }
});

app.post("/login", (req, res) => {
  loginEmail = req.body.email;
  password = req.body.password;
  let userId = findIdByEmail(loginEmail, users);
  if (userId && users[userId].password === password) {
    res.cookie("user_id", userId);
  } else {
    res.status(403);
    res.send("403: Invalid Username or Password");
  }

  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
});

app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  delete urls[id];
  console.log(`Deleted ${id} from database...`);
  saveDatabase(urlDatabasePath, urls);
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  if (!userId) {
    res.status(401);
    res.send("You must be logged in to edit URLs");
  }
  const urlId = req.params.id;
  const userId = userId;
  const submittedLongURL = req.body.longURL;
  const newLongURL = formatLongURL(submittedLongURL);
  urls[urlId].longURL = newLongURL;
  urls[urlId].userId = userId;
  console.log(`Updated ${urlId} in ${userId}'s database...`);
  saveDatabase(urlDatabasePath, urls);
  res.redirect("/urls");
});

// Listen for requests
app.listen(PORT, () => {
  console.log(`tinyapp listening on port ${PORT}!`);
});
