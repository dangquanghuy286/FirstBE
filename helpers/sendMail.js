const nodemailer = require("nodemailer");

module.exports.sendMail = async (email, subject, html) => {
  // Tạo transporter với Gmail
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_HOST,
      pass: process.env.EMAIL_PASS, // Sử dụng "App password" nếu dùng Gmail
    },
  });

  // Cấu hình email
  const mailOptions = {
    from: process.env.EMAIL_HOST,
    to: email,
    subject: subject,
    html: html,
  };

  // Gửi email
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Lỗi:", error);
    } else {
      console.log("Email đã được gửi:", info.response);
    }
  });
};
