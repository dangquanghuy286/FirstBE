const { uploadToCloudinary } = require("../../helpers/uploadToCloudinary");

module.exports.uploadCloud = async (req, res, next) => {
  if (req.file) {
    const link = await uploadToCloudinary(req);
    req.body[req.file.fieldname] = link;
  }
  next();
};
