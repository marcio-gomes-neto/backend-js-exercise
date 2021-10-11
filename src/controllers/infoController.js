const loginClass = require('../models/loginModel');


exports.index = async (req, resp, next) =>{
    try{
        
        const login = new loginClass();
        const usuario = await login.readInDB(req.session.user.email);
        
        resp.render('info', {usuario});
        next();

    }catch(e){
        resp.render('info');
        next();
    }
    
}

exports.getEdit = async function(req,resp,next){

    resp.render('info_edit');
    next();
}

exports.edit = async function(req,resp,next){
    try{
        
        const login = new loginClass(req.body);
        
        if(!req.session.user._id) return resp.render('err404');
        await login.edit(req.session.user._id);
       
        if(login.errors.length > 0){
            req.flash('errors', login.errors)
            req.session.save(() => resp.redirect('/info/index'));
            return;
        }

        req.flash('success', 'Informações alteradas com sucesso!');
        req.session.save(() => resp.redirect('/info/index'));

        return;

    }catch(e){
        console.log(e)
        resp.render('err404');
    }
    
}

exports.delete = async function (req,resp,next){
    const login = new loginClass();

    if(!req.session.user.email) return resp.render('err404');
    const contato = await login.delete(req.session.user.email);
    if(!contato) return resp.render('err404');
    
    req.session.destroy();
    resp.redirect('/');
    
    return;
}

