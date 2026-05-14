import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import viewEngine from "./config/viewEngine.js";
import initWebRoute from "./routes/web.js";
import initApiRoute from "./routes/api.js";
import configDB from "./config/configdb.js";

require("dotenv").config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

app.options(/.*/, cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT;

viewEngine(app);
initWebRoute(app);
initApiRoute(app);
configDB();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
