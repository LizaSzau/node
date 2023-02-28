exports.get404 = (req, res, next) => {
    res.render('404', {
        pageTitle: '404',
        path: false,
        isAuthenticated: req.session.isLoggedIn
    })
}

exports.get500 = (req, res, next) => {
    res.render('500', {
        pageTitle: '500',
        path: false,
        error: req.query.error,
        isAuthenticated: req.session.isLoggedIn
    })
}