const express = require("express");
const path = require("path");
const app = express();
const bodyparser = require("body-parser");
const os = require("os");
const ip = require("ip");
const mysql = require("mysql2/promise");
require("dotenv").config();
const {
  middleware,
  staticfiles,
  parser,
  limit,
  limiter,
  ipuser,
  redirection,
} = require("./middleware/middleware");
const { connexion } = require("./connection/dbconnection");

const {
  datapost,
  userfind,
  uniqueFind,
  updatingDAta,
  putdata,
  delUser,
  userconect,
  createuser,
  getuser,
  getuser_byid,
} = require("./routes/userRoutes");

const port = process.env.PORT || 5000;

// const getWifiIP = () => {
//   const interfaces = os.networkInterfaces();
//   return (
//     (interfaces["Wi-Fi"] &&
//       interfaces["Wi-Fi"].find((i) => i.family === "IPv4")?.address) ||
//     ip.address()
//   );
// };

app.use(middleware);
app.use(staticfiles);
app.use(limiter);
app.use(createuser);
app.use(getuser);
app.use(getuser_byid);
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
