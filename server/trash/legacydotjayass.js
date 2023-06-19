const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");
const bycrypt = require("bcrypt");
const db = require("../cfg/db");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const randomstring = require("randomstring");
const sendMail = require("../helpers/sendMail");



const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  expressSession({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(cookieParser("keyboard cat"));

app.use(passport.initialize());
app.use(passport.session());
require("../middleware/passportConfig")(passport);

app.get("/", (req, res) => {
  res.send("привет");
});

// const webRouter = require('./webRoute')

app.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const notVerifiedYet = "0";

  const insertUserQuery =
    "INSERT INTO account (`username`, `email`, `password`, `isVerified`) VALUES (?,?,?,?)";
  const alreadyTakenCheckQuery = "SELECT * FROM account where username = ?";

  db.query(alreadyTakenCheckQuery, [username], async (err, result) => {
    if (err) {
      throw err;
    }
    if (result.length > 0) {
      res.send("User already exists");
    }
    if (result.length === 0) {
      const hashedPassword = bycrypt.hashSync(password, 10);
      db.query(
        insertUserQuery,
        [username, email, hashedPassword, notVerifiedYet],
        (err, result) => {
          if (err) {
            console.log(err);
          }
          res.send("User created");
        }
      );
      let mailSubject = "Mail Verification";
      const randomToken = randomstring.generate();
      let content =
        "<p> Hello " +
        req.body.username +
        ', \
      Please <a href="http://localhost:3000/mail-verification?token=' +
        randomToken +
        '"> Verify </a> your mail</p>';
      sendMail(req.body.email, mailSubject, content);

      db.query(
        "UPDATE account set token=? where email=?",
        [randomToken, req.body.email],
        function (error, result, fields) {
          if (error) {
            return res.status(400).send({
              msg: err,
            });
          }
        }
      );
    }
  });
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      throw err;
    }
    if (!user) {
      res.send("No user exists");
    }
    if (user) {
      req.login(user, (err) => {
        if (err) {
          throw err;
        }
        res.send("User Logged in");
        console.log(user);
      });
    }
  })(req, res, next);
});

app.get("/getUser", (req, res) => {
  res.send(req.user);
});

app.get("/getUserEmail", (req, res) => {
  // const getEmailQuery = "SELECT email FROM changer.account where username = ?";
  // db.query(getEmailQuery, [username], async (err, result) => {
  //   res.send(req.email);
  // });
  res.send(req.user);
});

app.get("/sendemails", async (req, res, next) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "vupkinpasiliy@gmail.com",
      pass: "udhzznzgqksgpeta",
    },
  });
  const option = {
    from: "vupkinpasiliy@gmail.com",
    to: "kotxleb111@gmail.com",
    subject: "Test",
    text: "text text text text text text text text text text",
  };
  transporter.sendMail(option, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log(info);
    }
  });
});

// const sendVerificationEmail = ()

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//      auth: {
//        user: 'vupkinpasiliy@gmail.com',
//        pass: 'udhzznzgqksgpeta'
//      }
// })

// transporter.verify((error, success) =>{
//   if (error) {
//     console.log(error);

//   } else {
//     console.log("ready 4 messages");
//     console.log(success);
//   }
// })

// const verifyMail = (req, res) => {
//   var token = req.query.token;

//   db.query('SELECT * FROM account where token=? limit 1', token, function(error, result, fields){
//     if(error){
//       console.log(error.message);
//     }
//     if(result.length > 0){
//       db.query(`
//       UPDATE account SET token = null, isVerified = 1 WHERE id = '${result[0].id}'
//       `);
//       return res.render('mail-verification', {message: 'Your mail address has been successfully confirmed!!!'});
//     }else{
//       return res.render('404')
//     }
//   });
// }

// const PORT = 3001;

// app.listen(PORT, () => {
//   console.log(`/server is running on port ${PORT}`);
// });


// module.exports = {
//   verifyMail
// }