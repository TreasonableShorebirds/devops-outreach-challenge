const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const md5 = require('md5');
const port = 3001

const User = require('./user');
const app = express();

function encrypt(key) {
    key = key.split('').reverse().join('');
    for(let i = 0; i < 5; i++)
    {
      key = md5(key);
    }
    return key;
}

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
    User.find({ githubUsername: name }, function(err, data) {
      if(data.length > 0) {
        console.log('User already exists');
        res.send('User already exists');
      }
      else {
        const key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const encryptedKey = encrypt(key);
        console.log('Adding new user');
        const newUser = new User();
        newUser.githubUsername = name;
        newUser.secretKey = key;
        newUser.encryptedKey = encryptedKey;
        newUser.save();
        res.json({ secret: key });
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

app.get('/secret/:user/:key', (req, res) => {
    User.findOne({ githubUsername: req.params.user }, function(err, data) {
      console.log(data);
      res.json({ secret: data.secretKey });
    })
})

app.get('/encrypt/:key', (req, res) => {
    const key = req.param.user

});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
