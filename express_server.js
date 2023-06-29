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

let users = {};
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
  urls[email][newTinyURL] = newLongURL;

  console.log(`Received new tinyURL, saving database...`);

  saveDatabase(databasePath, urls);

  res.redirect(`/urls/${newTinyURL}`);
});
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const newUser = new User(email, password);
  for (const user in users) {
    if (user.email === email) {
      res.status(400);
      res.send("Username already exists!");
    }
  }
  users[newUser.id] = newUser;
  res.cookie("email", email);
  res.redirect("/urls");
});
  

app.post("/login", (req, res) => {
  email = req.body.email;
  res.cookie("email", email);
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
  saveDatabase(databasePath, urls);
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  const submittedLongURL = req.body.longURL;
  const newLongURL = formatLongURL(submittedLongURL);
  urls[email] ? urls[email] : (urls[email] = {}); // if user doesn't exist, create them-
  urls[email][id] = newLongURL;
  console.log(`Updated ${id} in ${email}'s database...`);
  saveDatabase(databasePath, urls);
  res.redirect("/urls");
});

// Listen for requests
app.listen(PORT, () => {
  console.log(`tinyapp listening on port ${PORT}!`);
});
