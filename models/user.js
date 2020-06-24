const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;
const userSchema =mongoose.Schema({
    name: {
        type: String,
        required: true,
    }, email: {
        type: String,
        required: true,
    }, password: {
        type: String,
        required: true,
    },
    followers:[{
        type: ObjectId,
        ref: "User",
    }],
    following:[{
        type: ObjectId,
        ref: "User",
    }],
    profilePicture:{
        type:String,
        default:"https://img.icons8.com/carbon-copy/2x/name.png",
    },
    resetToken:String,
    expireToken:Date,
})

mongoose.model('User',userSchema);