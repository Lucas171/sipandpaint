const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const nodemailer = require("nodemailer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

let port = process.env.PORT;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "Lucasmiller401@gmail.com",
    pass: "Samyu17!",
  },
});

cloudinary.config({
  cloud_name: "dpnmfp54z",
  api_key: "213349315688533",
  api_secret: "4y_7V3jVXSDthHROMsvHNZzi9g0",
});

const upload = multer();

const app = express();
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

// MONGODB INFO

const mongoUri =
  "mongodb+srv://Lucas113:Lucas17!@cluster0.bf4ym.mongodb.net/Sip&paint";
let hasAccess = false;

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const passwordSchema = new mongoose.Schema({
  pin: String,
});

const Password = mongoose.model("Password", passwordSchema);

const packagesSchema = new mongoose.Schema({
  name: String,
  price: Number,
  duration: String,
  image: String,
  key: Number,
  timeFrame: String,
});
const Package = mongoose.model("Package", packagesSchema);

const upcomingEventSchema = new mongoose.Schema({
  name: String,
  price: Number,
  duration: String,
  image: String,
  date: String,
  key: Number,
  timeFrame: String,
});
const UpcomingEvent = mongoose.model("UpcomingEvent", upcomingEventSchema);

// GET HOME ROUTE

app.get("/", function (req, res) {
  Package.find(function (err, packages) {
    let packagesList = [];

    let upcomingEventList = [];

    for (var i = 0; i < packages.length; i++) {
      packagesList.push(packages[i]);
    }

    UpcomingEvent.find(function (err, upcomingEvent) {
      for (var i = 0; i < upcomingEvent.length; i++) {
        upcomingEventList.push(upcomingEvent[i]);
      }

      res.render("index", {
        packagesList: packagesList,
        upcomingEventList: upcomingEventList,
      });
    });
  });
});

// GET ADMIN ENTRANCE *************************************************

app.get("/adminEntrance", function (req, res) {
  if (hasAccess == true) {
    res.redirect("/adminPost");
  } else {
    res.sendFile(__dirname + "/adminEntrance.html");
  }
});

// POSTING TO ADMIN ENTRANCE  *************************************************

app.post("/adminEntrance", function (req, res) {
  var pinAttempt = req.body.password;
  Password.find(function (err, pin) {
    var pin = pin[0].pin;
    if (pinAttempt == pin) {
      hasAccess = true;
      res.redirect("/adminPost");
    } else {
      hasAccess = false;
      res.redirect("/");
    }
  });
});

//GETTING ADMINPOST  *************************************************

app.get("/adminPost", function (req, res) {
  if (hasAccess == true) {
    hasAccess = false;

    Package.find(function (err, packages) {
      let packagesList = [];
      let upcomingEventList = [];

      for (var i = 0; i < packages.length; i++) {
        packagesList.push(packages[i]);
      }

      UpcomingEvent.find(function (err, upcomingEvent) {
        for (var i = 0; i < upcomingEvent.length; i++) {
          upcomingEventList.push(upcomingEvent[i]);
        }

        res.render("test", {
          name: "",
          price: "",
          duration: "",
          amountOfPackages: "",
          packagesList: packagesList,
          upcomingEventList: upcomingEventList,
        });

        // console.log(upcomingEventList);
      });
    });
  } else {
    res.redirect("/adminEntrance");
  }
});

// POSTING TO ADMINPOST  *************************************************

