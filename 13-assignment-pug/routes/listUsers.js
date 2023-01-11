const path = require('path')
const express = require('express')

const router = express.Router()
const rootDir = require('../util/path')

const usersData = require('./addUser')

router.get('/list-users', (req, res, next) => {
    res.render('list-users', {
        pageTitle: 'List users',
        users: usersData.users,
        path: '/'
    })
})

module.exports = router