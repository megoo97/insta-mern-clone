const express = require('express');
const app = express();
const port = 5000;
const mongoose = require('mongoose');
const {MONGOURI} = require('./keys');

mongoose.connect(MONGOURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});
mongoose.connection.on('connected',()=> {
    console.log('connected to mongo db')
})
mongoose.connection.on('error',(err)=> {
    console.log('error connecting to mongo db',err)
})

app.use(express.json());
require('./models/user');
require('./models/post');
app.use(require('./route/auth'));
app.use(require('./route/post'));
app.use(require('./route/user'));

app.listen(port,()=>{
console.log("server is running",port)
});