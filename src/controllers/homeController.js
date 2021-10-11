const loginClass = require('../models/loginModel');

exports.index = (req, resp) =>{

    resp.render('index');
    return;
};


exports.winners = async function(req, resp){
    const users = await loginClass.findAll()
    let element = []

    for (let i = 0; i < 10; i++) {
        if(users[i]){
            element.push({name: users[i].name, points: users[i].points}) 
        }else{
            element.push({name: "No user yet!", points: 0})
        }
        
        
    }
    element = element.sort((a, b) => (a.points > b.points) ? 1 : -1)
    element = element.reverse()

    resp.render('winners', {element: element});
    return;
};

