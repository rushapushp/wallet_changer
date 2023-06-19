const { validationResult } = require("express-validator");
const db = require("../cfg/db");
const bycrypt = require("bcrypt");
const randomstring = require("randomstring");
const passport = require("passport");
require("dotenv").config;
const sendMail = require("../helpers/sendMail");

// Registration + data validation + email sending || регистрация в системе + валидация ввода + отправка письма с подтверждением
const register = (req, res) => {
  const errors = validationResult(req);
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const notVerifiedYet = "0";

  const insertUserQuery =
    "INSERT INTO account (`username`, `email`, `password`, `isVerified`) VALUES (?,?,?,?)";
  const alreadyTakenCheckQuery = "SELECT * FROM account where email=?";

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  db.query(alreadyTakenCheckQuery, [email], async (err, result) => {
    if (err) {
      throw err;
    }
    if (result.length > 0) {
      res.status(201);
      res.send("Эта почта уже занята");
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
          res.status(200);
          res.send("Учетная запись создана");
        }
      );
      let mailSubject = "Mail Verification";
      const randomToken = randomstring.generate();
      let content =
        "<p> Hello " +
        req.body.username +
        ', \
        Please <a href="http://localhost:3001/mail-verification?token=' +
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
};
// Login || логин(вход)
const login = (req, res, next) => {
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
};
// Get user || получить информацию пользователя
const getUser = (req, res) => {
  res.send(req.user);
};

// КОСТЫЛЬ Get user email || получить почту пользователя
const getUserEmail = (req, res) => {
  res.send(req.user);
};

const verifyMail = (req, res) => {
  var token = req.query.token;
  const getByTokenQuery = "SELECT * FROM account where token=? limit 1";

  db.query(getByTokenQuery, token, function (error, result, fields) {
    if (error) {
      console.log(error.message);
    }
    if (result.length > 0) {
      db.query(`
        UPDATE account SET token = null, isVerified = 1 WHERE id = '${result[0].id}'
        `);
      return res.render("mail-verification", {
        title: "Congratulations!",
        message: "Your mail address has been successfully confirmed!!!",
      });
    } else {
      return res.render("404");
    }
  });
};

const forgetPassword = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  var email = req.body.email;
  db.query(
    "SELECT * FROM account where email=? limit 1",
    email,
    function (error, result, fields) {
      if (error) {
        return res.status(400).json({ message: error });
      }

      if (result.length > 0) {
        let mailSubject = "Forget Password";
        const randomString = randomstring.generate();
        let content =
          "<p>Hello, " +
          // result[0].name
          "forgetful user" +
          ' \
      Please <a href="http://localhost:3001/reset-password?token=' +
          randomString +
          '"> click here </a> to reset your password</p>';

        sendMail(email, mailSubject, content);

        db.query(
          `DELETE FROM password_resets where email=${db.escape(
            result[0].email
          )}`
        );

        db.query(
          `INSERT INTO password_resets (email, token) VALUES(${db.escape(
            result[0].email
          )}, '${randomString}')`
        );

        return res.status(200).send({
          message: "password recovery email has been sent successfully",
        });
      }

      return res.status(401).send({
        message: "email doesn't exists",
      });
    }
  );
};

const resetPasswordLoad = (req, res) => {
  try {
    var token = req.query.token;
    if (token == undefined) {
      res.render("404");
    }

    db.query(
      `SELECT * FROM password_resets where token=? limit 1`,
      token,
      function (error, result, fields) {
        if (error) {
          console.log(error);
        }

        if (result !== undefined && result.length > 0) {
          db.query(
            "SELECT * FROM account where email=? limit 1",
            result[0].email,
            function (error, result, fields) {
              if (error) {
                console.log(error);
              }

              res.render("reset-password", { user: result[0] });
            }
          );
        } else {
        }
      }
    );
  } catch (error) {
    console.log(error.message);
  }
};

const resetPassword = (req, res) => {
  if (req.body.password != req.body.confirm_password) {
    res.render("reset-password", {
      error_message: "Password not matching",
      user: { id: req.body.user_id, id: req.body.email },
    });
  }
  bycrypt.hash(req.body.confirm_password, 10, (err, hash) => {
    if (err) {
      console.log(err);
    }
    db.query(`DELETE from password_resets where email = '${req.body.email}'`);

    db.query(
      `UPDATE account SET password = '${hash}' where id = '${req.body.user_id}'`
    );

    res.render("message", { message: "Password reset successfully!!!" });
  });
};

const verificationCheck = (req, res) =>{
  var email = req.body.email;
  db.query(`SELECT isVerified FROM account where email=?`, email, function(result) {
    if(result === 0){
      return res.status(200).send({
        message: "this mail is not verified yet",
      }); 
    } else {
      return res.status(201).send({
        message: "this mail is verified",
      }); 
    }
  })
}

module.exports = {
  register,
  login,
  getUser,
  getUserEmail,
  verifyMail,
  forgetPassword,
  resetPasswordLoad,
  resetPassword,
  verificationCheck
};
