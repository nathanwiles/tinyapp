/**
 * Routes for TinyApp
 * @module routes
 * responsible for handling all requests and responses.
 * imports databases from the .json files and saves on change.
 */
const express = require("express");
const router = express.Router();
const User = require("./models/user");
const { urlDatabasePath, userDatabasePath } = require("./data/constants");
const bcrypt = require("bcryptjs");
const cookieSession = require("cookie-session");
const methodOverride = require("method-override");

const {
  formatLongURL,
  generateRandomString,
  readDatabase,
  saveDatabase,
  findIdByEmail,
  findUrlsByUserId,
  findEmailByUserId,
} = require("./helpers/helpersIndex");

// Import database
let urls = {};
readDatabase(urlDatabasePath)
  .then((data) => {
    urls = data;
    console.log("Imported URL Database:\n");
  })
  .catch((err) => {
    console.error(err);
    urls = {};
  });

let users;
readDatabase(userDatabasePath)
  .then((data) => {
    users = data;
    console.log("Imported User Database:\n");
  })
  .catch((err) => {
    console.error(err);
    users = {};
  });

// Middleware
router.use(express.urlencoded({ extended: true }));
router.use(methodOverride("_method"));
router.use(
  cookieSession({
    name: "user_id",
    keys: [generateRandomString(20), generateRandomString(20)],
    maxAge: 24 * 60 * 60 * 1000,
  })
);
router.use(
  cookieSession({
    name: "unique_id",
    keys: [generateRandomString(20), generateRandomString(20)],
    maxAge: 60 * 60 * 1000,
  })
);

router.use((req, res, next) => {
  if (req.session.user_id) {
    userId = req.session.user_id;
  } else {
    userId = false;
  }
  next();
});

// GET requests
router.get("/register", (req, res) => {
  if (userId) {
    res.redirect("/urls");
  } else {
    res.render("user_register", { email: findEmailByUserId(userId, users) });
  }
});

router.get("/login", (req, res) => {
  if (userId) {
    res.redirect("/urls");
  } else {
    res.render("user_login", { email: findEmailByUserId(userId, users) });
  }
});

router.get("/urls", (req, res) => {
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

router.get("/urls/new", (req, res) => {
  if (!userId) {
    res.redirect("/login");
  } else {
    res.render("urls_new", { email: findEmailByUserId(userId, users) });
  }
});

router.get("/", (req, res) => {
  res.render("tinyapp_home", { email: findEmailByUserId(userId, users) });
});

router.get("/urls.json", (req, res) => {
  if (userId) {
    res.json(getUrlsByUser(userId, urls));
  } else {
    res.status(401).render("urls_error", {
      email: false,
      error: "Please login to view and edit URLs",
    });
  }
});

router.get("/hello", (req, res) => {
  res.send("<html<body>Hello <b>World</b></body></html>\n");
});

router.get("/urls/:urlId", (req, res) => {
  if (!userId) {
    res.status(401).render("urls_error", {
      email: false,
      error: "Please login to view and edit URLs",
    });
  } else {
    const urlId = req.params.urlId;
    const email = findEmailByUserId(userId, users);
    if (!urls[urlId]) {
      res
        .status(404)
        .render("urls_error", { email, error: `URL: ${urlId} not found` });
    } else if (urls[urlId].userId !== userId) {
      res.status(403).render("urls_error", {
        email,
        error: "You do not have permission to view or edit this URL",
      });
    } else {
      const templateVars = {
        urlId,
        email,
        longURL: urls[urlId].longURL,
        visits: urls[urlId].visits,
        uniqueVisits: urls[urlId].uniqueVisits,
        visitors: urls[urlId].visitors,
      };
      res.status(200).render("urls_show", templateVars);
    }
  }
});

router.get("/u/:id", (req, res) => {
  const urlId = req.params.id;

  if (urls[urlId]) {
    const longURL = urls[urlId].longURL;
    const timeStamp = new Date();
    if (!req.session.unique_id) {
      req.session.unique_id = generateRandomString(20);
    }
    const sessionID = req.session.unique_id;
    
    urls[urlId].visits++;
    //check if visitor has visited url before
    if (!urls[urlId].visitors.some((visitor) => visitor.sessionID === sessionID)) {
      urls[urlId].uniqueVisits++;
      console.log("New unique visitor, saving database...");
    }

    urls[urlId].visitors.push({
      timeStamp,
      sessionID,
    });
    console.log(`Received new visit, saving database...`);
    saveDatabase(urlDatabasePath, urls);
  
    res.redirect(longURL);
  } else {
    res.render("urls_error", {
      email: findEmailByUserId(userId, users),
      error: "URL not found",
    });
  }
});

// Post requests
router.post("/urls", (req, res) => {
  const submittedLongURL = req.body.longURL;
  const newLongURL = formatLongURL(submittedLongURL);
  const newTinyURL = generateRandomString(6);

  urls[newTinyURL] = {
    longURL: newLongURL,
    userId: userId,
    visits: 0,
    uniqueVisits: 0,
    visitors: [],
  };
  console.log(`Received new tinyURL, saving database...`);

  saveDatabase(urlDatabasePath, urls);

  res.redirect(`/urls/${newTinyURL}`);
});

router.post("/register", (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).render("urls_error", {
      email: false,
      error: "Missing email or password",
    });
  } else {
    email = req.body.email;
    const password = bcrypt.hashSync(req.body.password, 10);
    const newUser = new User(email, password);

    if (findIdByEmail(email, users)) {
      res.status(400).render("urls_error", {
        email: false,
        error: "Email already registered",
      });
    } else {
      users[newUser.id] = newUser;
      saveDatabase(userDatabasePath, users);
      res.session.user_id = newUser.id;
      res.redirect("/urls");
    }
  }
});

router.post("/login", (req, res) => {
  const loginEmail = req.body.email;

  let userId = findIdByEmail(loginEmail, users);
  if (userId && bcrypt.compareSync(req.body.password, users[userId].password)) {
    req.session.user_id = userId;
    res.redirect("/urls");
  } else {
    res.status(403).render("urls_error", {
      email: false,
      error: "Invalid Username or Password",
    });
  }
});

router.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

router.delete("/urls/:urlId/delete", (req, res) => {
  const urlId = req.params.urlId;
  if (!urls[urlId]) {
    res.status(404).send("URL not found");
  } else if (!userId) {
    res.status(401).send("Please login to delete URLs");
  } else if (urls[urlId].userId !== userId) {
    res.status(403).send("You do not have permission to delete this URL");
  } else {
    delete urls[urlId];
    console.log(`Deleted ${urlId} from database...`);
    saveDatabase(urlDatabasePath, urls);
    res.redirect("/urls");
  }
});

router.put("/urls/:id", (req, res) => {
  if (!urls[req.params.id]) {
    res.status(404).send("URL not found");
  } else if (!userId) {
    res.status(401).send("Please login to edit URLs");
  } else if (urls[req.params.id].userId !== userId) {
    res.status(403).send("You do not have permission to edit this URL");
  } else {
    const urlId = req.params.id;
    const submittedLongURL = req.body.longURL;
    const newLongURL = formatLongURL(submittedLongURL);
    urls[urlId].longURL = newLongURL;
    urls[urlId].userId = userId;
    console.log(`Updated ${urlId} in ${userId}'s database...`);
    saveDatabase(urlDatabasePath, urls);
    res.redirect("/urls");
  }
});

module.exports = router;