app.post("/adminPost", upload.single("image"), function (req, res) {
  let streamUpload = (req) => {
    return new Promise((resolve, reject) => {
      let stream = cloudinary.uploader.upload_stream((error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      });

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
  };
  let image;

  async function upload(req) {
    try {
      let result = await streamUpload(req);
      image = result.url;
      console.log(image);
      Package.find(function (err, package) {
        let key;
        let keys = [];
        if (err) {
          console.log(err);
        } else {
          if (package == "") {
            key = Math.floor(Math.random() * 10000000);
            const package = new Package({
              name: nameOfPackage,
              price: priceOfPackage,
              duration: duration,
              image: image,
              key: key,
              timeFrame: timeFrame,
            });

            package.save();
            res.redirect("/");
          } else {
            for (var i = 0; i < package.length; i++) {
              keys.push(package.key);
            }

            while (keys.includes(key)) {
              key = Math.floor(Math.random() * 10000000);
            }

            if (!keys.includes(key)) {
              const package = new Package({
                name: nameOfPackage,
                price: priceOfPackage,
                duration: duration,
                image: image,
                key: key,
                timeFrame: timeFrame,
              });

              package.save();
              res.redirect("/");
            }
          }
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  upload(req);

  let nameOfPackage = req.body.nameOfPackage;
  let priceOfPackage = req.body.priceOfPackage;
  let duration = req.body.durationOfPackage;

  let timeFrame = req.body.timeFrame;

  // upload(req, res, (err) => {
  //   if (err) {
  //   } else {
  //     nameOfPackage = req.body.nameOfPackage;
  //     priceOfPackage = req.body.priceOfPackage;
  //     duration = req.body.durationOfPackage;
  //     image = image;
  //     timeFrame = req.body.timeFrame;
  //   }
  // });
});

// POSTING TO ADMINPOSTUP  *************************************************
// DESCRIPTION: Adds a new upcoming package *************************************************

app.post("/adminPostUp", upload.single("image"), function (req, res) {
  let streamUpload = (req) => {
    return new Promise((resolve, reject) => {
      let stream = cloudinary.uploader.upload_stream((error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      });

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
  };
  let image;

  async function upload(req) {
    try {
      let result = await streamUpload(req);
      image = result.url;
      console.log(image);
      UpcomingEvent.find(function (err, package) {
        let key;
        let keys = [];
        if (err) {
          console.log(err);
        } else {
          if (package == "") {
            key = Math.floor(Math.random() * 10000000);
            const package = new UpcomingEvent({
              name: nameOfPackage,
              price: priceOfPackage,
              duration: duration,
              image: image,
              date: date,
              key: key,
              timeFrame: timeFrame,
            });

            package.save();
            res.redirect("/");
          } else {
            for (var i = 0; i < package.length; i++) {
              keys.push(package.key);
            }

            while (keys.includes(key)) {
              key = Math.floor(Math.random() * 10000000);
            }

            if (!keys.includes(key)) {
              const package = new UpcomingEvent({
                name: nameOfPackage,
                price: priceOfPackage,
                duration: duration,
                image: image,
                date: date,
                key: key,
                timeFrame: timeFrame,
              });

              package.save();
              res.redirect("/");
            }
          }
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  upload(req);

  let nameOfPackage = req.body.nameOfPackage;
  let priceOfPackage = req.body.priceOfPackage;
  let duration = req.body.durationOfPackage;
  let date = req.body.dateOfPackage;
  let timeFrame = req.body.timeFrame;
});

//POST TO DELETEPACKAGE *************************************************
// DESCRIPTION: Deletes package when user click delete *************************************************

app.post("/deletePackage", (req, res) => {
  var number = Object.keys(req.body);

  Package.deleteOne({ key: number[0] }, function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

// POST TO DELETEUPCOMINGPACKAGE *************************************************
// DESCRIPTION: Deletes upcoming event when user clicks delete. *************************************************

app.post("/deleteUpcomingEvent", (req, res) => {
  var number = Object.keys(req.body);

  UpcomingEvent.deleteOne({ key: number[0] }, function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

// GETTING REQUEST AN EVENT *************************************************
// DESCRIPTION: Allows user to request a unique package *************************************************

app.get("/request", function (req, res) {
  res.render("request");
});

// POSTING TO UNIQUE PACKAGE

app.post("/uniquePackage", (req, res) => {
  var mailOptions = {
    from: "SIP&PAINT",
    to: "Lucasmiller401@gmail.com",
    subject: "A package request from SIP&Paint",
    text:
      "Hello i have a unique package idea that i would like to share with you! \n Date: " +
      req.body.date +
      "\n Time: " +
      req.body.time +
      "\n People: " +
      req.body.people +
      "\n Budget: " +
      req.body.budget +
      "\n Additional Info: " +
      req.body.additionInfo,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  res.sendFile(__dirname + "/emailPortal.html");
});

// Listening port *************************************************

if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("server has started on port 3000");
});
