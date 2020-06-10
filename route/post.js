const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const post = mongoose.model('Post'); 
const requireLogin = require('../middleWare/requireLogin');

router.post('/post',requireLogin,(req,res)=>{
    const {title,body,url} = req.body;
    if ( !title || !body || !url) {
        return res.status(422).json({error :"please add all fileds"});
    }
    req.user.password = undefined;
    const newPost = new post({
        title,
        body,
        photo:url,
        postedBy: req.user
    });
    newPost.save().then(result =>{
        res.json({post:result});
    }).catch(error => {
        console.log(error);
    })
})

router.get('/post',(req,res)=>{
    post.find().populate("postedBy","_id name").
    then(posts => {
        res.json({posts})
    }).catch(error => {
        console.log(error);
    })
});
router.get('/my/post',requireLogin,(req,res)=>{
    post.find({postedBy:req.user._id}).populate("postedBy","_id name").then(
        posts => {
            res.json({posts});
        }).catch(error => {
            console.log(error);
        });
});
module.exports = router