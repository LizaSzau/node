const express = require('express')
const validator = require('../middleware/validators/userValidator')

const router = express.Router()
const isAuth = require('../middleware/isAuth')

const userController = require('../controllers/user')

router.post('/signup',  validator.userSignup(), userController.postSignup)

router.post('/login',  validator.userSignup(), userController.postLogin)

router.get('/status',  isAuth, userController.getStatus)

router.patch('/status', isAuth, validator.userStatus(), userController.patchStatus)

module.exports = router
