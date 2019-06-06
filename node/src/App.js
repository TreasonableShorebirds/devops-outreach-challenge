const express = require('express')
const app = express()
const mongoose = require('mongoose')
const port = 3001

const User = require('./user');

mongoose.connect('mongodb://mongodb/outreach', {reconnectTries: Number.MAX_VALUE})

let db = mongoose.connection

db.once('open', function() {
    console.log('Server connected')
}).catch((err) => {
	console.log(err)	
})

app.get('/', (req, res) => {
    User.find({}, function(err, data){
        if(err)
            console.log(err)
        res.send(data);
    })
})

app.get('/user/:user', (req, res) => {
    const name = req.params.user
    console.log(name)
    const newUser = new User()
    newUser.githubUsername = name
    newUser.save()
    res.send('Added a new user')
})




app.listen(port, () => console.log(`Example app listening on port ${port}!`))
