const { validationResult } = require('express-validator')

const io = require('../socket')

const Post = require('../models/post')
const User = require('../models/user')
const fs = require('fs')
const path = require('path')

exports.getPosts = async (req, res, next) => {
    const currentPage = req.query.page || 1
    const perPage = 2
    
    try {
        const totalItems = await Post.find().countDocuments()

        const posts = await Post.find()
            .populate('creator')
            .sort({createdAt: -1})
            .skip((currentPage - 1) * perPage)
            .limit(perPage)
        res.status(200).json({
            posts: posts,
            totalItems: totalItems
        })
    } catch (error) {
        next(error)
    }
}

exports.getPost = async (req, res, next) => {
    const postId = req.params.postId
    
    const post = await Post.findById(postId).populate('creator')
      
    try {
        if (!post) {
            const error = new Error('Could not find post!')
            error.statusCode = 400
            throw error
        }
    
        res.status(200).json({post: post})
    } catch(error) {
        next(error)
    }
}

exports.postPost = async (req, res, next) => {
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

    const imageUrl = req.file.filename

    const post = new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,
        creator: req.userId
    })

    try {
        await post.save()

        const user = await User.findById(req.userId)

        user.posts.push(post)
        await user.save()

        io.getIO().emit('posts', {
            action: 'create',
            post: {
                ...post._doc,
                creator: {_id: req.userId, name: user.name}
            }
        })

        res.status(201).json({
            success: true,
            message: 'Content created!',
            post: post,
            creator: {_id: user._id, name: user.name}
        })
    } catch (error) {
        next(error)
    }

}

exports.putPost = async (req, res, next) => {
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

    try {
        const post = await Post.findById(postId).populate('creator')
     
        if (!post) {
            const error = new Error('Could not find post!')
            error.statusCode = 400
            throw error
        }

        if (post.creator._id.toString() !== req.userId) {
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
        
       const result =  await post.save()

        io.getIO().emit('posts', {
            action: 'update',
            post: result
        })
  
        res.status(200).json({post: post})
    } catch(error) {
        next(error)
    }
}

exports.deletePost = async (req, res, next) => {
    const postId = req.params.postId

    try {
        const post = await Post.findById(postId)
        
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

        await Post.findByIdAndRemove(postId)
        
        const user = await User.findById(req.userId)
        
        await user.posts.pull(postId)
        await user.save()
        
        io.getIO().emit('posts', {action: 'delete', post: postId})
        
        res.status(200).json({message: 'Post deleted.'})
    } catch(error) {
        next(error)
    }
}

const clearImage = filePath => {
    filePath = path.join(__dirname, '../images', filePath)
    fs.unlink(filePath, err => console.log(err))
}