const path = require('path')
const express = require('express')

const authController = require('../controllers/auth')
const validator = require('../middleware/validators/authValidator')

const router = express.Router()

router.get('/login', authController.getLogin)

router.post('/login', validator.authLogin(), authController.postLogin)

router.post('/logout', authController.postLogout)

router.get('/signup', authController.getSignup)

router.post('/signup', validator.authSignup(), authController.postSignup)

router.get('/reset-password', authController.getResetPassword)

router.post('/reset-password', authController.postResetPassword)

router.get('/new-password/:token', authController.getNewPassword)

router.post('/new-password', authController.postNewPassword)

module.exports = router