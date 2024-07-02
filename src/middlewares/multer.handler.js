const multer = require('multer');
const fs = require('fs');

const maxSize = 2 * 1000 * 1000;

const storageIdentityCards = multer.diskStorage({
    destination: (request, file, callback) => {
        const directory = "public/images/identity_cards";
        fs.mkdirSync(directory, { recursive: true });
        callback(null, directory);
    },
    filename: function (request, file, callback) {
        callback(null, `${Date.now()}-${file.originalname.split(" ").join("").toLocaleLowerCase()}`);
    }
});

const storageIdentityPemilih = multer.diskStorage({
    destination: (request, file, callback) => {
        const directory = "public/images/identity_card_pemilih";
        fs.mkdirSync(directory, { recursive: true });
        callback(null, directory);
    },
    filename: function (request, file, callback) {
        callback(null, `${Date.now()}-${file?.originalname?.split(" ").join("").toLocaleLowerCase()}`);
    }
});

const storageCandidate = multer.diskStorage({
    destination: (request, file, callback) => {
        const directory = "public/images/candidate";
        fs.mkdirSync(directory, { recursive: true });
        callback(null, directory);
    },
    filename: function (request, file, callback) {
        callback(null, `${Date.now()}-${file?.originalname?.split(" ").join("").toLocaleLowerCase()}`);
    }
});

const uploadIdentityCards = multer({
    storage: storageIdentityCards,
    limits: { fileSize: maxSize },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
            return cb(null, true)
        } else {
            cb(null, false);
            return cb(new Error("Image must be .png/.jpg/.jpeg and have max size of 2 Mb."), false)
        }
    }
});

const uploadIdentityPemilih = multer({
    storage: storageIdentityPemilih,
    limits: { fieldSize: maxSize },
    fileFilter: (req, file, cb) => {
        if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
            return cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error("Image must be .png/.jpg/.jpeg and have max size of 2 Mb."), false);
        }
    }
});

const uploadAvatarCandidate = multer({
    storage: storageCandidate,
    limits: { fieldSize: maxSize },
    fileFilter: (req, file, cb) => {
        if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
            return cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error("Image must be .png/.jpg/.jpeg and have max size of 2 Mb."), false)
        }
    }
});

module.exports = { uploadIdentityCards, uploadIdentityPemilih, uploadAvatarCandidate }