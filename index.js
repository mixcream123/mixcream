//import package
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const routerAdmin = require("./routes/admin");
const routerClient = require("./routes/client");
var bodyParser = require("body-parser");
const Passport = require("passport");
const fs = require("fs");
const pdf = require("pdf-parse");
const multer = require("multer");


// To use Html5QrcodeScanner (more info below)
const Html5QrcodeScanner = require("html5-qrcode");

// To use Html5Qrcode (more info below)
const Html5Qrcode = require("html5-qrcode");

var session = require("express-session");

const app = express();

app.set("view engine", "ejs");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Su dung Static File
app.use(express.static(__dirname + "/public", {
     etag: true, // Just being explicit about the default.
  lastModified: true,  // Just being explicit about the default.
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      // All of the project's HTML files end in .html
      res.setHeader('Cache-Control', 'max-age=31536000');
    }
  },
}));




//Connect to MongoDB Atlas
mongoose
  .connect(
    "mongodb+srv://sharecodeitk45:roBBhoRsiEy2crjF@cluster0-kemtron.af3egxh.mongodb.net/CheckKemTron?retryWrites=true&w=majority"
  )
  .then(() => console.log("Ket nối DB thành công"))
  .catch(() => console.log("Kết nối DB thất bại"));

// // Connect to the DB Compass
// mongoose
//   .connect(process.env.DB_URL)
//   .then(() => {
//     console.log("Ket noi DB thanh cong !");
//   })
//   .catch((err) => {
//     console.log(err);
//   });


app.use(
  session({
    secret: "bimat",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);

//middleware Router
//Client
app.use("/", routerClient);


// //Server Admin Page
app.use("/admin", routerAdmin);

// Vao 1 trang khong ton tai
app.get("*", (req, res) => {
  res.render("404page");
});

// app.get("/", (req,res)=>{
//     res.render("homePage")
// })

//start server
app.listen(process.env.PORT, () => {
  console.log(`Server is run on http://localhost:${process.env.PORT}`);
});
