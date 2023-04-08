const express = require('express')
const validator = require('../middleware/validators/feedValidator')

const router = express.Router()

const feedController = require('../controllers/feed')

router.get('/posts', feedController.getPosts)

router.get('/post/:postId', feedController.getPost)

router.put('/post/:postId', validator.feed(), feedController.putPost)

router.post('/post',  validator.feed(), feedController.postPost)

router.delete('/post/:postId', feedController.deletePost)

module.exports = router
