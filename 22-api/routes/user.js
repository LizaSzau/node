const express = require('express')
const validator = require('../middleware/validators/userValidator')

const router = express.Router()

const userController = require('../controllers/user')

router.post('/signup',  validator.userSignup(), userController.postSignup)

router.post('/login',  validator.userSignup(), userController.postLogin)

module.exports = router
