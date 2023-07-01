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
  userExists,
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
let email = null;

// Middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  email = req.cookies.email;
  next();
});

// GET requests
app.get("/register", (req, res) => {
  const templateVars = {
    email,
  };
  res.render("user_register", templateVars);
});

app.get("/login", (req, res) => {
  const templateVars = {
    email,
  };
  res.render("user_login", templateVars);
});

app.get("/urls", (req, res) => {
  const templateVars = {
    urls: email !== null ? urls[email] : null,
    email,
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    email,
  };
  res.render("urls_new", templateVars);
});

app.get("/", (req, res) => {
  const templateVars = {
    email,
  };
  res.render("tinyapp_home", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urls.email);
});

app.get("/hello", (req, res) => {
  res.send("<html<body>Hello <b>World</b></body></html>\n");
});

app.get("/urls/:id", (req, res) => {
  const templateVars = {
    email,
  };
  const id = req.params.id;
  if (!urls[email][id]) {
    res.status(404);
    res.render("urls_404", templateVars);
  } else {
    templateVars.id = id;
    templateVars.longURL = urls[email][id];
  }
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  longURL = urls[email][req.params.id];
  res.redirect(longURL);
});

// Post requests
app.post("/urls", (req, res) => {
  const submittedLongURL = req.body.longURL;
  const newLongURL = formatLongURL(submittedLongURL);
  const newTinyURL = generateRandomString(6);
  urls[email] ? urls[email] : (urls[email] = {}); // if user doesn't exist, create them-
  urls[email][newTinyURL] = newLongURL;

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

  if (userExists(email, users)) {
    res.status(400);
    res.send("400 Bad Request: Email already registered");
  } else {
    users[newUser.id] = newUser;
    saveDatabase(userDatabasePath, users);
    res.cookie("email", email);
    res.redirect("/urls");
  }
});

app.post("/login", (req, res) => {
  loginEmail = req.body.email;
  password = req.body.password;
  let userId = userExists(loginEmail, users);
  if (userId && users[userId].password === password) {
    email = loginEmail;
    res.cookie("email", email);
  } else {
    res.status(403);
    res.send("403: Invalid Username or Password");
  }

  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("email");
  email = null;
  res.redirect("/");
});

app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  delete urls[email][id];
  console.log(`Deleted ${id} from database...`);
  saveDatabase(urlDatabasePath, urls);
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  const submittedLongURL = req.body.longURL;
  const newLongURL = formatLongURL(submittedLongURL);
  urls[email][id] = newLongURL;
  console.log(`Updated ${id} in ${email}'s database...`);
  saveDatabase(urlDatabasePath, urls);
  res.redirect("/urls");
});

// Listen for requests
app.listen(PORT, () => {
  console.log(`tinyapp listening on port ${PORT}!`);
});
