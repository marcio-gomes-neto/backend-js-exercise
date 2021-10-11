const loginClass = require('../models/loginModel');

exports.index = (req, resp,next) =>{
    resp.render('register');
    next();
};

exports.register = async function(req, resp){
    try{
        
        const login = new loginClass(req.body);
        await login.register();
        
        if(login.errors.length >0 ){
            req.flash('errors', login.errors);
            req.session.save(function(){
                return resp.redirect('index');
            });
            return;
        };

        if(req.query.id){
            loginClass.addPoint(req.query.id)
        }

        req.flash('success', 'Usuário criado com sucesso!');
        
        req.session.save(function(){
            return resp.redirect('/')
        })

    } catch(e){
        console.log(e);
        return resp.render('err404');
    }
};