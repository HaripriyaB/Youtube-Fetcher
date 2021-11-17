const mongoose = require("mongoose");
const uri = "mongodb://localhost:27017";

mongoose.connect(uri + "/youtube_videos", {
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
