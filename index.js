/**
 * Author: Haripriya Baskaran
 * Start Date: 12 Nov 2021 12:17 am (approx.)
 * End Date: TBD
 * Desc: To make an API to fetch latest videos sorted in reverse chronological order of their publishing date-time from YouTube for a given tag/search query in a paginated response.
 */
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const youtube = require("./models/youtube");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//MIDDLEWARES
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//ROUTE
app.use("/", youtube);

//STARTING SERVER
app.listen(port, () => {
  console.log(`Igniting server at ${port}`);
});
