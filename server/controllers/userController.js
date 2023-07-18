// ВАЖНО - ВСЕ ПЕРЕМЕННЫЕ ОБЪЯВЛЕННЫЕ В СКОПЕ ФУНКЦИИ, ОТВЕЧАЮЩИЕ ЗА ВВОДИМЫЕ ЮЗЕРОМ ДАННЫЕ, !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// А ТАКЖЕ ПЕРЕИСПОЛЬЗУЕМЫЕ ИЛИ ЗАНОВО ВВОДИМЫЕ В ДРУГИХ ПОЛЯХ НА КЛИЕНТЕ - ДОЛЖНЫ ОБЪЯВЛЯТЬСЯ КАК ПЕРЕМЕННЫЕ (var), !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// А НЕ КОНСТАНТОЙ (const), И КО ВСЕМУ ПРОЧЕМУ - SQL ЗАПРОСЫ, СТАТИЧЕСКИЕ ДАННЫЕ И Т.П., ПЕРЕИСПОЛЬЗУЕМЫЕ И НЕТ - ДОЛЖНЫЕ ОСТАВАТЬСЯ КОНСТАНТАМИ (const)!

const { validationResult } = require("express-validator");
const db = require("../cfg/db");
const bycrypt = require("bcrypt");
const randomstring = require("randomstring");
const passport = require("passport");
require("dotenv").config;
const sendMail = require("../helpers/sendMail");

// Registration + data validation + email sending || регистрация в системе + валидация ввода + отправка письма с подтверждением
const register = (req, res) => {
  var errors = validationResult(req);
  var username = req.body.username;
  var password = req.body.password;
  var email = req.body.email;
  var notVerifiedYet = "0";

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
      res.status(201);
      res.send("Ваш логин или пароль не верны, попробуйте еще раз");
    }
    if (user) {
      req.login(user, (err) => {
        if (err) {
          throw err;
        }
        res.status(200);
        res.send("Вы успешно вошли");
        console.log(user);
      });
    }
  })(req, res, next);
};
// Get user || получить информацию пользователя
const getUser = (req, res) => {
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
  var errors = validationResult(req);

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

        return res.status(200).send("Письмо отправлено");
      }

      return res.status(201).send("Аккаунт с этой почтой не найден");
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
            `SELECT * FROM account where email=? limit 1`,
            result[0].email,
            function (error, result, fields) {
              if (error) {
                console.log(error);
              }

              res.render("reset-password", { user: result[0] });
            }
          );
        } else {
          res.render("404");
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


// говнокод
// const verificationCheck = (req, res) => {
//   var email = req.body.email;
//   db.query(
//     `SELECT isVerified FROM account WHERE email=?`,
//     email,
//     function (err, result, fields) {
//       if (result === 0) {
//         return res
//           .status(200)
//           .send("Почта еще не подтверждена, некоторые функции ограничены");
//       } else {
//         return res.status(201).send("Почта подтверждена, вам доступны все функции");
//       }
//     }
//   );
// };

const setPersonalInformation = (req, res) => {
  var first_name = req.body.first_name;
  var second_name = req.body.second_name;
  var socials = req.body.socials;
  var email = req.body.email;
  // var filename = req.file.filename; // or originalname

  db.query(
    "SELECT * FROM personal_information where email=? limit 1",
    email,
    function (error, result, fields) {
      if (result == 0) {
        db.query(
          `INSERT INTO personal_information (email, first_name, second_name, socials) VALUES (?,?,?,?)`,
          [email, first_name, second_name, socials],
          (err, result) => {
            if (err) {
              console.log(err);
            }
            res.status(200);
            res.send("Данные успешно добавлены");
          }
        );
      } else {
        db.query(
          `UPDATE personal_information SET first_name='${first_name}', second_name='${second_name}', socials='${socials}' WHERE email='${email}'`,
          [email, first_name, second_name, socials],
          (err, result) => {
            if (err) {
              console.log(err);
            }
            res.status(201);
            res.send("Данные успешно обновлены");
          }
        );
      }
    }
  );
};

const setAvatarImage = (req,res) =>{
  var email = req.body.email;
  var file = req.file.filename;
  db.query(
    "SELECT avatar_image FROM account where email=? limit 1",
    email,
    function (error, result, fields) {
      if (result == 0) {
        db.query(
          `INSERT INTO account (avatar_image) VALUES (?)`,
          [file],
          (err, result) => {
            if (err) {
              console.log(err);
            }
            res.status(200);
            res.send("Аватар успешно добавлен");
          }
        );
      } else {
        db.query(
          `UPDATE account SET avatar_image='${file}' where email='${email}'`, 
          (err, result) => {
            if (err) {
              console.log(err);
            }
            res.status(201);
            res.send("Аватар успешно обновлен");
          }
        );
      }
    }
  );
  console.log(req.file)
}



module.exports = {
  register,
  login,
  getUser,
  verifyMail,
  forgetPassword,
  resetPasswordLoad,
  resetPassword,
  setPersonalInformation,
  setAvatarImage,


};


