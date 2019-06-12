import React, { Component } from 'react';
import { Segment, Form, Button } from 'semantic-ui-react';

//var ec2 = 'http://ec2-34-211-208-118.us-west-2.compute.amazonaws.com:3001/'
var ec2 = 'http://localhost:3001/'

const instructionText = [
  <div>
    GitHub is a hosting service for use with the version control system git. It's common to use version control systems like git to manage changes to your code, and services like GitHub make sharing those changes easy.
    <br />
    <br />
    Create a <a target="_blank" rel="noopener noreferrer" href="https://github.com/join">GitHub</a> account if you don't already have one.
    <br />
    <br />
    Enter your username in the field below to start tracking your progress.
    <br />
    <br />
  </div>,
  <div>
    GitHub uses a concept of 'forking' when someone wants to make their own version of someone else's project. We've created a demo application, to show off some automated pipeline tools, and to test your debugging skills. You can take the project we've created, and make your own copy where you can fix the bugs.
    <br />
    <br />
    Fork <a target="_blank" rel="noopener noreferrer" href="https://github.com/liatrio/apprentice-outreach-demo-application">liatrio/apprentice-outreach-demo-application</a> on GitHub.
    <br />
    <br />
    Click the button below when done.
    <br />
    <br />
  </div>,
  <div>
    Travis CI is a continous integration service which helps automate building and testing of projects.
    DevOps and continous integration go hand in hand, helping to ease the process of delivering code.
    Travis CI integrates with GitHub, and can be congigured directly from your project.
    <br />
    <br />
    Add the following Travis CI configuration as a new file called <code>.travis.yml</code> to your fork.
    <Segment color='green'>
      <pre>{`language: node_js
node_js:
  - "10"
services:
  - docker
before_install:
  - ./install_compose.sh
script:
  - export REACT_APP_DOMAIN=backend-demo-app
  - docker-compose pull
  - docker-compose build
  - docker-compose start
  - docker ps
  - docker-compose exec frontend sh -c "npm test"`}</pre>
    </Segment>
    Click the button below when done.
    <br />
    <br />
  </div>,
  <div>
    Travis CI will only automatically run on repositories when you tell it to.
    On <a target="_blank" rel="noopener noreferrer" href="https://travis-ci.org/">travis-ci.org</a>, enable your fork of demo-application so that it will build.
    <br />
    <br />
    Trigger a build using the Travis CI web console.
    <br />
    <br />
    Click the button below when done.
    <br />
    <br />
  </div>,
  <div>
    The build failed! Fix the build by examining the cause of failure in the build logs on <a target="_blank" rel="noopener noreferrer" href="https://travis-ci.org/">travis-ci.org</a>.
    <br />
    <br />
    To debug the project, you'll probably want to run your own version. This demo application runs in Docker, which is
    a containerization tool, letting you set up unique enviornments for projects to run inside of. For this debugging you
    can install Docker locally, or use
    <a target="_blank" rel="noopener noreferrer" href="https://labs.play-with-docker.com/">Play with Docker</a>.
    If you use Play with Docker, make sure to also create a Doocker Hub account at
    <br />
    <br />
    This application is a simple demo, with a React frontend and a Django backend, networked with Docker.
    There are several bugs in the application, both in the Docker configuration, and the frontend application, but none in
    the backend application.
    <br />
    <br />
    You can run the application with:
    <Segment color='green'>
      <pre>{`$ git clone https://github.com/YOUR_USERNAME/devops-demo-app
$ cd devops-demo-app
$ docker-compose up`}</pre>
    </Segment>
    By default, the application will run on port 3000 of localhost. Visiting that page might help with debugging.
    Use the results of Travis CI and your own skills to debug the application. Once you've made changes to the project,
    you can push them to GitHub to have Travis CI rebuild the project. It's fine if it takes you multiple tries to find
    all of the bugs.
    <br />
    <br />
    Once you've found all the bugs and your latest build has passed, click the button bellow to continue.
    <br />
    <br />
  </div>,
  <div>
    Now that you've debugged the application you'll be able to use it to get your code. Open up a browser with the
    application running, and input your randomly generated code. If the applicaton has been fully debugged, you'll
    get back your key, showing that you've finished.
    <br />
    <br />
    Random Code:
    <br />
  </div>
];

