const express = require("express");
const app = express();
const path = require("path");

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/shopping_cart.html"));
});

app.listen(5100, () => {
  console.log("Server is running on port 5100.");
});