const { body } = require('express-validator')

exports.product = (req, res) => {
    return [ 
        body('title')
            .exists()
            .isString()
            .trim()
            .isLength({min: 5})
            .withMessage('Please enter a title (minimum 5 characters).'),
        // body('imageUrl')
        //     .exists()
        //     .trim()
        //     .isURL()
        //     .withMessage('Please enter a valid url.'),
        body('price')
            .exists()
            .isFloat()
            .withMessage('The price must be a number.'),
        body('description')
            .exists()
            .trim()
            .isLength({min: 20})
            .withMessage('The description minimum 20 characters.')
    ]
}
