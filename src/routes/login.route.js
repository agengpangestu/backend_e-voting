const LoginController = require('../controllers/login.controller');

const router = require('express').Router();

router.post('/user-login', LoginController.login);

module.exports = router;