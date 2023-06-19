const nodemailer = require("nodemailer");

// Mail sending function || функция отправки письма
const sendMail = async (email, mailSubject, content) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "vupkinpasiliy@gmail.com",
        pass: "udhzznzgqksgpeta",
      },
    });
    const option = {
      from: "vupkinpasiliy@gmail.com",
      to: email,
      subject: mailSubject,
      html: content,
    };

    transporter.sendMail(option, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("mail sent successfully", info.response);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = sendMail;
