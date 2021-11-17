const mongoose = require("mongoose");
const { db } = require("./mongo");

const videoSchema = new mongoose.Schema({
  publishedAt: Date,
  videoId: String,
  title: String,
  description: String,
  thumbnails: Object,
});
videoSchema.index({ videoId: 1 }, { unique: true });
videoSchema.index({ title: "text", description: "text" });

const Video = db.model("videos", videoSchema);

module.exports = {
  Video,
};
