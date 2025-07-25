const express = require("express");
const path = require("path");
const app = express();
const bodyparser = require("body-parser");
const os = require("os");
const ip = require("ip");
const session = require("express-session");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");

require("dotenv").config();
const {
  middleware,
  validate,
  usersession,
  schekrole,
  allowOrigin,
} = require("./middleware/middleware");
const router = require("./routes/userRoutes");

app.use(usersession);

app.use(middleware);
app.use(router);

app.use(validate);

app.use(express.Router);
app.use(schekrole);
const port = process.env.PORT || 5000;

// const io = new Server(Server, {
//   cors: { origin: [allowOrigin], credentials: true },
// });

(async () => {
  try {
    app.listen(port, "0.0.0.0", () => {
      console.log(`Server runnig on http://localhost:${port}`);
    });
  } catch (error) {
    console.log("error starting the server", error);
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
