const multer = require("multer")

const MulterError = (err, req, res, next) => {
    if (err) return res.status(400).json({ message: err.message, status: 400 })
    next();
};

module.exports = MulterError;