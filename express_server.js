/*
 * Written by: Nathan Wiles
 * Description: This file contains the server code for the TinyApp project.
 */
const express = require("express");
const cookieParser = require("cookie-parser");
const routes = require("./routes");


// Setup server
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");
let userId;

// Middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(routes,)
// Listen for requests
app.listen(PORT, () => {
  console.log(`tinyapp listening on port ${PORT}!`);
});
