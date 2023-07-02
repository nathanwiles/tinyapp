/*
 * Written by: Nathan Wiles
 * Description: This file contains the server code for the TinyApp project.
 */
const express = require("express");
const routes = require("./routes");

// Setup server
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");
let userId;

// Utilize routes
app.use(routes);

// Listen for requests
app.listen(PORT, () => {
  console.log(`tinyapp listening on port ${PORT}!`);
});
