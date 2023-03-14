const express = require('express')
const validator = require('../middleware/validators/feedValidator')

const router = express.Router()

const feedController = require('../controllers/feed')

router.get('/posts', feedController.getPosts)

router.get('/post/:postId', feedController.getPost)

router.post('/post',  validator.feed(), feedController.postPost)

module.exports = router
