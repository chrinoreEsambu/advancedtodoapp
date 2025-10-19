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

// IMPORTANT : permet aux cookies sécurisés de fonctionner derrière un proxy (Render)
app.set("trust proxy", 1);

// Ordre recommandé : CORS -> body parser -> session -> static -> routes
app.use(corsi);
app.use(middleware); // middleware exporté (express.json())
app.use(usersession);

// sert les fichiers statiques si exporté depuis middleware
if (typeof staticfiles !== "undefined") {
  app.use(staticfiles);
}

// routes (conservez l'usage existant de router dans votre projet)
app.use(router);

// middleware de contrôle de rôle (à appliquer seulement sur les routes admin si besoin)
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
