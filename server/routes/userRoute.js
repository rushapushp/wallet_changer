/////////////////API 
const express = require("express");
const router = express.Router();
require("dotenv").config;
const { signUpValidation, forgetPasswordValidation } = require("../helpers/validation");
const userController = require("../controllers/userController");

// Functional query routes || функцианальные запросы

// Registration router || регистрация
router.post("/register", signUpValidation, userController.register);

// Login router || вход(логин)
router.post("/login", userController.login);

// Get user data router || получить данные о пользователе
router.get("/getUser", userController.getUser);

router.post("/forget-password", forgetPasswordValidation, userController.forgetPassword)

router.post("/set-personal-information", userController.setPersonalInformation)

module.exports = router;
