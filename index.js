const express = require("express");
require("dotenv").config();
const app = express();
const { sequelize } = require("./models/index.js");

// Import route files
const userRoutes = require("./routes/userRoutes.js");
const photoRoutes = require("./routes/photoRoutes.js");
const historyRoutes = require("./routes/historyRoutes.js");

app.use(express.json());

// Use the imported routes
app.use(userRoutes);
app.use(photoRoutes);
app.use(historyRoutes);

const PORT = process.env.PORT || 3000;

// Authenticate and connect to the database
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.error("Unable to connect to the database", error);
  });

// Start the server
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running at port: ${PORT}`);
  });
}

module.exports = { app };
