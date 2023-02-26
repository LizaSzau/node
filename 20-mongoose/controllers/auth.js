const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const { validationResult } = require('express-validator')

const User = require('../models/user')
const user = require('../models/user')
const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: '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'
    }
}))

exports.getLogin = (req, res, next) => {
/*  const isLoggedIn = req
        .get('Cookie')
        .split(';')[1]
        .trim()
        .split('=')[1] === 'true' */

    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        flashMessage: req.flash('error'),
        oldData: {
            email: '',
            password: ''
        },
        validationErrors: []
    })
}

exports.postLogin = (req, res, next) => {
/*  COOKIE
    Expires=: if not set expires when close the browser
    Max-Age=: in seconds
    Domain=:
    HttpOnly:
    Secure: only https */
    
    // res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly')

    const errors = validationResult(req)
    const email = req.body.email
    const password = req.body.password

    if (!errors.isEmpty()) {
        return res
            .status(422)
            .render('auth/login', {
                path: '/login',
                pageTitle: 'Login',
                flashMessage: errors.array()[0].msg,
                oldData: {
                    email: req.body.email,
                    password: req.body.password
                },
                validationErrors: errors.array()
            });
    }

    User
        .findOne({email: email})
        .then(user => {
            if (!user) {
                return res
                    .status(422)
                    .render('auth/login', {
                        path: '/login',
                        pageTitle: 'Login',
                        flashMessage: 'Invalid e-mail or password.',
                        oldData: {
                            email: email,
                            password: password
                        },
                        validationErrors: []
                    });
            }

            bcrypt.compare(password, user.password)
                .then(isMatched => {
                    if(isMatched) {
                        req.session.isLoggedIn = true
                        req.session.user = user
                        return req.session.save(err => {
                            console.log(err)
                            res.redirect('/')
                        })
                    } 
                    
                    return res
                    .status(422)
                    .render('auth/login', {
                        path: '/login',
                        pageTitle: 'Login',
                        flashMessage: 'Invalid e-mail or password.',
                        oldData: {
                            email: email,
                            password: password
                        },
                        validationErrors: []
                    });
                })
                .catch(err => {
                    console.log(err)
                    res.redirect('/login')
                })
        })
        .catch(err => console.log(err))
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        flashMessage: req.flash('error'),
        oldData: {
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        },
        validationErrors: []
    });
};

exports.postSignup = (req, res, next) => {
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    const confirmPassword = req.body.confirmPassword
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res
            .status(422)
            .render('auth/signup', {
                path: '/signup',
                pageTitle: 'Signup',
                flashMessage: errors.array()[0].msg,
                oldData: {
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    confirmPassword: req.body.confirmPassword,
                },
                validationErrors: errors.array()
            });
    }
  
    bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                name: name,
                email: email,
                password: hashedPassword
            })
        
            return user.save()
        })
        .then(result => {
            res.redirect('/login')
            return transporter.sendMail({
                to: email,
                from: 'liza.szauder@gmail.com',
                subject: 'Signup secceeded!',
                html: '<h1>You are registered sucessfully!</h1>'
            })
            .then(result => console.log(result))
            .catch(err => console.log(err))
            
        })
        .catch(err => {
            console.log(err)
        })
};

exports.getResetPassword = (req, res, next) => {
    res.render('auth/reset-password', {
        pageTitle: 'Reset Password',
        path: '/login',
        flashError: req.flash('error'),
        flashSuccess: req.flash('success')
    })
}

exports.postResetPassword = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err)
            return res.redirect('/reset-password')
        }
        const token = buffer.toString('hex')
        User.findOne({email: req.body.email})
            .then(user => {
                if (!user) {
                    req.flash('error', 'No account with that e-mail!')
                    return res.redirect('/reset-password')
                }

                user.resetToken = token
                user.resetTokenExpiration = Date.now() + 3600000 // + 1 hour
                return user.save()
            })
            .then( result => {
                transporter.sendMail({
                    to: req.body.email,
                    from: 'liza.szauder@gmail.com',
                    subject: 'Reset Password',
                    html: `
                        <p>You requested a password reset.</p>
                        <p>Click this <a href="https://localhost:3000/new-password/${token}">link</a> to set a new password.</p></p>
                        `
                })
                .then(result => {
                    req.flash('success', 'We sent you the password reset e-mail!')
                    res.redirect('/reset-password')
                })
            })
            .catch(err => console.log(err))
    })
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token
    User
        .findOne({
            resetToken: token,
            resetTokenExpiration: {$gt: Date.now()}
        })
        .then(user => {
            if (!user) {
                return res.redirect('/reset-password')
            }

            res.render('auth/new-password', {
                pageTitle: 'New Password',
                path: '/login',
                userId: user._id,
                token: token,
                flashError: req.flash('error'),
                flashSuccess: req.flash('success')
            })
        })
        .catch(err => console.log(err))
}

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password
    const userId = req.body.userId
    const token = req.body.token
    let resetUser

    User
        .findOne({
            resetToken: token,
            resetTokenExpiration: {$gt: Date.now()},
            _id: userId
        })
        .then(user => {
            if (!user) {
                return res.redirect('/reset-password')
            }

            resetUser = user
            return bcrypt.hash(newPassword, 12)
        })
        .then(hashedPassword => {
            resetUser.password = hashedPassword
            resetUser.resetToken = undefined
            resetUser.resetTokenExpiration = undefined
            return resetUser.save()
        })
        .then(result => {
            res.redirect('/login')
        })
        .catch(err => console.log(err))
}
