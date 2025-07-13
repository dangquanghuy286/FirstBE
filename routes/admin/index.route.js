const systemConfig = require("../../config/system");

const dashboardRoute = require("./dashboard.route");

module.exports = (app) => {
  app.use(`${systemConfig.prefixAdmin}/dashboard`, dashboardRoute);
};
