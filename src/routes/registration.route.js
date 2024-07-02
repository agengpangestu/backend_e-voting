const registrationController = require('../controllers/registration.controller');
const { uploadIdentityPemilih } = require('../middlewares/multer.handler');
const RegistrationHandler = require('../middlewares/registration.handler');

const router = require('express').Router();

router.post('/post',
    uploadIdentityPemilih.single('identityPicture'),
    RegistrationHandler.RegistrationHandler,
    registrationController.Post
);

module.exports = router;