const { body } = require('express-validator')
const User = require('../../models/user')

exports.userSignup = (req, res) => {
    return [ 
        body('name', 'Your name is minmum 6 characters.')
        .exists()
        .isLength({min: 5})
        .trim(),
        body('email')
            .exists()
            .isEmail()
            .withMessage('Please enter a valid e-mail.')
            .custom((value, {req}) => {
                return User.findOne({email: value})
                    .then(user => {
                        if (user) {
                            return Promise.reject('This e-mail has been already registered.')
                        }
                    })
            })
            .normalizeEmail({gmail_remove_dots: false}),
        body('password', 'Please enter a password with only number and letters, and minmum 6 characters.')
            .exists()
            .isLength({min: 5})
            .isAlphanumeric()
            .trim(),
        /*
        body('confirmPassword')
            .custom((value, {req}) => {
                if (value !== req.body.password) {
                    throw new Error('The password confirmation is different.')
                }
                return true
            })
        */
       ] 
}

exports.userLogin = (req, res) => {
    return [ 
        body('email')
            .exists()
            .isEmail()
            .withMessage('Please enter a valid e-mail.')
            .normalizeEmail({gmail_remove_dots: false}),
        body('password', 'Please enter a password with only number and letters, and minmum 6 characters.')
            .exists()
            .isLength({min: 5})
            .isAlphanumeric()
            .trim()
       ] 
}

exports.userStatus = (req, res) => {
    return [ 
        body('status')
            .trim()
            .not()
            .isEmpty()
            .withMessage('Missing status.')
       ] 
}