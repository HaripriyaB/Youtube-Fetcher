const { default: axios } = require("axios");
const express = require("express");
const _ = require("lodash");
const { Video } = require("./video");
const router = express.Router();
const cron = require("node-cron");
const config = require("../config");

const API_KEY = config.KEYS;
let index = 0;
const PRE_DEFINED_SEARCH_QUERY = "Goa";

router.get("/videos-by-query", async (req, res) => {
  try {
    const searchQuery = req.query.q.toLowerCase();
    const requestConfig = {
      method: "get",
      url: `${config.GOOGLE_URL}?key=${API_KEY[index]}&q=${searchQuery}&part=snippet&maxResults=20`,
    };
    const response = await axios(requestConfig);
    const result = [];
    response.data.items.forEach((item) => {
      const object = _.pick(item.snippet, [
        "publishedAt",
        "title",
        "description",
        "thumbnails",
      ]);
      object.videoId = item.id.videoId;
      result.push(object);
    });
    console.log("TOTAL:::", result.length);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.send("Something went wrong");
  }
});

router.get("/saved-videos", async (req, res) => {
  try {
    const limit = parseInt(req.query.size.toString()) || 10;
    const offset = parseInt(req.query.offset.toString()) || 0;
    const searchQuery = { $text: { $search: req.query.q || "" } };
    const result = await Video.find(req.query.q && searchQuery)
      .sort({ publishedAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean();
    const filteredResults = _.map(result, (object) => {
      return _.omit(object, ["_id", "__v"]);
    });
    res.send(filteredResults);
  } catch (error) {
    console.log(error);
    res.send("Something went wrong");
  }
});

cron.schedule("*/20 * * * * *", async function () {
  try {
    const soFarFetched = await Video.findOne({}).sort({ publishedAt: -1 });
    let dateTime = new Date("January 01, 2020 00:00:01").toISOString(); //Default
    if (soFarFetched && soFarFetched.publishedAt) {
      dateTime = new Date(soFarFetched.publishedAt).toISOString();
    }
    console.log(dateTime);
    const requestConfig = {
      method: "get",
      url: `${config.GOOGLE_URL}?key=${API_KEY[index]}&q=${PRE_DEFINED_SEARCH_QUERY}&type=video&order=date&part=snippet&maxResults=20&publishedAfter=${dateTime}`,
    };
    const response = await axios(requestConfig);
    if (response.status === 403) {
      if (index < API_KEY.length) {
        index += 1;
      } else {
        process.exit(
          "Sorry api limit reached. Create new Api keys and add it to the API_KEY list"
        );
      }
    }
    const result = [];
    response.data.items.forEach((item) => {
      const object = _.pick(item.snippet, [
        "publishedAt",
        "title",
        "description",
        "thumbnails",
      ]);
      object["videoId"] = item.id.videoId;
      result.push(object);
    });
    await Video.insertMany(result, { ordered: false });
    console.log(`Last Dump: ${new Date(Date.now()).toUTCString()}`);
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
