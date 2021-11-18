const mongoose = require("mongoose");
const config = require('../config');

mongoose.connect(config.MONGODB.URL + "/youtube_videos", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

module.exports = {
  db,
};
