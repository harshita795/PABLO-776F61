const axios = require("axios");
require("dotenv").config();

if (!process.env.UNSPLASH_ACCESS_KEY) {
  console.error({ error: "Unsplash API KEY is missing!" });
}

const axiosInstance = axios.create({
  baseURL: process.env.UNSPLASH_BASE_URL,
  headers: {
    Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
    "Content-Type": "application/json",
  },
});

module.exports = axiosInstance;
