const path = require('path')
const express = require('express')

const router = express.Router()
const rootDir = require('../util/path')

const usersData = require('./addUser')
const { count } = require('console')

router.get('/list-users', (req, res, next) => {
    res.render('list-users', {
        pageTitle: 'List users',
        usersCSS: true,
        hasUsers: usersData.users.length > 0 ? true : false,
        users: usersData.users,
        path: '/'
    })
})

module.exports = router