exports.globalMiddleware = (req, resp, next) => {
    resp.locals.errors = req.flash('errors');
    resp.locals.success = req.flash('success');
    resp.locals.user = req.session.user;
    next();
};

exports.errorCsrfMiddleware = (e , req, resp, next) => {

    if(e){
        return resp.render('err404');
    }
    next();
};

exports.csrfMiddleware = (req,resp,next) => {
    resp.locals.csrfTokenSend = req.csrfToken();
    next();
};