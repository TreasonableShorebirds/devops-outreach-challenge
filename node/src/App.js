const express = require('express');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const cors = require('cors');
const md5 = require('md5');
const port = 3001

const User = require('./user');
const app = express();

//DATABASE CONNECTION STUFF
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



//HELPER FUNCTIONS
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

const findLastStepComplete = (listOfSteps) => {
  let currentStep = 0;
  for (let i = 0; i < listOfSteps.length; i++) {
    currentStep = i + 1;
    if (currentStep !== listOfSteps[i])
      return currentStep;
  }
  return currentStep;
}




app.use(cors())

app.get('/', (req, res) => {
  res.send("Information for step 1, entering their github username");
})

/* This is where all of the step checking is done, the react Button component 
that we created simply sends a GET request to this endpoint with the user's name attached
once the step is checked for and is approved we send back the content of the next page for 
the next step */
app.get('/user/:user', (req, res) => {
  const name = req.params.user
  User.findOne({ githubUsername: name }, (err, data) => {
    console.log(data)
    if (data == null) {
      //Step one logical checking
      const key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const encryptedKey = encrypt(key);

      checkUsername(name).then(response => {
        if (response !== false) {
          console.log('Adding new user');
          const newUser = new User();
          newUser.githubUsername = name;
          newUser.secretKey = key;
          newUser.encryptedKey = encryptedKey;
          newUser.stepsComplete = [1];
          newUser.save();
          //NEED TO CHANGE THIS RES TO SEND THE TEXT FOR THE SECOND STEP
          res.send("Information for step 2, coming straight after creation of the user");
        }
        else {
          //SEND STEP ONE INFO AGAIN
          res.send('GITHUB USER DOES NOT EXIST');
        }
      })
    }
    else {
      let step = findLastStepComplete(data.stepsComplete);
      switch (step) {
        case 1:
          //Check if they've forked the repo
          //If they have, send step 3 info
          //If they haven't send step 2 info again
          console.log("Checking for step 2");
          let forked = false;
          const url = 'https://api.github.com/repos/liatrio/apprentice-outreach-demo-application/forks';
          fetch(url).then(rawData => {
            return rawData.json();
          }).then(githubData => { 
            for (var key in githubData) {
              if (githubData[key].owner.login === name) {
                forked = true;
                data.stepsComplete.push(2);
                data.save();
              }
            }
          
            if (forked === true)
              res.send("Move to step 3");
            else
              res.send("Repeat step 2");
          }).catch(err => {
            console.log(err);
          });
          break;
        case 2:
          //Check if they've added .travis.yml to their repo
          console.log("Checking for step 3");
          let addedTravis = false;
          const travisUrl ='https://api.travis-ci.org/repo/' + name +'%2Fapprentice-outreach-demo-application/builds?limit=5';
          fetch(travisUrl, { headers: { 'Travis-API-Version': '3' } }).then(rawData => {
            return rawData.json();
          }).then(travisData => {
            if (travisData.builds && travisData.builds.length > 0) {
              addedTravis = true;
              data.stepsComplete.push(3);
              data.save();
            }
            if (addedTravis === true)
              res.send("Move to step 4");
            else
              res.send("Repeat step 3");
              
          }).catch(err => {
            console.log(err);
          });
          break;
        case 4:
          //Step 4 Checking if their repo on travisCI is enabled
          console.log("Step 4");
          res.send("Information for step 4");
          break;
        case 5:
          //Step 5 Checking if the Docker errors are fixed
          console.log("Step 5");
          res.send("Information for step 5");
          break;
        case 6:
          //Step 6 Checking if the React errors are fixed
          console.log("Step 6");
          res.send("Information for step 6");
          break;
        case 7:
          //Step 7 Checking if the key is decoded 
          console.log("Step 7");
          res.send("Information for step 7");
          break;
        case 8:
          console.log("Step 8");
          res.send("Information for step 8");
          break;
        case 9:
          console.log("Step 9");
          res.send("Information for step 9");
          break;
        default:
          console.log("Something went wrong");
          break;
      }
    }
  })
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

app.get('/clear', (req, res) => {
  User.remove({}, (err) => {
    if (err)
      console.log(err);
  })
  res.send('Removed Everything');
})

app.get('/delete/:user', (req, res) => {
  const name = req.params.user;
  User.remove({ githubUsername: name }, (err, data) => {
    if (err) {
      console.log(err);
      res.send("Encountered a problem");
    }
    else {
      console.log("Deleted user");
      res.send("Deleted user");
    }
  })
})


app.get('/find/:user', (req, res) => {
  const name = req.params.user;
  User.findOne({ githubUsername: name }, (err,data) => {
    if (err)
      console.log(err);
    if (data)
      console.log(data);

    res.send(data);
  })
})



app.listen(port, () => console.log(`Example app listening on port ${port}!`))
