const { validationResult } = require('express-validator')
const Post = require('../models/post')
const fs = require('fs')
const path = require('path')

exports.getPosts = (req, res, next) => {
    Post.find()
        .then(posts => {
            res.status(200).json({
                posts: posts
            })
        })
        .catch(err => next(err))
}

exports.getPost = (req, res, next) => {
    const postId = req.params.postId
    
    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('Could not find post!')
                error.statusCode = 400
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
    const image = req.file

    if (!errors.isEmpty()) {
        const error = new Error('Invalid form!')
        error.statusCode = 422
        throw error
    }

    if (!req.file) {
        const error = new Error('No image provided!')
        error.statusCode = 422
        throw error
    }

    // const imageUrl = req.file.path
    const imageUrl = req.file.filename

    const post = new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,
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
        .catch(err => next(err))
}

exports.putPost = (req, res, next) => {
    const errors = validationResult(req)
    const postId = req.params.postId
    const title = req.body.title
    const content = req.body.content

    let imageUrl = req.body.image

    if (!errors.isEmpty()) {
        const error = new Error('Invalid form!')
        error.statusCode = 422
        throw error
    }

    if (req.file) {
        imageUrl = req.file.filename
    }

    if (!imageUrl) {
        const error = new Error('No image provided!')
        error.statusCode = 422
        throw error
    }

    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('Could not find post!')
                error.statusCode = 400
                throw error
            }

            if (imageUrl !== post.imageUrl) {
                clearImage(post.imageUrl)
            }

            post.title = title
            post.content = content
            post.imageUrl = imageUrl
            return post.save()
        })
        .then(result => {
            res.status(200).json({post: result})
        })
        .catch(err => next(err))
}

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath)
    fs.unlink(filePath, err => console.log(err))
}