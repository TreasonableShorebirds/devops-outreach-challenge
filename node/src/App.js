const express = require('express');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const cors = require('cors');
const md5 = require('md5');
const port = 3001

const User = require('./user');
const app = express();

const checkUsername = (username) => {
  return fetch('https://api.github.com/users/' + username).then(response => {
    return response.json();
  }).then(jsonResponse => {
    if (jsonResponse.message === 'Not Found') {
      return false;
    }
    else {
      return jsonResponse;
    }
  });
}

const encrypt = (key) => {
  key = key.split('').reverse().join('');
  for (let i = 0; i < 5; i++) {
    key = md5(key);
  }
  return key;
}

const connectWithRetry = () => {
  return mongoose.connect("mongodb://mongodb/outreach", (err) => {
    if (err) {
      console.error('Failed to connect to mongo on startup - retrying in 5 sec');
      setTimeout(connectWithRetry, 5000);
    }
  });
};

connectWithRetry();

let db = mongoose.connection

db.once('open', () => {
  console.log('Server connected')
}).catch(err => {
	console.log("Server failed to connect")	
})

app.use(cors())

app.get('/user/:user', (req, res) => {
  const name = req.params.user
  User.findOne({ githubUsername: name }, (err, data) => {
    console.log(data)
    if (data != null) {
      console.log('User already exists');
      res.json({ secret: data.secretKey })
    }
    else {
      const key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const encryptedKey = encrypt(key);

      checkUsername(name).then(response => {
        if (response !== false) {
          console.log('Adding new user');
          const newUser = new User();
          newUser.githubUsername = name;
          newUser.secretKey = key;
          newUser.encryptedKey = encryptedKey;
          newUser.stepsComplete = [1,2];
          newUser.save();
          res.json({ newUser });
        }
        else {
          res.send('GITHUB USER DOES NOT EXIST');
        }
      })  
    }
  });
})

app.get('/secret/:user/:key', (req, res) => {
  console.log(req.params)
  User.findOne({ githubUsername: req.params.user }, (err, data) => {
    console.log(data);
    if (data!= null) {
      if (data.encryptedKey === req.params.key) {
        res.json({ correct: true})
      }
      else {
        res.send({ correct: false})
      }
    }
  })
})

app.get('/encrypt/:key', (req, res) => {
  const key = req.param.user
});

app.get('/delete', (req, res) => {
  User.remove({}, (err) => {
    if (err)
      console.log(err);
  })
  res.send('Removed Everything');
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
