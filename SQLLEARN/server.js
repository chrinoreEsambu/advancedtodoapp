const express = require("express");
const path = require("path");
const app = express();
const bodyparser = require("body-parser");
const os = require("os");
const ip = require("ip");
require("dotenv").config();

const {
  middleware,
  staticfiles,
  parser,
  limit,
  limiter,
  ipuser,
} = require("./middleware/middleware");

const router = require("./routes/userRoutes");
app.use(router);

const port = process.env.PORT || 5000;
app.use(express.Router);
// const { connexion } = require("./connection/dbconnection");
// const getWifiIP = () => {
//   const interfaces = os.networkInterfaces();
//   return (
//     (interfaces["Wi-Fi"] &&
//       interfaces["Wi-Fi"].find((i) => i.family === "IPv4")?.address) ||
//     ip.address()
//   );
// };

(async () => {
  try {
    // const localip = getWifiIP();
    app.listen(port, "0.0.0.0", () => {
      console.log(`Server runnig on port http://localhost:${port}`);
    });
  } catch (error) {
    console.log("error durring the server start ", error);
  }
})();
