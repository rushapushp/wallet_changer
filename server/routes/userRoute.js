/////////////////API
const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
require("dotenv").config;
const {
  signUpValidation,
  forgetPasswordValidation,
  avatarValidation,
} = require("../helpers/validation");
const userController = require("../controllers/userController");
router.use(express.static(path.join(__dirname, "../public")));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "_" + file.originalname;
    cb(null, name);
  },
});

const filefilter = (req, file, cb) => {
  file.mimetype == "image/jpeg" || file.mimetype == "image/png"
    ? cb(null, true)
    : cb(null, false);
};

const upload = multer({
  storage: storage,
  fileFilter: filefilter,
});

// Registration router || регистрация
router.post("/register", signUpValidation, userController.register);

// Login router || вход(логин)
router.post("/login", userController.login);

// Get user data router || получить данные о пользователе
router.get("/getUser", userController.getUser);

router.post(
  "/forget-password",
  forgetPasswordValidation,
  userController.forgetPassword
);

router.post("/set-personal-information", userController.setPersonalInformation);

router.post(
  "/set-avatar-image",
  upload.single("file"),
  userController.setAvatarImage
);

router.get(
  "/get-personal-information/:id",
  
  userController.getPersonalInformation
);




module.exports = router;
