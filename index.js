const express = require("express");
var methodOverride = require("method-override");
require("dotenv").config();
const db = require("./config/database");

const systemconfig = require("./config/system");
const routeAdmin = require("./routes/admin/index.route");
const route = require("./routes/client/index.route");
const bodyParser = require("body-parser");
db.connect();

const app = express();
app.use(methodOverride("_method"));
const port = process.env.PORT;

app.use(bodyParser.urlencoded());

//App local variables
app.locals.prefixAdmin = systemconfig.prefixAdmin;

app.set("views", "./views");
app.set("view engine", "pug");
app.use(express.static("public"));

route(app);
routeAdmin(app);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
