var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const getLink = require("./models/LinkScrapper");
const getEveryone = require("./models/Scrapper");
const {
  getPrivateFromMongoDB,
  getAllFromMongoDB,
  getByIDFromMongoDB,
} = require("./models/Database");
var app = express();

mongoose.set("strictQuery", false);
const key =
  "mongodb+srv://tuf:twofun1905@cluster0.ci77jcw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
main().catch((err) => console.log(err));
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.get("/getByIDFromMongoDB", async (req, res) => {
  try {
    const articleID = req.query.articleID;
    const allinfo = await getByIDFromMongoDB(articleID);
    res.json(allinfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/getAllMongoData", async (req, res) => {
  try {
    const data = await getAllFromMongoDB();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/getPrivateMongoData", async (req, res) => {
  try {
    const degisken = req.query.degisken; // query string parametresini al
    const data = await getPrivateFromMongoDB(degisken);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("Yeni bir bağlantı oluşturuldu.");

  ws.on("message", (message) => {
    console.log("İstemciden gelen mesaj:", message.toString());
    getLink(message.toString())
      .then((links) => {
        links.slice(0, 5).forEach((link) => {
          console.log(link.url);
          getEveryone(link.url, message.toString())
            .then((resp) => {})
            .catch((error) => {
              console.error("Hata:", error);
            });
        });
      })
      .catch((error) => {
        console.error("Hata:", error);
      });
    // Gelen mesajı isteğinize göre backend işlemleri yaparak işleyebilirsiniz.
  });

  ws.on("close", () => {
    console.log("Bağlantı kesildi.");
  });
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

async function main() {
  await mongoose.connect(key);
}

module.exports = app;
