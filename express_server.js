/*
 * Written by: Nathan Wiles
 * Description: This file contains the server code for the TinyApp project.
 */
const express = require("express");
const routes = require("./routes");
const { PORT } = require("./data/constants")
// Setup server
const app = express();; 
app.set("view engine", "ejs");
let userId;

// Utilize routes
app.use(routes);

// Listen for requests
app.listen(PORT, () => { // default port 8080
  console.log(`tinyapp listening on port ${PORT}!`);
});
