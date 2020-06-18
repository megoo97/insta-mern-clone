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

router.get('/post',requireLogin,(req,res)=>{
    post.find().populate("postedBy","_id name").populate("comments.postedBy","_id name").
    then(posts => {
        res.json({posts})
    }).catch(error => {
        console.log(error);
    })
});
router.get('/user/followers/posts',requireLogin,(req,res)=>{
    post.find({postedBy:{$in:req.user.following}}).populate("postedBy","_id name").populate("comments.postedBy","_id name").
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

router.put('/post/like',requireLogin,(req,res)=>{
    post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err) {
            return res.status(422).json({error:err})
        } else {
            return res.json(result)
        }
    })
});

router.put('/post/unlike',requireLogin,(req,res)=>{
    post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err) {
            return res.status(422).json({error:err})
        } else {
            res.json(result)
        }
    })
});

router.put('/post/comment',requireLogin,(req,res)=>{
    const comment ={
        text:req.body.text,
        postedBy: req.user._id
    }
    post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    }).populate("comments.postedBy","_id name").populate("postedBy","_id name").exec((err,result)=>{
        if(err) {
            return res.status(422).json({error:err})
        } else {
            res.json(result)
        }
    })
});
router.delete('/post/:postId',requireLogin,(req,res) =>{
    post.findOne({_id:req.params.postId}).populate("postedBy","_id").exec((err,pos) =>{
        if(err) {
            return res.status(422).json({error:err})
        } if(pos.postedBy._id.toString() === req.user._id.toString()) {
            pos.remove().then(result =>{
                res.json(result);
            }).catch(error =>{console.log(error);})
        }
    })
})
module.exports = router