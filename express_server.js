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
} = require("./helpers/index");


const databasePath = "./data/database.json";

class User {
  constructor(username, password) {
    id = generateRandomString(10);
    this.username = username;
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
      console.log("Source File Empty!\n");
      urls = {};
    } else {
      if (data) urls = JSON.parse(data);
      console.log("Imported Database:\n");
    }
  }
});


// Setup server
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");
let username = null;



// Middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  username = req.cookies.username;
  next();
});



// GET requests
app.get("/register", (req, res) => {
  const templateVars = {
    username,
  };
  res.render("user_register", templateVars);
});

app.get("/urls", (req, res) => {
  const templateVars = {
    urls: username !== null ? urls[username] : null,
    username,
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    username,
  };
  res.render("urls_new", templateVars);
});

app.get("/", (req, res) => {
  const templateVars = {
    username,
  };
  res.render("tinyapp_home", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urls.username);
});

app.get("/hello", (req, res) => {
  res.send("<html<body>Hello <b>World</b></body></html>\n");
});

app.get("/urls/:id", (req, res) => {
  const templateVars = {
    username,
  };
  const id = req.params.id;
  if (!urls[username][id]) {
    res.status(404);
    res.render("urls_404", templateVars);
  } else {
    templateVars.id = id;
    templateVars.longURL = urls[username][id];
  }
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  longURL = urls[username][req.params.id];
  res.redirect(longURL);
});



// Post requests
app.post("/urls", (req, res) => {
  const submittedLongURL = req.body.longURL;
  const newLongURL = formatLongURL(submittedLongURL);
  const newTinyURL = generateRandomString(6);
  urls[username][newTinyURL] = newLongURL;

  console.log(`Received new tinyURL, saving database...`);

  saveDatabase(databasePath, urls);

  res.redirect(`/urls/${newTinyURL}`);
});

app.post("/login", (req, res) => {
  username = req.body.username;
  if (!urls[username]) {
    urls[username] = {};
  }

  res.cookie("username", username);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  username = null;
  res.redirect("/");
});

app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  delete urls[username][id];
  console.log(`Deleted ${id} from database...`);
  saveDatabase(databasePath, urls);
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  const submittedLongURL = req.body.longURL;
  const newLongURL = formatLongURL(submittedLongURL);
  urls[username] ? urls[username] : (urls[username] = {}); // if user doesn't exist, create them-
  urls[username][id] = newLongURL;
  console.log(`Updated ${id} in ${username}'s database...`);
  saveDatabase(databasePath, urls);
  res.redirect("/urls");
});

// Listen for requests
app.listen(PORT, () => {
  console.log(`tinyapp listening on port ${PORT}!`);
});
