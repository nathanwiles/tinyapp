/**
 * Routes for TinyApp
 * @module routes
 * responsible for handling all requests and responses.
 * imports databases from the .json files and saves on change.
 */

const express = require("express");
const router = express.Router();
const User = require("./helpers/userClass");
const { urlDatabasePath, userDatabasePath } = require("./data/constants");

const {
  formatLongURL,
  generateRandomString,
  readDatabase,
  saveDatabase,
  findIdByEmail,
  findUrlsByUserId,
  findEmailByUserId,
} = require("./helpers/index");

// Import database
let urls = {};
readDatabase("./data/database.json")
  .then((data) => {
    urls = data;
    console.log("Imported URL Database:\n");
  })
  .catch((err) => {
    console.error(err);
    urls = {};
  });

let users;
readDatabase("./data/user_data.json")
  .then((data) => {
    users = data;
    console.log("Imported User Database:\n");
  })
  .catch((err) => {
    console.error(err);
    users = {};
  });

// Middleware
router.use((req, res, next) => {
  if (req.cookies.user_id) {
    userId = req.cookies.user_id;
  } else {
    userId = null;
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
    const templateVars = {
      urlId: req.params.urlId,
      longURL: urlId ? urls[urlId].longURL : null,
      email,
    };
    if (urls[urlId].userId !== userId) {
      res.status(403).render("urls_error", {
        email,
        error: "You do not have permission to view or edit this URL",
      });
    } else if (!urls[urlId]) {
      res
        .status(404)
        .render("urls_error", { email, error: `URL: ${urlId} not found` });
    } else {
      res.status(200).render("urls_show", templateVars);
    }
  }
});

router.get("/u/:id", (req, res) => {
  const urlId = req.params.id;
  const longURL = urls[urlId].longURL;

  if (urls[urlId]) {
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
  urls[newTinyURL] = {};
  urls[newTinyURL].longURL = newLongURL;
  urls[newTinyURL].userId = userId;

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
    const password = req.body.password;
    const newUser = new User(email, password);

    if (findIdByEmail(email, users)) {
      res.status(400).render("urls_error", {
        email: false,
        error: "Email already registered",
      });
    } else {
      users[newUser.id] = newUser;
      saveDatabase(userDatabasePath, users);
      res.cookie("user_id", newUser.id);
      res.redirect("/urls");
    }
  }
});

router.post("/login", (req, res) => {
  loginEmail = req.body.email;
  password = req.body.password;
  let userId = findIdByEmail(loginEmail, users);
  if (userId && users[userId].password === password) {
    res.cookie("user_id", userId);
    res.redirect("/urls");
  } else {
    res.status(403).render("urls_error", {
      email: false,
      error: "Invalid Username or Password",
    });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
});

router.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;

  delete urls[id];
  console.log(`Deleted ${id} from database...`);
  saveDatabase(urlDatabasePath, urls);
  res.redirect("/urls");
});

router.post("/urls/:id", (req, res) => {
  if (!userId) {
    res.status(401).render("urls_error", {
      email: false,
      error: "Please login to view and edit URLs",
    });
  } else {
    const urlId = req.params.id;
    const userId = userId;
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
