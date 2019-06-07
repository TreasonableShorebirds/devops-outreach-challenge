import React, { Component } from 'react';
import { Segment, Form, Button } from 'semantic-ui-react';
import md5 from 'md5';


const instructionText = [
  <div>
    Create a <a target="_blank" rel="noopener noreferrer" href="https://github.com/join">GitHub</a> account if you don't already have one.
    <br />
    <br />
    Enter your username in the field below to start tracking your progress.
    <br />
    <br />
  </div>,
  <div>
    Fork <a target="_blank" rel="noopener noreferrer" href="https://github.com/TreasonableShorebirds/devops-demo-app#fork-destination-box">TreasonableShorebirds/devops-demo-app</a> on GitHub.
    <br />
    <br />
    Click the button below when done.
    <br />
    <br />
  </div>,
  <div>
    Add the following Travis CI configuration as a new file called <code>.travis.yml</code> to your fork.
    <Segment color='green'>
      <code>
				sudo: required<br />
				services:<br />
				- docker<br />
				script:<br />
					- docker-compose build <br />
      </code>
    </Segment>
    Click the button below when done.
    <br />
    <br />
  </div>,
  <div>
    On <a target="_blank" rel="noopener noreferrer" href="https://travis-ci.org/">travis-ci.org</a>, enable your fork of microservices-demo so that it will build.
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
    Click the button below after the latest build has passed.
    <br />
    <br />
  </div>,
  <div>
    Log in to <a target="_blank" rel="noopener noreferrer" href="https://labs.play-with-docker.com/">Play with Docker</a>.
    <br />
    <br />
    You will need a Docker Hub account to use Play with Docker. You can create an account at <a target="_blank" rel="noopener noreferrer" href="https://hub.docker.com/">hub.docker.com</a>.
    <br />
    <br />
    Once you are logged in on Play with Docker, hit the start button. On the left, select Add New Instance. This will create a Docker playground for you to run commands in.
    <br />
    <br />
    Run devops-demo-app!
    <br />
    <Segment color='green'>
      <code>
		  $ git clone https://github.com/YOUR_USERNAME/devops-demo-app <br />
		  $ cd devops-demo-app<br />
		  $ docker-compose up
      </code>
    </Segment>
    After the app has finishing deploying, you should be able to click a blue port 80 link to see it running.
    <br />
    <br />
       Enter this string into the demo app to get the code: 
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

//    this.state.initialKey =  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

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
        var url = 'http://ec2-54-212-245-230.us-west-2.compute.amazonaws.com:3001/user/' + that.state.username
        fetch(url)
        /*
        .then(function(response) {
          response.json().then(json => {
            this.state.initialKey = json.secret
            that.props.set(that.state.username);

            that.props.set(that.state.initialKey);
            that.setState({ initialKey: json.secret });
            that.props.updateP();
          });
        });
        */
        that.props.set(that.state.username);
        that.setState({ username: '', notUser: false });
        that.props.updateP();
      }
      else {
        that.setState({ username: '', notUser: true });
      }
    });
    event.preventDefault();
  }

  checkUrl(u) {
    let ans = this.state.initialKey;
    ans = ans.split('').reverse().join('');
    for(let i = 0; i < 5; i++)
    {
      ans = md5(ans);
    }
    if ((u === ans)) {
      return true;
    }
    else {
      return false;
    }
  }

  handleUrlSubmit(event) {
    if (this.checkUrl(this.state.url)) {
      this.props.done();
      this.setState({ url: '' });
      this.props.updateP();
    }
    else {
      this.setState({ url: '' });
    }
    event.preventDefault();
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
	  {this.state.initialKey}
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
