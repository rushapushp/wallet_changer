const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");
const bycrypt = require("bcrypt");
const db = require("./db");
const nodemailer = require('nodemailer')

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
require("./passportConfig")(passport);


app.get("/", (req, res) => {
  res.send("привет");
});

app.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const insertUserQuery =
    "INSERT INTO account (`username`, `password`) VALUES (?,?)";
  const alreadyTakenCheckQuery = "SELECT * FROM account where username = ?";

  db.query(alreadyTakenCheckQuery, [username], async (err, result) => {
    if (err) {throw err;}
    if (result.length > 0) {
      res.send("User already exists");
    }
    if (result.length === 0) {
      const hashedPassword = bycrypt.hashSync(password, 10);
      db.query(
        insertUserQuery,
        [username, hashedPassword],
        (err, result) => {
          if (err) {
            console.log(err);
          }
          res.send("User created");
        }
      );
    }
  });
});

app.post('/login', (req, res, next) =>{
    passport.authenticate('local', (err, user, info) =>{
        if(err) {throw err;}
        if(!user) {res.send('No user exists')}
        if(user){
            req.login(user, (err) => {
                if(err) {throw err;}
                res.send("User Logged in");
                console.log(user)
            })
        }
    })(req, res, next);
});

app.get('/getUser', (req, res) => {
    res.send(req.user);
  })
  
const PORT = 3001;

app.listen(PORT, () => {
  console.log(`/server is running on port ${PORT}`);
});
