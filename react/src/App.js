import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import ConfettiCanvas from 'react-confetti-canvas';
import { Container, Grid, Segment } from 'semantic-ui-react';
import MainMenu from './components/MainMenu';
import Progress from './components/Progress';
import Buttons from './components/Buttons';
import Instructions from './components/Instructions';
import Footer from './components/Footer';
import './App.css';

class App extends Component {
  constructor() {
    super();
    let localUser;
    let localDone;
    let localKey;
    let localReading;
    if (window.localStorage) {
      localUser = JSON.parse(localStorage.getItem('USER'));
      localKey = JSON.parse(localStorage.getItem('KEY'));
      localDone = JSON.parse(localStorage.getItem('DONE'));
      localReading = JSON.parse(localStorage.getItem('READING'));
    }
    this.state = {
      user: localUser || '',
      key: localKey || '',
      done: localDone || '',
      doneReading: localReading || '',
      active: 0, // The currently displayed step
      completed: -1 // The highest step completed
    };

    //this.hasFixedDocker = this.hasFixedDocker.bind(this);
    this.updateProgress = this.updateProgress.bind(this);
    this.updateCompletion = this.updateCompletion.bind(this);
    this.updateActive = this.updateActive.bind(this);
    this.hasForked = this.hasForked.bind(this);
    this.hasAddedTravis = this.hasAddedTravis.bind(this);
    this.hasEnabledTravis = this.hasEnabledTravis.bind(this);
    this.hasFixedBuild = this.hasFixedBuild.bind(this);
    this.nextStep = this.nextStep.bind(this);
    this.prevStep = this.prevStep.bind(this);
    this.setUser = this.setUser.bind(this);
    this.clearUser = this.clearUser.bind(this);
    this.completedAll = this.completedAll.bind(this);
    this.completeAll = this.completeAll.bind(this);
    this.setKey = this.setKey.bind(this);
    this.saveKey = this.saveKey.bind(this);
    this.completedReading = this.completedReading.bind(this);
  }

  completeAll() {
    this.setState({ done: 'yes' });
    localStorage.setItem('DONE', JSON.stringify('yes'));
  }

  completedReading() {
    console.log('test');
    this.setState({ doneReading: 'yes' });
    localStorage.setItem('READING', JSON.stringify('yes'));
    this.updateProgress();
  }

  setUser(u) {
    this.setState({ user: u });
    this.save(u);
  }

  setKey(k) {
    this.setState({ key: k });
    this.saveKey(k);
  }

  clearUser() {
    this.setState({ user: '', done: '', key: '' });
    localStorage.removeItem('USER');
    localStorage.removeItem('DONE');
    localStorage.removeItem('KEY');
    localStorage.removeItem('READING');
    this.updateCompletion(-1);
    this.updateActive(0);
  }

  save(u) {
    if (!u) return;
    localStorage.setItem('USER', JSON.stringify(u));
  }

  saveKey(k) {
    if (!k) return;
    localStorage.setItem('KEY', JSON.stringify(k));
  }

  prevStep() {
    const currentStep = this.state.active;
    if (currentStep > 0) {
      this.setState({ active: currentStep - 1 });
    }
  }

  componentDidMount() {
    this.updateProgress();
  }

  nextStep() {
    const currentStep = this.state.active;
    if (currentStep < 7) { // length of active
      this.setState({ active: currentStep + 1 });
    }
  }

  async hasEnabledTravis(u) {
    const url =
      'https://api.travis-ci.org/repo/' + u +
      '%2Fapprentice-outreach-demo-application/builds?limit=5';
    const response = await fetch(url, { headers: { 'Travis-API-Version': '3' } });
    const data = await response.json();
    return (data.builds && data.builds.length > 0);
  }

  async hasFixedDocker(u) {
    const url =
      'https://api.travis-ci.org/repo/' + u +
      '%2Fapprentice-outreach-demo-application/builds?limit=5';
    const response = await fetch(url, { headers: { 'Travis-API-Version': '3' } });
    const data = await response.json();
    console.log(data.builds[0]);
    if(data.builds[0].stages[1].name !== "Docker-env") {
      alert("Travis API Change function hasFixedDocker()");
    }
    return data.builds[0].stages[1].state === 'passed';

  }
  async hasFixedBuild(u) {
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

  async hasAddedTravis(u) {
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

  async hasForked(u) {
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

  updateCompletion(index) {
    index = index > 7 ? 7 : index < -1 ? -1 : index;
    this.setState({ completed: index });
  }

  updateActive(index) {
    index = index > 7 ? 7 : index < 0 ? 0 : index;
    this.setState({ active: index });
  }

  completedAll() {
    return this.state.completed === 7;
  }

  async getNewCompletion() {
    switch(this.state.completed) {
      case -1:
        if(!this.state.doneReading) {
          return -1;
        }
        /* Fallthrough */
      case 0:
        if(this.state.user === '' ) {
          return 0;
        }
        /* Fallthrough */
      case 1:
        const forked = await this.hasForked(this.state.user);
        if(!forked) {
          return 1;
        }
        /* Fallthrough */
      case 2:
        const hasTravis = await this.hasAddedTravis(this.state.user);
        if(!hasTravis) {
          return 2;
        }
        /* Fallthrough */
      case 3:
        const enabledTravis = await this.hasEnabledTravis(this.state.user);
        if(!enabledTravis) {
          return 3;
        }
        /* Fallthrough */
      case 4:
        const fixedDocker = await this.hasFixedDocker(this.state.user);
        if(!fixedDocker) {
          return 4;
        }
        /* Fallthrough */
      case 5:
        const fixedBuild = await this.hasFixedBuild(this.state.user);
        if(!fixedBuild) {
          return 5;
        }
        /* Fallthrough */
      case 6:
        if(!this.state.done)
        {
          return 6;
        }
        /* Fallthrough */
      default:
        return 7;
    }
  }

  async updateProgress() {

    const newProgress = await this.getNewCompletion();
    this.updateCompletion(newProgress);
    this.updateActive(newProgress + 1);
  }

  render() {
    return (
      <div>
        { this.completedAll() ?
          <div className="confetti">
            <ConfettiCanvas />
          </div> : null }
        <MainMenu clear={ this.clearUser } user={ this.state.user }/>
        <Container style={{ marginTop: '7em' }}>
          <Grid>
            <Grid.Row className='back'>
              <Grid.Column width={5}>
                <Progress
                  activeStep={ this.state.active }
                  completedStep={ this.state.completed }
                />
                <Buttons
                  prevS={ this.prevStep }
                  nextS={ this.nextStep }
                  updateP={ this.updateProgress }
                />
              </Grid.Column>
              <Grid.Column width={11}>
                { this.completedAll() ?
                  <Segment color='green'>
                    Congratulations, you have completed the DevOps Challenge! <br />
                    <a target="_blank" rel="noopener noreferrer" href="http://tinyurl.com/liatrio">Link to form</a>
                  </Segment> :
                  <Instructions
                    activeStep={ this.state.active }
                    set={ this.setUser }
                    setkey ={ this.setKey }
                    updateP={ this.updateProgress }
                    done={ this.completeAll }
                    user={ this.state.user }
                    mykey ={ this.state.key }
                    completedRead = {this.completedReading}
                  /> }
              </Grid.Column>
            </Grid.Row>
            <Grid.Row centered>
              <Footer />
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    );
  }
}

export default App;
