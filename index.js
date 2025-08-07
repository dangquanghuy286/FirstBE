// Khởi tạo Express framework
const express = require("express");

// Thư viện hỗ trợ gửi request với method khác như PUT, DELETE thông qua form (HTML chỉ hỗ trợ GET và POST)
var methodOverride = require("method-override");
//Thu vien moment
const moment = require("moment");
//Thư viện hỗ trợ TinyMCE
var path = require("path");

// Load biến môi trường từ file .env
require("dotenv").config();

// Kết nối cơ sở dữ liệu
const db = require("./config/database");

// Flash message – dùng để hiển thị thông báo tạm thời (thường dùng khi chuyển trang)
const flash = require("express-flash");

// Cấu hình hệ thống (ví dụ: tiền tố admin, cấu hình chung)
const systemconfig = require("./config/system");

// Khai báo các route cho admin
const routeAdmin = require("./routes/admin/index.route");

// Khai báo các route cho phía người dùng (client)
const route = require("./routes/client/index.route");

// Thư viện giúp phân tích dữ liệu từ form (application/x-www-form-urlencoded)
const bodyParser = require("body-parser");
// Flash:
// Thư viện hỗ trợ đọc cookie từ request
const cookieParser = require("cookie-parser");
// Thư viện hỗ trợ phiên làm việc (session) để lưu dữ liệu người dùng
const session = require("express-session");

// Kết nối tới database (gọi hàm connect trong file database)
db.connect();

// Khởi tạo ứng dụng express
const app = express();

// Dùng method override để xử lý các HTTP method như PUT và DELETE thông qua query _method
app.use(methodOverride("_method"));

// Lấy cổng từ file .env (PORT)
const port = process.env.PORT;

// Cấu hình middleware body-parser để parse dữ liệu từ form gửi lên (POST method)
app.use(bodyParser.urlencoded());

// Biến toàn cục dùng trong view engine (Pug) – ví dụ dùng để hiển thị đường dẫn prefix admin
app.locals.prefixAdmin = systemconfig.prefixAdmin;
// Biến toàn cục dùng trong view engine
app.locals.moment = moment;

// Cấu hình thư mục views và view engine là pug
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

// Cấu hình flash message
app.use(cookieParser("keyboard cat")); // Chuỗi bí mật dùng để mã hóa cookie
app.use(session({ cookie: { maxAge: 60000 } })); // Thiết lập session có thời hạn 60s
app.use(flash()); // Kích hoạt flash message

// Cấu hình TinyMce
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);

// Cấu hình thư mục chứa các file tĩnh như ảnh, CSS, JS
app.use(express.static(`${__dirname}/public`));

// Cấu hình middleware để phân tích cookie từ request
app.use(express.json());

// Sử dụng route cho phía client
route(app);

// Sử dụng route cho phía admin
routeAdmin(app);

// Khởi động server và lắng nghe trên cổng đã khai báo
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
