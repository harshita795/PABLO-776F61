const express = require("express");
require("dotenv").config();
const app = express();
const createNewUser = require("./controllers/createNewUser.js");
const { searchImages } = require("./controllers/searchImages.js");
const { sequelize } = require("./models/index.js");
const { saveImages } = require("./controllers/saveImages.js");

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.post("/api/users", createNewUser);
app.get("/api/search/photos", searchImages);
app.post("/api/photos", saveImages);

sequelize
  .authenticate()
  .then(() => {
    console.log("database connected");
  })
  .catch((error) => {
    console.error("Unable to connect to database", error);
  });

app.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`);
});
