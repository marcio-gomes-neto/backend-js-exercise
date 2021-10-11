const loginClass = require('../models/loginModel');

exports.index = (req, resp,next) =>{
    resp.render('login');
    next();
};

exports.login = async function(req, resp){
    try{    
        const login = new loginClass(req.body);
        await login.loginUser();

        if(login.errors.length >0 ){
            req.flash('errors', login.errors);
            req.session.save(function(){
                return resp.redirect('index');
            });
            return;
        };

        req.flash('success', 'Você está conectado!');
        req.session.user = login.user;

        req.session.save(function(){
            return resp.redirect('/')
        })

    } catch(e){
        console.log(e);
        return resp.render('err404');
    }

}

exports.logout = function(req,resp){
    req.session.destroy();
    resp.redirect('/');
}