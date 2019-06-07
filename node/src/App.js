const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const port = 3001

const User = require('./user');

const connectWithRetry = function() {
  return mongoose.connect("mongodb://mongodb/outreach", function(err) {
    if (err) {
      console.error('Failed to connect to mongo on startup - retrying in 5 sec');
      setTimeout(connectWithRetry, 5000);
    }
  });
};
connectWithRetry();

let db = mongoose.connection

db.once('open', function() {
    console.log('Server connected')
}).catch((err) => {
	console.log("Server failed to connect")	
})

app.use(cors())

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

app.get('/u/:user', (req, res) => {
    const name = req.params.user
    User.find({ githubUsername: name }, function(err, data) {
      if(data.length > 0) {
        console.log(data[0].githubUsername);
        res.json({ exists: true });
      }
      else {
        console.log("empty");
        res.json({ exists: false });
      }
    });
})

app.get('/delete', (req, res) => {
    User.remove({}, function(err) {
      if(err)
        console.log(err);
    })
    res.send('Removed Everything');
})

app.get('/secret/:user', (req, res) => {
    User.findOne({ githubUsername: req.params.user }, function(err, data) {
      console.log(data);
      res.json({ secret: data.secretKey });
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
