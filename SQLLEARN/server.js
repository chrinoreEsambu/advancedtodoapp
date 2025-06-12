const express = require("express");
const path = require("path");
const app = express();
const bodyparser = require("body-parser");
const os = require("os");
const ip = require("ip");
const session = require("express-session");
const cors = require("cors");
require("dotenv").config();

const {
  middleware,
  validate,
  usersession,
} = require("./middleware/middleware");
const router = require("./routes/userRoutes");

app.use(middleware);
app.use(router);
app.use(validate);
app.use(usersession);
app.use(express.Router);
const port = process.env.PORT || 5000;
(async () => {
  try {
    app.listen(port, "0.0.0.0", () => {
      console.log(`Server runnig on port http://localhost:${port}`);
    });
  } catch (error) {
    console.log("error durring the server start ", error);
  }
})();

// const localip = getWifiIP();
// const { connexion } = require("./connection/dbconnection");
// const getWifiIP = () => {
//   const interfaces = os.networkInterfaces();
//   return (
//     (interfaces["Wi-Fi"] &&
//       interfaces["Wi-Fi"].find((i) => i.family === "IPv4")?.address) ||
//     ip.address()
//   );
// };
