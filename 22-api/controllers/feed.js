const { validationResult } = require('express-validator')
const Post = require('../models/post')

exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [
            {
                _id: '142',
                title: 'First Post',
                content: 'This is the first post!',
                imageUrl: 'images/apple.jpeg',
                createdAt: new Date().toISOString(),
                creator: {
                    name: 'Liza Coca'
                }
            }
        ]
    })
}

exports.getPost = (req, res, next) => {
    const postId = req.params.postId
    
    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('Could not find post!')
                error.statusCode(404)
                throw error
            }

            res.status(200).json({post: post})
        }) 
        .catch(error =>  next(err))
}

exports.postPost = (req, res, next) => {
    const errors = validationResult(req)
    const title = req.body.title
    const content = req.body.content

    if (!errors.isEmpty()) {
        const error = new Error('Invalid form!')
        error.statusCode = 422
        throw error
        /*
        return res.status(422).json({
            success: false,
            errors: errors.array()
        })
        */
    }

    const post = new Post({
        title: title,
        content: content,
        //imageUrl: 'images/duck.jpg',
        creator: { name: 'Pink Coca'}
    })

    post.save()
        .then(result => {
            res.status(201).json({
                success: true,
                message: 'Content created!',
                post: result
            })
        })
        .catch(err => {
            next(err)
        })
}