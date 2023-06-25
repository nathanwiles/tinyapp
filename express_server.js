/*
 * Written by: Nathan Wiles
 * Description: This file contains the server code for the TinyApp project.
 * It is responsible for handling all requests and responses.
 * It imports its database from the database.json file and saves it on server shutdown.
 */

const { generateTinyURL } = require("./helpers/generateTinyURL");
const express = require("express");
const formatLongURL = require("./helpers/formatLongURL");
const fs = require("fs");


// Import database
fs.readFile("./data/database.json", (err, data) => {
  if (err) console.log(err);

  // if no error, assign parsed data and log it
  const urlDatabase = JSON.parse(data);
  console.log("Imported Database:\n", urlDatabase);

  // Setup server
  const app = express();
  const PORT = 8080; // default port 8080
  app.set("view engine", "ejs");

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
    res.render("tinyapp_home");
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
    let reqLongURL = req.body.longURL;

    const newLongURL = formatLongURL(reqLongURL);
    const newTinyURL = generateTinyURL();


    urlDatabase[newTinyURL] = newLongURL;
    console.log(`Received new tinyURL, saving database...`);
    fs.writeFile("./data/database.json", JSON.stringify(urlDatabase),"utf-8", (err) => {
      if (err) console.log(err);
      console.log("Database saved!");
    });

    res.redirect(`/urls/${newTinyURL}`);
  });

  // Listen for requests
  app.listen(PORT, () => {
    console.log(`tinyapp listening on port ${PORT}!`);
  });
});
