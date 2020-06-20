const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const user = mongoose.model('User');
const bycrypt =require('bcryptjs');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../keys');
const requireLogin = require('../middleWare/requireLogin');
const nodemailer =require('nodemailer');
const sendGrid =require('nodemailer-sendgrid-transport');
const crypto =require('crypto');
const transporter = nodemailer.createTransport(sendGrid({
    auth:{
        api_key:"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"
    }
}))
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
                transporter.sendMail({
                    to:user.email,
                    from:'ahmedabdalmged1997@gmail.com',
                    subject:"signup successfully",
                    html:"<h1>welcome to our insta</h1>"
                }).then(()=>{
                    res.json({message:"Successfully added"})
                }).catch(error => {
                    console.log(error);
                });
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

router.post('/reset-password',(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err) {
            console.log(err);
        }
        const token = buffer.toString('hex');
        user.findOne({email:req.body.email})
        .then(user => {
            if(!user) {
                return res.status(422).json({message:"user doesn't exist"});
            }
            user.resetToken=token;
            user.expireToken=Date.now() +3600000;
            user.save().then(result =>{
                transporter.sendMail({
                    to:user.email,
                    from:'ahmedabdalmged1997@gmail.com',
                    subject:"password reset",
                    html:`<p>reset password message</p><a href="http://localhost:3000/reset/${token}">Link</a>`
                }).then(()=>{
                    res.json({message:"check your email"})
                }).catch(error => {
                    console.log(error);
                });
            })
        })
    })
})

router.post('/new-password',(req,res)=>{
    const newPassword = req.body.password
    const sentToken = req.body.token
    user.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"Try again session expired"})
        }
        bcrypt.hash(newPassword,12).then(hashedpassword=>{
           user.password = hashedpassword
           user.resetToken = undefined
           user.expireToken = undefined
           user.save().then((saveduser)=>{
               res.json({message:"password updated success"})
           })
        })
    }).catch(err=>{
        console.log(err)
    })
})

module.exports = router;