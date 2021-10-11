require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.CONNECTIONSTRING, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log(`Connection ready to go`);
        app.emit('ready');
    })
    .catch(e => console.log(e));

const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');

const routes = require('./routes');
const path = require('path');
const helmet = require('helmet');
const csrf = require('csurf');
const {globalMiddleware, errorCsrfMiddleware, csrfMiddleware } = require(path.resolve(__dirname, 'src', 'middlewares', 'middlewareFile.js'));

app.use(helmet());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.resolve(__dirname, 'public')));

const sessionOptions = session({
    secret: process.env.SESSIONSTRING,
    store: new mongoStore({ mongooseConnection: mongoose.connection}),
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge: 1000* 60 * 60 * 24 * 7,
        httpOnly: true
    }
});

app.use(sessionOptions);
app.use(flash());

app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

//app.use(globalMiddleware);

app.use(csrf());
app.use(csrfMiddleware);
app.use(errorCsrfMiddleware);

app.use(globalMiddleware);
app.use(routes);

app.on('ready', (runPort = 3000)=>{
    
    app.listen(runPort, ()=>{        
        console.log(`Server running on port ${runPort}`);
        console.log(`Go to: http://localhost:${runPort}/`); 
    });
});
