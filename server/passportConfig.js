const db = require("./db");
const bcrypt = require("bcrypt");
const localStrategy = require("passport-local").Strategy;

module.exports = function (passport) {
  passport.use(
    new localStrategy((username, password, done) => {
      const getByUsernameQuery =
        "SELECT * FROM changer.account where username = ?";
      db.query(getByUsernameQuery, [username], (err, result) => {
        if (err) {
          throw err;
        }
        if (result.length === 0) {
          return done(null, false, { message: "username does not exists" });
        }
        bcrypt.compare(password, result[0].password, (err, response) => {
          if (err) {
            throw err;
          }
          if (response === true) {
            return done(null, result[0]);
          } else {
            return done(null, false);
          }
        });
      });
    })
  );

  
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    const getByIdQuery = "SELECT * FROM changer.account where id = ?";
    db.query(getByIdQuery, [id], (err, result) => {
      if (err) {
        throw err;
      }
      const userInfo = {
        id: result[0].id,
        username: result[0].username,
      };
      done(null, userInfo);
    });
  });
};
