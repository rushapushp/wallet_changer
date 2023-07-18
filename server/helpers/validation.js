const { check } = require("express-validator");
// Username, email & password validation || валидация имени, почты и пароля
exports.signUpValidation = [
  check("username", "Name is required").not().isEmpty(),
  check("email", "Please enter a valid mail")
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: true }),
  check("password", "Password is required").isLength({ min: 6 }),
];

exports.forgetPasswordValidation = [
  check("email", "Please enter a valid mail")
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: true }),
];

exports.avatarValidation = [
  check("image")
    .custom((value, { req }) => {
      if (
        req.file.mimetype == "image/jpeg" ||
        req.file.mimetype == "image/png"
      ) {
        return true;
      } else {
        return false;
      }
    })
    .withMessage("You can upload only .png or .jpg files"),
];
