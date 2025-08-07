const md5 = require("md5");
const User = require("../../models/user.model");
const { generateRandomNumber } = require("../../helpers/generate");
const ForgotPassword = require("../../models/forgotPassword.model");
const sendEmail = require("../../helpers/sendMail");

// [GET] /user/logout
module.exports.logout = (req, res) => {
  res.clearCookie("tokenUser");
  req.flash("success", "Đăng xuất thành công");
  res.redirect("/user/login");
};

// [GET] /user/login
module.exports.login = (req, res) => {
  res.render("client/pages/auth/login", {
    title: "Login",
  });
};

// [GET] /user/register
module.exports.register = (req, res) => {
  res.render("client/pages/auth/register", {
    title: "Register",
  });
};

// [POST] /user/register
module.exports.registerPost = async (req, res) => {
  const exitEmail = await User.findOne({
    email: req.body.email,
  });
  if (exitEmail) {
    req.flash("error", "Email da ton tai");
    res.redirect(req.get("referer"));
    return;
  }
  req.body.password = md5(req.body.password);
  const user = new User(req.body);
  await user.save();

  res.cookie("tokenUser", user.tokenUser, { maxAge: 900000, httpOnly: true });
  req.flash("success", "Dang ky thanh cong");
  res.redirect("/user/login");
  console.log(user);
};

// [POST] /user/login
module.exports.loginPost = async (req, res) => {
  try {
    const user = req.body.userName;
    const password = req.body.password;

    // Tìm user theo userName
    const userLogin = await User.findOne({
      userName: user,
      deleted: false,
    });

    // Nếu không tìm thấy user
    if (!userLogin) {
      req.flash("error", "Tên đăng nhập không đúng");
      res.redirect(req.get("referer"));
      return;
    }

    // Kiểm tra mật khẩu
    if (md5(password) !== userLogin.password) {
      req.flash("error", "Mật khẩu không đúng");
      res.redirect(req.get("referer"));
      return;
    }

    if (userLogin.status !== "active") {
      req.flash("error", "Tài khoản của bạn đã bị khóa");
      res.redirect(req.get("referer"));
      return;
    }

    res.cookie("tokenUser", userLogin.tokenUser, {
      maxAge: 900000, // 15 phút
      httpOnly: true,
    });

    req.flash("success", "Đăng nhập thành công");
    res.redirect("/");
  } catch (error) {
    console.error("Login error:", error);
    req.flash("error", "Có lỗi xảy ra trong quá trình đăng nhập");
    res.redirect(req.get("referer"));
  }
};

// [GET] /user/password/sendEmail
module.exports.sendEmail = (req, res) => {
  res.render("client/pages/auth/sendEmail", {
    title: "Send Email",
  });
};

// [POST] /user/password/forgot-password
module.exports.forgotPassword = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({
    email: email,
    deleted: false,
  });
  if (!user) {
    req.flash("error", "Email không tồn tại");
    res.redirect(req.get("referer"));
    return;
  }
  // Lưu thông tin vào DB
  const obj = {
    email: user.email,
    otp: generateRandomNumber(6),
    expireAt: new Date(Date.now() + 10 * 60 * 1000), // 10 phút
  };
  const forgotPassword = new ForgotPassword(obj);
  await forgotPassword.save();
  // Nếu email tồn tại, gửi email reset mật khẩu
  const subject = "Reset Password";
  const html = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2 style="color: #007BFF;">Xác thực OTP</h2>
    <p>Xin chào,</p>
    <p>OTP của bạn là: <strong style="font-size: 1.5em;">${obj.otp}</strong></p>
    <p>Mã này sẽ hết hạn sau <strong>3 phút</strong>. Vui lòng không chia sẻ mã này với bất kỳ ai.</p>
    <br/>
    <p>Trân trọng,</p>
    <p><em>Đội ngũ hỗ trợ</em></p>
  </div>
`;

  await sendEmail.sendMail(email, subject, html);
  res.redirect(`/user/password/verify-otp?email=${email}`);
};

// [GET] /user/password/verify-otp
module.exports.verifyOTP = async (req, res) => {
  res.render("client/pages/auth/verifyOTP", {
    title: "Verify OTP",
    email: req.query.email,
  });
};

// [POST] /user/password/verify-otp
module.exports.postOTP = async (req, res) => {
  const email = req.body.email;
  let otp = req.body["otp[]"]; // Truy cập mảng OTP
  // Kiểm tra nếu mảng OTP không tồn tại hoặc rỗng
  if (!otp || !Array.isArray(otp) || otp.length === 0) {
    req.flash("error", "Vui lòng nhập đầy đủ mã OTP");
    res.redirect(req.get("referer"));
    return;
  }

  // Chuyển mảng OTP thành chuỗi
  otp = otp.filter((digit) => digit && digit.trim()).join("");
  console.log("OTP sau khi nối:", otp);

  // Kiểm tra độ dài OTP
  if (!otp || otp.length !== 6) {
    req.flash("error", "Mã OTP phải có đủ 6 chữ số");
    res.redirect(req.get("referer"));
    return;
  }

  try {
    // Kiểm tra OTP trong cơ sở dữ liệu
    const forgotPassword = await ForgotPassword.findOne({
      email: email,
      otp: otp,
    });

    if (!forgotPassword) {
      // Debug: Ghi lại các bản ghi OTP hiện có
      const existingRecords = await ForgotPassword.find({ email: email });
      req.flash("error", "OTP không hợp lệ hoặc đã hết hạn");
      res.redirect(req.get("referer"));
      return;
    }

    // Kiểm tra thời gian hết hạn
    if (new Date() > forgotPassword.expireAt) {
      req.flash("error", "Mã OTP đã hết hạn");
      res.redirect(req.get("referer"));
      return;
    }

    // Tìm người dùng
    const user = await User.findOne({
      email: email,
      deleted: false,
    });

    if (!user) {
      req.flash("error", "Người dùng không tồn tại");
      res.redirect(req.get("referer"));
      return;
    }

    // Xóa OTP đã sử dụng để tránh tái sử dụng
    await ForgotPassword.deleteOne({ _id: forgotPassword._id });

    // Thiết lập cookie và chuyển hướng
    res.cookie("tokenUser", user.tokenUser, {
      maxAge: 900000, // 15 phút
      httpOnly: true,
    });

    req.flash("success", "Xác thực OTP thành công");
    res.redirect("/user/password/reset-password?email=" + email);
  } catch (error) {
    console.error("Lỗi xác thực OTP:", error);
    req.flash("error", "Có lỗi xảy ra trong quá trình xác thực");
    res.redirect(req.get("referer"));
  }
};

// [GET] /user/password/reset-password
module.exports.resetPassword = async (req, res) => {
  res.render("client/pages/auth/resetPassword", {
    title: "Reset Password",
  });
};
// [POST] /user/password/reset-password
module.exports.resetPasswordPost = async (req, res) => {
  const newPassword = req.body.newPassword;

  const tokenUser = req.cookies.tokenUser;

  if (!tokenUser) {
    req.flash("error", "Bạn cần đăng nhập để thực hiện thao tác này");
    res.redirect("/user/login");
    return;
  }
  await User.updateOne(
    {
      tokenUser: tokenUser,
    },
    {
      password: md5(newPassword),
    }
  );
  req.flash("success", "Đặt lại mật khẩu thành công");
  res.redirect("/");
};
// [GET] /user/profile
module.exports.profile = async (req, res) => {
  res.render("client/pages/auth/profile", {
    title: "Profile",
  });
};
