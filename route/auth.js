const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const user = mongoose.model('User');
const bycrypt =require('bcryptjs');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../keys');
const requireLogin = require('../middleWare/requireLogin');
router.get('/',requireLogin,(req,res)=>{
    res.send('hello');
})

// router.get('/protected',requireLogin,(req,res)=>{
//     res.send('hello');
// })
router.post('/signup',(req,res)=>{
    const {name,email,password} = req.body;
    if (!email || !password || !name) {
        console.log(req);
        return res.status(422).json({error:"invalid arguments"})
    }
    user.findOne({email:email}).then((savedUser)=>{
        if(savedUser) {
            return res.status(422).json({error:"user already exists"});
        }
        bycrypt.hash(password,12).then(hashedPassword => {
            const newUser =new user({
                name,
                password: hashedPassword,
                email
            });
    
            newUser.save().then(user => {
                res.json({message:"Successfully added"})
            }).catch(error => {
                console.log(error);
            });
        }).catch(error => {console.log(error);})
      

    }).catch(error => {
        console.log(error);
    });
})

router.post('/signin',(req,res)=>{
    const {email,password} = req.body;
    if (!email || !password ) {
        return res.status(422).json({error:"invalid arguments"})
    }
    user.findOne({email:email}).then((savedUser)=>{
        if(!savedUser) {
            return res.status(422).json({error:"user not exists"});
        }
        bycrypt.compare(password,savedUser.password).then(doMatch => {
            if (doMatch) {
                // res.json({message:"Successfully signed in"})
                const token = jwt.sign({_id:savedUser.id},JWT_SECRET);
                const {_id,name,email,followers,following,profilePicture} = savedUser; 
                res.json({token,user:{_id,name,email,followers,following,profilePicture}});
            } else {
                return res.status(422).json({error:"invalid email or password"});
            }
        }).catch(error => {console.log(error);})
      

    }).catch(error => {
        console.log(error);
    });
})
module.exports = router;