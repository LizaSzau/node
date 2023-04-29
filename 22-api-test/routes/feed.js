const express = require('express')
const validator = require('../middleware/validators/feedValidator')

const router = express.Router()
const isAuth = require('../middleware/isAuth')

const feedController = require('../controllers/feed')

router.get('/posts', isAuth, feedController.getPosts)

router.get('/post/:postId', feedController.getPost)

router.put('/post/:postId',  isAuth, validator.feed(), feedController.putPost)

router.post('/post',  isAuth, validator.feed(), feedController.postPost)

router.delete('/post/:postId',  isAuth, feedController.deletePost)

module.exports = router
