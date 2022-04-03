const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URL);
var conn = mongoose.connection;
conn.on("connected", function () {
  console.log("database is connected successfully");
});
conn.on("disconnected", function () {
  console.log("database is disconnected successfully");
});
conn.on("error", console.error.bind(console, "connection error:"));

var plantSchema = new mongoose.Schema({
  id: String,
  name: String,
  image: String,
  price: Number,
  inCart: Boolean,
  qty: Number,
});

const Plants = conn.model("plants", plantSchema);

let arr = [];

Plants.find({}).exec((err, data) => {
  if (err) throw err;

  arr = [...data];
});

// let arr = [
//   {
//     id: 1,
//     name: "Neem",
//     image: "//unsplash.it/1000?1",
//     price: 45,
//     inCart: false,
//     qty: 0,
//   },
//   {
//     id: 2,
//     name: "Cinnemon",
//     image: "//unsplash.it/1000?2",
//     price: 45,
//     inCart: false,
//     qty: 0,
//   },
//   {
//     id: 3,
//     name: "Haldi",
//     image: "//unsplash.it/1000?3",
//     price: 45,
//     inCart: false,
//     qty: 0,
// aaa
//   },
//   {
//     id: 4,
//     name: "Mango",
//     image: "//unsplash.it/1000?4",
//     price: 45,
//     inCart: false,
//     qty: 0,
//   },
//   {
//     id: 5,
//     name: "Bannana",
//     image: "//unsplash.it/1000?5",
//     price: 45,
//     inCart: false,
//     qty: 0,
//   },
//   {
//     id: 6,
//     name: "Tulsi",
//     image: "//unsplash.it/1000?6",
//     price: 45,
//     inCart: false,
//     qty: 0,
//   },
//   {
//     id: 7,
//     name: "Tulsi",
//     image: "//unsplash.it/1000?7",
//     price: 45,
//     inCart: false,
//     qty: 0,
//   },
//   {
//     id: 8,
//     name: "Tulsi",
//     image: "//unsplash.it/1000?8",
//     price: 45,
//     inCart: false,
//     qty: 0,
//   },
//   {
//     id: 9,
//     name: "Tulsi",
//     image: "//unsplash.it/1000?9",
//     price: 45,
//     inCart: false,
//     qty: 0,
//   },
//   {
//     id: 10,
//     name: "Tulsi",
//     image: "//unsplash.it/1000?10",
//     price: 45,
//     inCart: false,
//     qty: 0,
//   },
//   {
//     id: 11,
//     name: "Tulsi",
//     image: "//unsplash.it/1000?11",
//     price: 45,
//     inCart: false,
//     qty: 0,
//   },
//   {
//     id: 12,
//     name: "Tulsi",
//     image: "//unsplash.it/1000?12",
//     price: 45,
//     inCart: false,
//     qty: 0,
//   },
// ];

let cart = [];
let total = 0;
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.render("index", { plants: arr, cart: cart });
});

app.get("/cart", function (req, res) {
  res.render("cart", { plants: cart, total: total });
});
app.get("/team", function (req, res) {
  res.render("team", { cart });
});

arr.forEach((item) => {
  app.get(`/${item.name}`, function (res, res) {
    res.render("card", { plant: item });
  });
});

app.post("/", function (req, res) {
  const itemTofind = req.body.item;
  let element = {};
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].name === itemTofind) {
      element = arr[i];
      if (req.body.orderedQuantity != 0) {
        arr[i].inCart = true;
      } else {
        arr[i].inCart = false;
      }
      arr[i].qty = req.body.orderedQuantity;
      break;
    }
  }

  cart = arr.filter((el) => el.inCart);
  total = 0;
  cart.forEach((c) => {
    total += c.qty * c.price;
  });
  res.redirect("/");
});

app.listen(3000, function () {
  console.log("server is running on port 3000");
});
