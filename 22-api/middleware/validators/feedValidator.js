const { body } = require('express-validator')

exports.feed = (req, res) => {
    return [ 
        body('title')
            .exists()
            .isString()
            .trim()
            .isLength({min: 5})
            .withMessage('Please enter a title (minimum 5 characters).'),
        body('content')
            .exists()
            .isString()
            .trim()
            .isLength({min: 5})
            .withMessage('The content is minimum 5 characters.')
    ]
}
