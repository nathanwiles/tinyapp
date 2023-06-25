/**
 * created by Nathan Wiles
 * tinyapp project
 */

// Setup server
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");

// data base
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

// generate random string function
const generateTinyURL = function() {
  let tinyURL = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    const randomChar = characters[randomIndex];
    tinyURL += randomChar;
  }
  return tinyURL;
};

// Middleware
app.use(express.urlencoded({ extended: true }));

// GET requests
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html<body>Hello <b>World</b></body></html>\n");
});

app.get("/urls/:id", (req, res) => {
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
  };
  res.render("urls_show", templateVars);
});

// Post requests
app.post("/urls", (req, res) => {
  const newLongURL = req.body.longURL;
  const newTinyURL = generateTinyURL();
  urlDatabase[newTinyURL] = newLongURL;
  
  res.redirect(`/urls/${newTinyURL}`); 
});

// Listen for requests
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
