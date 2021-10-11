const express = require('express');
const route = express.Router();
const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');
const infoController = require('./src/controllers/infoController');
const registerController = require('./src/controllers/registerController')


route.get('/', homeController.index);
route.get('/winners', homeController.winners);


route.get('/register/index', registerController.index);
route.post('/register/index', registerController.register);

//route login
route.get('/login/index', loginController.index);
route.post('/login/login', loginController.login);
route.get('/login/logout', loginController.logout);

//route info
route.get('/info/index', infoController.index);
route.get('/info/delete', infoController.delete);
route.get('/info/edit', infoController.getEdit);
route.post('/info/edit', infoController.edit);

module.exports = route;