class Instructions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      url: '',
      invalid: true,
      notUser: false,
      initialKey: '' 
    }

    this.renderForm = this.renderForm.bind(this);
    this.renderUrlForm = this.renderUrlForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUrlSubmit = this.handleUrlSubmit.bind(this);
    this.checkUsername = this.checkUsername.bind(this);
    this.checkUrl = this.checkUrl.bind(this);
    this.renderUpdater = this.renderUpdater.bind(this);
  }

  componentWillUpdate(nextProps, nextState) {
    nextState.invalid = !(nextState.username);
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  checkUsername(u) {
    return fetch('https://api.github.com/users/' + u)
      .then(function(a) {
        return a.json();
      })
      .then(function(b) {
        if (b.message === 'Not Found') {
          return false;
        }
        else {
          return b;
        }
      });
  }

  handleSubmit(event) {
    var that = this;
    that.checkUsername(that.state.username).then(function(valid) {
      if (valid !== false) {
        var url = ec2 + 'user/' + that.state.username
        fetch(url)
        .then(function(response) {
          response.json().then(json => {
            that.state.initialKey = json.secret
            that.props.setkey(json.secret)
          });
        });

        that.props.set(that.state.username);
        that.setState({ notUser: false });
        that.props.updateP();
      }
      else {
        that.setState({  notUser: true });
      }
    });
    event.preventDefault();
  }

  checkUrl(u) {
    var that = this;
    var url = ec2 + 'secret/' + that.props.user + '/' + u 
    return new Promise((resolve, reject) => {
    fetch(url)
    .then(function(response) {
      response.json().then(json => {
        if ((json.correct === true)) {
          resolve(true)
        }
        else {
          resolve(false)
        }
      })
      })
    })
  }
  
  handleUrlSubmit(event) {
  event.preventDefault();
  this.checkUrl(this.state.url).then(response => {
    if(response){
      this.props.done();
      this.setState({ url: '' });
      this.props.updateP();
    }
    else{
      this.setState({ url: '' });
    }
  })
  }

  renderForm() {
    return (
      <Form onSubmit={ this.handleSubmit }>
        <Form.Group widths='equal'>
          <Form.Input
            label='GitHub Username'
            name='username'
            value={ this.state.username }
            onChange={ this.handleChange }
          />
        </Form.Group>
        <Form.Button
          disabled={ this.state.invalid }
          type='submit'
          value='Set GitHub Username'
        >
          Set Username
        </Form.Button>
      </Form>
    );
  }

  renderUrlForm() {
    return (
      <Form onSubmit={ this.handleUrlSubmit }>
        <Form.Group widths='equal'>
          <Form.Input
            label='Secret Word'
            name='url'
            value={ this.state.url }
            onChange={ this.handleChange } 
          />
        </Form.Group>
        <Form.Button
          type='submit'
          value='Secret Word'
        >
          Submit
        </Form.Button>
      </Form>
    );
  }

  renderUpdater() {
    return (
      <Button
        onClick={ this.props.updateP }
        basic
        color='green'
      >
        Complete!
      </Button>
    );
  }

  getActiveIndex() {
    return this.props.activeStep.indexOf(true);
  }

  render() {
    return (
      <Segment>
        { instructionText[ this.getActiveIndex() ] }
	{ this.getActiveIndex() === 5 ?
	  <div>
	  { this.props.mykey }
	  <br /> <br /> </div>: null
	}
        { this.getActiveIndex() === 5 ?
          this.renderUrlForm() : null }
        { this.getActiveIndex() === 0 ?
          this.renderForm() : null }
        { this.state.notUser && (this.getActiveIndex() === 0) ?
          <Segment color='red'>
            Please input a valid username.
          </Segment> : null }
        { ((this.getActiveIndex() !== 0) &&
           (this.getActiveIndex() !== 5)) ?
          this.renderUpdater() : null }
      </Segment>
    );
  }
}

export default Instructions;
