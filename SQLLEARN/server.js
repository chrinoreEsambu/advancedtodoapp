const express = require("express");
const path = require("path");
const app = express();
require("dotenv").config();

const {
  middleware,
  usersession,
  schekrole,
  allowOrigin,
  corsi,
  staticfiles,
} = require("./middleware/middleware");
const router = require("./routes/userRoutes");

const port = process.env.PORT || 5000;

app.set("trust proxy", 1);

app.use(corsi);
app.use(middleware);
app.use(usersession);

if (typeof staticfiles !== "undefined") {
  app.use(staticfiles);
}

app.use(router);

// app.use(schekrole);

(async () => {
  try {
    app.listen(port, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.log("error starting the server", error);
  }
})();