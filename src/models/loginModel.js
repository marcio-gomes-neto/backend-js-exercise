const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const { login } = require('../controllers/loginController');

const loginSchema = new mongoose.Schema({
    email: {type:String, required: true},
    password: {type:String, required: true},
    name: {type:String,  required: true},
    phone: {type:String,  required: true},
    points: {type:Number,  required: false},
    data_conta: {type: Date, default: Date.now},
})

const loginModel = mongoose.model('Login', loginSchema);

class Login{
    constructor(body){
        this.body = body;
        this.errors = [];
        this.user = null;
    }
    
    async loginUser(){
        
        if(this.errors.length > 0){return;};
        this.user = await loginModel.findOne({email:this.body.email});
        
        if(!this.user){
            this.errors.push('Usuário ou Senha Inválida');
            return;
        } 

        if(!bcryptjs.compareSync(this.body.password, this.user.password)){
            this.errors.push('Usuário ou Senha Inválida');
            this.user = null;
            return;
        };

    }
    
    async register(){
        if(!this.body){
            this.errors.push('Favor Inserir as informações abaixo!') 
            return;
        }

        if(!this.body.email) this.errors.push('É necessário inserir um email')
        if(!this.body.password) this.errors.push('É necessário inserir uma senha')
        if(!this.body.phone) this.errors.push('É necessário inserir um telefone')
        if(!this.body.name) this.errors.push('É necessário inserir um nome')
        if(this.errors.length > 0){return;};

        this.valida();
        if(this.errors.length > 0){return;};
        
        await this.userExists();
        if(this.errors.length > 0){return;};
        
        const salt = bcryptjs.genSaltSync();
        this.body.password = bcryptjs.hashSync(this.body.password, salt);
        this.body.points = 1
        this.user = await loginModel.create(this.body);
        
    }

    async userExists(){
        const userExists = await loginModel.findOne({email:this.body.email});
        if(userExists) this.errors.push('Este email já foi utilizado!');
    }

    valida(){
        this.cleanUp();
        
        if(!validator.isEmail(this.body.email)){
            this.errors.push('Email inválido')
        };
        
        if(this.body.password.length < 5 || this.body.password.length > 20){
            this.errors.push('A senha deve estar entre 5 e 20 caracteres');
        };

        if(this.body.phone){
            if(this.body.phone.length < 6 || this.body.phone.length > 15){
                this.errors.push('O telefone deve ter mais de 6 digitos e menos de 15');
            };
        }
    }

    cleanUp(){
        for(const key in this.body){
            if(typeof this.body[key] !== 'string'){
                this.body[key] = '';
            }
        }

        this.body = {
            email: this.body.email,
            password: this.body.password,
            name: this.body.name,
            phone: this.body.phone
        }
    }
    
    cleanUpInfo(){
        for(const key in this.body){
            

            if(typeof this.body[key] !== 'string'){
                this.body[key] = ''; 
            }
            if(this.body[key] === ''){
                delete this.body[key]
            }
        }   
    }

    static async addPoint(id){
        let getPoint = await loginModel.findById(id)
        getPoint = getPoint.points + 1
        await loginModel.findByIdAndUpdate(id,{points: getPoint},{useFindAndModify: false})
    }
    
    async edit(id){

        if(typeof id !== 'string') return;
        this.cleanUpInfo();

        if(this.errors.length > 0) return;
        await loginModel.findByIdAndUpdate(id, this.body, {useFindAndModify: false});

    }
    static async findAll(){
        const users = await loginModel.find();
        return users 
    }

    async readInDB(email){
        if(typeof email !== 'string') return;
        const usuario = await loginModel.findOne({email: email});
        return usuario;
    }

    async delete(email){
        if(typeof email !== 'string') return;
        const contat_delete = await loginModel.findOneAndDelete(email);
        return contat_delete;
    }
}

module.exports = Login;