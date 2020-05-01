const express = require("express");
const mongoose = require("mongoose");
const fetch = require("node-fetch");
const cors = require("cors");
const md5 = require("md5");
const port = 3001;

const User = require("./user");
const app = express();

function checkUsername(u) {
  return fetch("https://api.github.com/users/" + u)
    .then(function (a) {
      return a.json();
    })
    .then(function (b) {
      if (b.message === "Not Found") {
        return false;
      } else {
        return b;
      }
    });
}

function encrypt(key) {
  key = key.split("").reverse().join("");
  for (let i = 0; i < 5; i++) {
    key = md5(key);
  }
  return key;
}

const connectWithRetry = function() {
  return mongoose.connect("mongodb://outreach-db/outreach", {
    useNewUrlParser: true,
    useUnifiedTopology: true },
    function(err) {
      if (err) {
        console.error(
          "Failed to connect to mongo on startup - retrying in 5 sec"
        );
        console.log(err);
        setTimeout(connectWithRetry, 5000);
      }
    }
  );
};

connectWithRetry();

let db = mongoose.connection;

db.once("open", function () {
  console.log("Server connected");
}).catch((err) => {
	console.log("Server failed to connect")
})

app.use(cors())

async function hasEnabledTravis(u) {
  const url =
    'https://api.travis-ci.org/repo/' + u +
    '%2Fapprentice-outreach-demo-application/builds?limit=5';
  const response = await fetch(url, { headers: { 'Travis-API-Version': '3' } });
  const data = await response.json();
  return (data.builds && data.builds.length > 0);
}

async function hasFixedDocker(u) {
  const url =
    'https://api.travis-ci.org/repo/' + u +
    '%2Fapprentice-outreach-demo-application/builds?limit=5';
  const response = await fetch(url, { headers: { 'Travis-API-Version': '3' } });
  const data = await response.json();
  console.log(data.builds[0]);
  try {
    if(data.builds[0].stages[1].name !== "Docker-env") {
      alert("Travis API Change function hasFixedDocker()");
    }
    return data.builds[0].stages[1].state === 'passed';
  } catch(error) {
    return false;
  }
}

async function hasFixedBuild(u) {
  const url =
    'https://api.travis-ci.org/repo/' + u +
    '%2Fapprentice-outreach-demo-application/builds?limit=5';
  const response = await fetch(url, { headers: { 'Travis-API-Version': '3' } });
  const data = await response.json();
  console.log(data.builds[0]);
  const gitHubResponse = await fetch('https://api.github.com/repos/' +
    u + '/apprentice-outreach-demo-application/contents/.travis.yml' +
    '?ref=' + data.builds[0].commit.sha);
  const gitHubData = await gitHubResponse.json();
  console.log(gitHubData.sha)
  return data.builds[0].state === 'passed'; // TODO check SHA matches correct .travis.yml SHA
}

async function hasAddedTravis(u) {
  const url =
    'https://api.github.com/repos/' + u + '/apprentice-outreach-demo-application/contents/';
  const response = await fetch(url);
  const data = await response.json();
  for (var key in data) {
    if (data[key].name === '.travis.yml') {
      return true;
    }
  }
  return false;
}

async function hasForked(u) {
  const url =
    'https://api.github.com/repos/liatrio/apprentice-outreach-demo-application/forks';
  const response = await fetch(url);
  const data = await response.json();
  for (var key in data) {
    if (data[key].owner.login === u) {
      return true;
    }
  }
  return false;
}

app.get('/api/stage/:user/:done', async (req, res) => {
  const user = req.params.user;
  const done = req.params.done;
  const forked = await hasForked(user);
  if(!forked) {
    res.send({stage: 2});
    User.findOne({ githubUsername: user }, function (err, data) {
      if (data != null) {
        data.stage = 2;
        data.save()
      }
    });
    return;
  }
  const hasTravis = await hasAddedTravis(user);
  if(!hasTravis) {
    res.send({stage: 3});
    User.findOne({ githubUsername: user }, function (err, data) {
      if (data != null) {
        data.stage = 3;
        data.save()
      }
    });
    return;
  }
  const enabledTravis = await hasEnabledTravis(user);
  if(!enabledTravis) {
    res.send({stage: 4});
    User.findOne({ githubUsername: user }, function (err, data) {
      if (data != null) {
        data.stage = 4;
        data.save()
      }
    });
    return;
  }
  const fixedDocker = await hasFixedDocker(user);
  if(!fixedDocker) {
    res.send({stage: 5});
    User.findOne({ githubUsername: user }, function (err, data) {
      if (data != null) {
        data.stage = 5;
        data.save()
      }
    });
    return;
  }
  const fixedBuild = await hasFixedBuild(user);
  if(!fixedBuild) {
    res.send({stage: 6});
    User.findOne({ githubUsername: user }, function (err, data) {
      if (data != null) {
        data.stage = 6;
        data.save()
      }
    });
    return;
  }
  if(done == 'no') {
    res.send({stage: 7});
    User.findOne({ githubUsername: user }, function (err, data) {
      if (data != null) {
        data.stage = 7;
        data.save()
      }
    });
    return;
  }
  res.send({stage: 8});
  User.findOne({ githubUsername: user }, function (err, data) {
    if (data != null) {
      data.stage = 8;
      data.save()
    }
  });
})

app.get('/api/user/:user', (req, res) => {
    const name = req.params.user
    User.findOne({ githubUsername: name }, function(err, data) {
      console.log(data)
      if(data != null) {
        console.log('User already exists');
        res.json({ secret: data.secretKey })
      }
      else {
        const key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const encryptedKey = encrypt(key);

        checkUsername(name)
        .then(function(a) {
          console.log('ENTERED')
          if(a !== false){
           console.log('Adding new user');
           const newUser = new User();
           newUser.githubUsername = name;
           newUser.secretKey = key;
           newUser.encryptedKey = encryptedKey;
           newUser.challenge = 'intial';
           newUser.stage = 1;
           newUser.save();
           res.json({ secret: key });
          }
          else{
           res.send('GITHUB USER DOES NOT EXIST');
          }
        })
      }
    });
})

app.get("/api/leaderboard/", (req, res) => {
  User.find({}).sort('-stage').exec(function (err, data) {
    if (data != null) {
      res.send(JSON.stringify(data));
    }
  });
});

app.get("/api/secret/:user/:key", (req, res) => {
  console.log(req.params);
  User.findOne({ githubUsername: req.params.user }, function (err, data) {
    console.log(data);
    if (data != null) {
      if (data.encryptedKey === req.params.key) {
        res.send({ correct: true });
      } else {
        res.send({ correct: false });
      }
    }
  });
});

app.get("/api/encrypt/:key", (req, res) => {
  const key = req.param.user;
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
