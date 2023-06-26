/*
 * Written by: Nathan Wiles
 * Description: This file contains the server code for the TinyApp project.
 * It is responsible for handling all requests and responses.
 * It imports its database from the database.json file and saves it on server shutdown.
 */
const express = require("express");
const fs = require("fs");
const cookieParser = require("cookie-parser");

const formatLongURL = require("./helpers/formatLongURL");
const generateTinyURL = require("./helpers/generateTinyURL");
const saveDatabase = require("./helpers/saveDatabase");
const databasePath = "./data/database.json";

// Import database
fs.readFile("./data/database.json", "utf-8", (err, data) => {
  
  let urls = {}; //object to store User urls

  if (err) {
    console.log(err);
  } else {
    // if no error, assign parsed data and log it
    if (!data) {
      console.log("Source File Empty!\n");
      urls = {};
    } else {
      if (data) urls = JSON.parse(data);
      console.log("Imported Database:\n", urls);
    }
  

    // Setup server
    const app = express();
    const PORT = 8080; // default port 8080
    app.set("view engine", "ejs");

    // Middleware
    app.use(cookieParser());
    app.use(express.urlencoded({ extended: true }));

    // GET requests
    app.get("/urls", (req, res) => {
      const templateVars = {
        urls,
        username: req.cookies.username,
      };
      res.render("urls_index", templateVars);
    });

    app.get("/urls/new", (req, res) => {
      const templateVars = {
        username: req.cookies["username"],
      };
      res.render("urls_new", templateVars);
    });

    app.get("/", (req, res) => {
      const templateVars = {
        username: req.cookies.username,
      };
      res.render("tinyapp_home", templateVars);
    });

    app.get("/urls.json", (req, res) => {
      res.json(urls);
    });

    app.get("/hello", (req, res) => {
      res.send("<html<body>Hello <b>World</b></body></html>\n");
    });

    app.get("/urls/:id", (req, res) => {
      const templateVars = {
        username: req.cookies.username,
      };
      if (!urls[req.params.id]) {
        res.status(404);
        res.render("urls_404", templateVars);
      } else {
        templateVars.id = req.params.id;
        templateVars.longURL = urls[req.params.id];
      }
      res.render("urls_show", templateVars);
    });

    app.get("/u/:id", (req, res) => {
      longURL = urls[req.params.id];
      res.redirect(longURL);
    });

    // Post requests
    app.post("/urls", (req, res) => {
      const submittedLongURL = req.body.longURL;
      const newLongURL = formatLongURL(submittedLongURL);
      const newTinyURL = generateTinyURL();

      urls[newTinyURL] = newLongURL;

      console.log(`Received new tinyURL, saving database...`);

      saveDatabase(databasePath, urls);

      res.redirect(`/urls/${newTinyURL}`);
    });

    app.post("/login", (req, res) => {
      const username = req.body.username;
      res.cookie("username", username);
      res.redirect("/urls");
    });

    app.post("/urls/:id/delete", (req, res) => {
      const id = req.params.id;
      delete urls[id];
      console.log(`Deleted ${id} from database...`);
      if (urls === undefined) urls = {};
      saveDatabase(databasePath, urls);
      res.redirect("/urls");
    });

    app.post("/urls/:id", (req, res) => {
      const id = req.params.id;
      const submittedLongURL = req.body.longURL;
      const newLongURL = formatLongURL(submittedLongURL);
      urls[id] = newLongURL;
      console.log(`Updated ${id} in database...`);
      saveDatabase(databasePath, urls);
      res.redirect("/urls");
    });

    // Listen for requests
    app.listen(PORT, () => {
      console.log(`tinyapp listening on port ${PORT}!`);
    });
  }
});
