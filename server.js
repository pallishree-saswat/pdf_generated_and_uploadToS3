const pdf = require("./app");
const express = require("express");
const app = express();



app.get("/", async (req, res) => {
  pdf();
  res.send("ok");
});

app.listen(1000, () => {
  console.log("server is running");
});
