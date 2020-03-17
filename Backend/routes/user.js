
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const {User, validateUser} = require('../models/userModel');
const config = require('config');
const {LoggedINUser} = require('../models/loggedInUsersModel'); 
router.get('/',async (req,res)=>{

    const users = await User.find();
    
    res.send(users);

});


router.post('/', async(req,res)=>{
    

    const {error} = validateUser(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if(user) return res.status(400).send('User with the given email already exists');

    user = new User(_.pick(req.body,['name','email','password']));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    
    await user.save();
    const token = user.generateAuthToken();
    res.send(token);

    const loggedIN = new LoggedINUser({
        token
    })
    await loggedIN.save();

    // res.send(_.pick(user,['name','email']));
});

module.exports =  router;

// function frontendAuth(req,res,next){
//     const frontendId = req.header('x-frontendId');
//     if(!frontendId) return res.status(401).send('Access Denied-frontend Id not found--Cant create new user ');
//     if(frontendId !== config.get('frontendId')) return res.status(403).send('Forbidden--Invalid frontend ID');
//     next();
// }