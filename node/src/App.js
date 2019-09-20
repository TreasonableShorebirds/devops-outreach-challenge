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



/* This route is only called when a user first comes to the site, so it'll always only display
information for step one*/
app.get('/', (req, res) => {
  res.send("JSON Response with instructions for step 1, currentStep: 1, highestStepComplete: 1");
})



/* This is where all of the step checking is done, the react Button component 
that we created simply sends a GET request to this endpoint with the user's name attached
once the step is checked for and is approved we send back the content of the next page for 
the next step */
app.get('/:user/:step', (req, res) => {
  const name = req.params.user
  const step = req.params.step
  User.findOne({ githubUsername: name }, (err, data) => {
    console.log(data)
    if (data == null) {
      //No user found in our database, create new User entry with key
      const key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const encryptedKey = encrypt(key);

      checkUsername(name).then(response => {
        if (response !== false) {
          //Github Username does exist, create a new User entry in mongoDB and send info for Step 2
          console.log('Adding new user');
          const newUser = new User();
          newUser.githubUsername = name;
          newUser.secretKey = key;
          newUser.encryptedKey = encryptedKey;
          newUser.stepsComplete = [1];
          newUser.save();
          res.send("JSON Response with instructions for step 2, currentStep: 2, highestStepComplete: 1, Error: None");
        }
        else {
          //Github username does not exist, return the same step with the error
          res.send("JSON Response with instructions for step 1, currentStep: 1, highestStepComplete: 1, Error: Github user does not exist");
        }
      })
    }
    else {
      //User found in our database, determine which step they're on and send information
      let step = findLastStepComplete(data.stepsComplete);
      switch (step) {
        case 1:
          //They've completed step one, Check if they've forked the repo
          //If they have, send step 3 info
          //If they haven't send step 2 info again
          console.log("Checking for step 2");
          let forked = false;
          const url = 'https://api.github.com/repos/liatrio/apprentice-outreach-demo-application/forks';
          fetch(url).then(rawData => {
            return rawData.json();
          }).then(githubData => { 
            for (let key in githubData) {
              if (githubData[key].owner.login === name) {
                forked = true;
                data.stepsComplete.push(2);
                data.save();
              }
            }
          
            if (forked === true)
              res.send("JSON Response with instructions for step 3, currentStep: 3, highestStepComplete: 2, Error: None");
            else
              res.send("JSON Response with instructions for step 2, currentStep: 2, highestStepComplete: 1, Error: Repository has not been forked");
          }).catch(err => {
            console.log(err);
          });
          break;
        case 2:
          //They've completed step two, Check if they've added .travis.yml to their repo
          console.log("Checking for step 3");
          let addedTravis = false;
          const url = 'https://api.github.com/repos/' + u + '/apprentice-outreach-demo-application/contents/';
          fetch(url).then(rawData => {;
            return rawData.json();
            }).then(githubData => {
              for (let key in githubData) {
                if (githubData[key].name === '.travis.yml') {
                  addedTravis = true;
                  data.stepsComplete.push(3);
                  data.save();
                }
              }
              if (enabledTravis === true)
                res.send("JSON Response with instructions for step 4, currentStep: 4, highestStepComplete: 3, Error: None");
              else
                res.send("JSON Response with instructions for step 3, currentStep: 3, highestStepComplete: 2, Error: Travis has not been enabled");
            }).catch(err => {
              console.log(err);
            });
          break;
        case 3:
          //They've completed step three, Check if travisCI is enabled for their repo
          console.log("Checking for step 4");
          let addedTravis = false;
          const travisUrl ='https://api.travis-ci.org/repo/' + name +'%2Fapprentice-outreach-demo-application/builds?limit=5';
          fetch(travisUrl, { headers: { 'Travis-API-Version': '3' } }).then(rawData => {
            return rawData.json();
          }).then(travisData => {
            if (travisData.builds && travisData.builds.length > 0) {
              data.stepsComplete.push(4);
              data.save();
              res.send("JSON Response with instructions for step 5, currentStep: 5, highestStepComplete: 4, Error: None");
            } else {
              res.send("JSON Response with instructions for step 4, currentStep: 4, highestStepComplete: 3, Error: .travis.yml has not been added to the repo");
            }
          }).catch(err => {
            console.log(err);
            res.send("JSON Response with instructions for step 4, currentStep: 4, highestStepComplete: 3, Error: Encountered server error");
          });
          break;
        case 4:
          //They've completed step four, Check if the Docker errors are fixed
          console.log("Checking for step 5");
          const url = 'https://api.travis-ci.org/repo/' + u + '%2Fapprentice-outreach-demo-application/builds?limit=5';
          fetch(url, { headers: { 'Travis-API-Version': '3' } }).then(rawData => {
            return rawData.json();
          }).then(travisData => {
            console.log(data.builds[0]);
            if(data.builds[0].stages[1].name !== "Docker-env") {
              console.log("Travis API Change function hasFixedDocker()");
            }
            if (data.builds[0].stages[1].state === 'passed')
              res.send("JSON Response with instructions for step 6, currentStep: 6, highestStepComplete: 5, Error: None");
            else
              res.send("JSON Response with instructions for step 5, currentStep: 5, highestStepComplete: 4, Error: .travis.yml has not been added to the repo");
          }).catch(err => {
            console.log(err);
            res.send("JSON Response with instructions for step 5, currentStep: 5, highestStepComplete: 4, Error: Encountered a server error");
          }); 
          break;
        case 5:
          //They've completed step 5, Checking if the React errors are fixed
          console.log("Checking for step 6");
          const url = 'https://api.travis-ci.org/repo/' + u + '%2Fapprentice-outreach-demo-application/builds?limit=5';
          fetch(url, { headers: { 'Travis-API-Version': '3' } }).then(rawData => {
            return rawData.json();
          }).then(travisData => {
            console.log(travisData.builds[0]);
            return fetch('https://api.github.com/repos/' + u + '/apprentice-outreach-demo-application/contents/.travis.yml' + '?ref=' + travisData.builds[0].commit.sha);
          }).then(rawGithubData => {
            return rawTravisResponse.json(); 
          }).then(githubData => {
            console.log(gitHubData.sha)
            if (data.builds[0].state === 'passed') // TODO check SHA matches correct .travis.yml SHA
              res.send("JSON Response with instructions for step 7, currentStep: 7, highestStepComplete: 6, Error: None");
            else
              res.send("JSON Response with instructions for step 6, currentStep: 6, highestStepComplete: 5, Error: None");
          });
          break;
        case 6:
          //They've completed step 6, Checking if the key is decoded 
          console.log("Checking for step 7");
          break;
        case 7:
          //They've completed step 7 (The whole exercise), Check if they've filled out the form
          console.log("Checking for step 8");
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
