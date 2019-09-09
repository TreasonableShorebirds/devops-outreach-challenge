import React, { Component } from 'react';
import { Segment, Form, Button } from 'semantic-ui-react';


const host = process.env.REACT_APP_IP || 'localhost'
//const nodeUrl = 'http://'+ host + ':3001/'

const nodeUrl = 'https://apprentice-outreach.flywheel-staging.lead.prod.liatr.io/api/'

const instructionText = [
  <div>
    DevOps is a combination of Software Development and Server Operations.
    It's focused on effective solutions to large scale problems.
    Some important DevOps principles are:
    <ul>
      <li>
        Understand the process of software development, and learning where
        improvements in your development process will show the best results.
      </li>
      <li>
        Providing fast feedback, letting developers see as quickly as possible
        the results of their work so they can fix mistakes and see improvements.
      </li>
      <li>
        Understanding the extent of the development process,
        seeing who your work effects and what people rely on you for.
      </li>
    </ul>
    DevOps work involves using automation tools, continuous integration,
    and pipelines, but that isn't all DevOps is about. It's also about
    company culture, sharing knowledge and work so everyone can benefit
    from it, and measuring progress so everyone can understand what is
    succeeding and what is not.

    <br />
    <br />

    Liatrio is a DevOps consulting company, but a rather unique one.
    Rather than focusing only on consulting, or focusing only on engineering
    solutions, Liatrio hires both consultants and engineers to work onsite
    with clients. This helps cover both major elements of DevOps, the tools
    use and engineering solutions, but also the cultural shift and
    understanding of DevOps concepts.

    <br />
    <br />
  </div>,
  <div>
    GitHub is a hosting service for use with the version control system git.
    It's common to use version control systems like git to manage changes to
    your code, and services like GitHub make sharing those changes easy.
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
    GitHub uses a concept of 'forking' when someone wants to make their own
    copy of someone else's project. We've created a demo application to show
    off some automated pipeline tools, and to test your debugging skills.
    Using GitHub, you can take the project we've created, and make your
    own copy where you can fix the bugs.
    <br />
    <br />
    Fork <a target="_blank" rel="noopener noreferrer" href="https://github.com/liatrio/apprentice-outreach-demo-application">liatrio/apprentice-outreach-demo-application</a> on GitHub.
    <br />
    <br />
    Click the button below when you're done.
    <br />
    <br />
  </div>,
  <div>
    Travis CI is a continuous integration service which helps automate building and testing of projects.
    DevOps and continuous integration go hand in hand, helping to ease the process of delivering code.
    Travis CI integrates with GitHub, and can be configured directly from your project.
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
jobs:
 include:
   - stage: docker-env
     script: 
      - docker-compose up -d
      - sleep 20
      - docker ps
      - ./container_test.sh
      - curl localhost:3000
   - stage: npm-test
     script:
      - export REACT_APP_DOMAIN=backend-demo-app
      - docker-compose up -d
      - sleep 20
      - docker-compose exec frontend sh -c "npm test"`}</pre>
    </Segment>
    Click the button below when you're done.
    <br />
    <br />
  </div>,
  <div>
    Travis CI will only automatically run on repositories when you tell it to.
    On <a target="_blank" rel="noopener noreferrer" href="https://travis-ci.org/">travis-ci.org</a>,
    enable your fork of the demo application so that it will build.
    <br />
    <br />
    Trigger a build using the Travis CI web console. If done correctly you should see two jobs building, Docker-env and Npm-test. At this point both of these jobs will fail, however this is expected. The next part of this exercise will focus on fixing the errors in the pipeline.
    <br />
    <br />
    Click the button below when you're done.
    <br />
    <br />
  </div>,
  <div>
    The build failed! Fix the build by examining the cause of failure in the build logs on <a target="_blank" rel="noopener noreferrer" href="https://travis-ci.org/">travis-ci.org</a>.
    <br />
    <br />
    To debug the project, you'll probably want to run your own version. This demo application runs in Docker, which is
    a containerization tool, letting you set up unique environments for projects to run inside of. For this debugging you
    can install Docker locally, or use
    <a target="_blank" rel="noopener noreferrer" href="https://labs.play-with-docker.com/"> Play with Docker</a>.
    If you use Play with Docker, make sure to also create a Docker Hub account at
    <a target="_blank" rel="noopener noreferrer" href="https://hub.docker.com/"> hub.docker.com</a>.
    <br />
    <br />
    This application is a simple demo, with a React frontend and a Django backend, networked using Docker.
    There are several bugs in the application, both in the Docker configuration, and the frontend application, but none in
    the backend application.
    <br />
    <br />
    You can run the application with:
    <Segment color='green'>
      <pre>{`$ git clone https://github.com/YOUR_USERNAME/apprentice-outreach-demo-application
$ cd apprentice-outreach-demo-application
$ docker-compose up`}</pre>
    </Segment>
    After running the above commands, you should notice that there seems to be some problems setting up the Docker environment. In the <a target="_blank" rel="noopener noreferrer" href="https://travis-ci.org/">Travis CI logs</a> you can see that the first build job called Docker-env fails. Examine the output logs carefully either locally or on Travis-CI. Once all the bugs are fixed the Docker-env build job will pass and you should be able to move onto the next step in the exercise! 
    <br />
    <br />
  </div>,
  <div>
    Congratulations, you've fixed the Docker bugs and now have a working environment for the project to run on! However, if you look at the Travis-CI logs, the build still fails because the build job Npm-test still has some problems. Similarly you'll notice that if you try to access the web project at localhost:3000 (Click 80 at the top of the screen if running on <a target="_blank" rel="noopener noreferrer" href="https://labs.play-with-docker.com/"> Play with Docker</a>) you're presented with a blank screen. There appears to be some bugs in the source code.  
   <br /> 
   <br /> 
    In this step of the exercise you'll be debugging the React application. Read the <a target="_blank" rel="noopener noreferrer" href="https://travis-    ci.org/">travis-ci logs</a> to gain some more info on exactly what's going wrong in the React application. Once you've fixed all the errors in the React application, the Npm-test build job on travis-ci will pass.
  <br />
  <br />
    Click the button below when you're done.
  <br />
  <br />
  </div>,
  <div>
    Now that you've debugged the application you'll be able to use it to get your secret key. Open up a browser with the
    application running, and input your randomly generated code. If the application has been fully debugged, you'll
    get back a corresponding key, proving that you've finished.
    <br />
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
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeySubmit = this.handleKeySubmit.bind(this);
    this.checkUsername = this.checkUsername.bind(this);
    this.checkKey = this.checkKey.bind(this);
    this.renderUpdater = this.renderUpdater.bind(this);
  }

  componentWillUpdate(nextProps, nextState) {
    nextState.invalid = !(nextState.username);
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  async checkUsername(u) {
    console.log('CheckUsername begin');
    const response = await fetch('https://api.github.com/users/' + u);
    console.log('User data retrieved');
    const data = await response.json();
    console.log('Data to json done');
    return data.message === 'Not Found' ? false : data;
  }

  async handleSubmit(event) {
    event.preventDefault();
    let valid;
    try {
      valid = await this.checkUsername(this.state.username);
    } catch (e) {
      console.log(e);
    }
    if(valid) {
      let data;
      const url = nodeUrl + 'user/' + this.state.username;
      try {
        const response =  await fetch(url);
        data = await response.json();
        console.log('Data Retreived');
      } catch (e) {
        console.log('Failed to Retrieve Data');
        console.log(e);
      }
      this.props.setkey(data.secret);
      this.props.set(this.state.username);
      this.setState({ notUser: false });
      this.props.updateP();
    } else {
      this.setState({ notUser: true });
    }
  }

  async checkKey(u) {
    const url = nodeUrl + 'secret/' + this.props.user + '/' + u;
    const response = await fetch(url);
    const data = await response.json();
    return data.correct;
  }

  async handleKeySubmit(event) {
    event.preventDefault();
    const validKey = await this.checkKey(this.state.url);
    if(validKey) {
      this.props.done();
      this.setState({ url: '' });
      this.props.updateP();
    } else {
      this.setState({ url: '' });
    }
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

  renderKeyForm() {
    return (
      <div>
      <div>
        Your Code:
        <br />
        <strong> { this.props.mykey } </strong>
        <br />
        <br />
      </div>
      <Form onSubmit={ this.handleKeySubmit }>
        <Form.Group widths='equal'>
          <Form.Input
            label='Secret Key'
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
      </div>
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
    return this.props.activeStep;
  }

  renderReading() {
    return (
      <Button
        onClick={ this.props.completedRead }
        basic
        color='green'
      >
        Complete Reading!
      </Button>
    );
  }
  render() {
    return (
      <Segment>
        { instructionText[ this.getActiveIndex() - 1 ] }
        { this.getActiveIndex() === 8 ?
          this.renderKeyForm() : null }
        { this.getActiveIndex() === 2 ?
          this.renderForm() : null }
        { this.getActiveIndex() === 1 ?
          this.renderReading() : null }
        { this.state.notUser && (this.getActiveIndex() === 1) ?
          <Segment color='red'>
            Please input a valid username.
          </Segment> : null }
           { (this.getActiveIndex() !== 1) &&
           (this.getActiveIndex() !== 8) &&
           (this.getActiveIndex() !== 2) ?
          this.renderUpdater() : null }
      </Segment>
    );
  }
}

export default Instructions;
