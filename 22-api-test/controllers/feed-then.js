const { validationResult } = require('express-validator')
const Post = require('../models/post')
const User = require('../models/user')
const fs = require('fs')
const path = require('path')

exports.getPosts = (req, res, next) => {
    const currentPage = req.query.page || 1
    const perPage = 2
    let totalItems

    Post.find()
        .countDocuments()
        .then(count => {
            console.log('1. run')
            totalItems = count
            return Post.find()
                .skip((currentPage - 1) * perPage)
                .limit(perPage)
        })
        .then(posts => {
            res.status(200).json({
                posts: posts,
                totalItems: totalItems
            })
        })
        .catch(err => next(err))

        console.log('2. run')
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
        .catch(error =>  next(error))
}

exports.postPost = (req, res, next) => {
    const errors = validationResult(req)
    const title = req.body.title
    const content = req.body.content
    const image = req.file
    let creator

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
        creator: req.userId
    })

    post.save()
        .then(result => {
            newPost = result
            return User.findById(req.userId)
        })
        .then(user => {
            creator = user
            user.posts.push(post)
            return user.save()
        })
        .then(result => {
            res.status(201).json({
                success: true,
                message: 'Content created!',
                post: post,
                creator: {_id: creator._id, name: creator.name}
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

            if (post.creator.toString() !== req.userId) {
                const error = new Error('Not authorized!')
                error.statusCode = 403
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

exports.deletePost = (req, res, next) => {
    const postId = req.params.postId

    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('Could not find post!')
                error.statusCode = 400
                throw error
            }

            if (post.creator.toString() !== req.userId) {
                const error = new Error('Not authorized!')
                error.statusCode = 403
                throw error
            }

            clearImage(post.imageUrl)

            return Post.findByIdAndRemove(postId)
        })
        .then(result => {
            return User.findById(req.userId)
        })
        .then(user => {
            user.posts.pull(postId)
            return user.save()
            res.status(200).json({message: 'Post deleted.'})
        })
        .then(result => {
            res.status(200).json({message: 'Post deleted.'})
        })
        .catch(err => next(err))
}

const clearImage = filePath => {

    filePath = path.join(__dirname, '../images', filePath)
    fs.unlink(filePath, err => console.log(err))
}