const path = require('path')
const express = require('express')

const router = express.Router()
const rootDir = require('../util/path')

const users = []

router.get('/', (req, res, next) => {
    res.render('add-user', {
        pageTitle: 'Add user',
        path: '/'
    })
})

router.post('/add-user', (req, res, next) => {
    users.push({name: req.body.name})
    res.redirect('/')
})

exports.routers = router
exports.users = users