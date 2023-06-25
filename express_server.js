/**
 * created by Nathan Wiles
 * tinyapp project
 */

// import Database
const { urlDatabase } = require("./data/urlDatabase");
const { generateTinyURL } = require("./helpers/generateTinyURL");
// Setup server
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");

// get database




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
  if (!urlDatabase[req.params.id]) {
    res.status(404);
    res.render("urls_404");
  } else {
    const templateVars = {
      id: req.params.id,
      longURL: urlDatabase[req.params.id],
    };
    res.render("urls_show", templateVars);
  }
});

app.get("/u/:id", (req, res) => {
  longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
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
