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
    if (window.localStorage) {
      localUser = JSON.parse(localStorage.getItem('USER'));
      localKey = JSON.parse(localStorage.getItem('KEY'));
      localDone = JSON.parse(localStorage.getItem('DONE'));
    }
    this.state = {
      user: localUser || '',
      key: localKey || '',
      done: localDone || '',
      active: [ true, false, false, false, false, false ],
      completed: [ false, false, false, false, false, false ]
    };
    this.updateProgress = this.updateProgress.bind(this);
    this.updateCompletion = this.updateCompletion.bind(this);
    this.updateActive = this.updateActive.bind(this);
    this.hasForked = this.hasForked.bind(this);
    this.hasAddedTravis = this.hasAddedTravis.bind(this);
    this.hasEnabledTravis = this.hasEnabledTravis.bind(this);
    this.hasFixedBuild = this.hasFixedBuild.bind(this);
    this.nextStep = this.nextStep.bind(this);
    this.prevStep = this.prevStep.bind(this);
    this.setRemainingToFalse = this.setRemainingToFalse.bind(this);
    this.setUser = this.setUser.bind(this);
    this.clearUser = this.clearUser.bind(this);
    this.completedAll = this.completedAll.bind(this);
    this.completeAll = this.completeAll.bind(this);
    this.setKey = this.setKey.bind(this);
    this.saveKey = this.saveKey.bind(this);
  }

  completeAll() {
    this.setState({ done: 'yes' });
    localStorage.setItem('DONE', JSON.stringify('yes'));
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
    this.setState({ user: '', done: '' });
    localStorage.removeItem('USER');
    localStorage.removeItem('DONE');
    this.setRemainingToFalse(0);
    this.updateActive(this.state.completed.indexOf(false));
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
    const currentStep = this.state.active.indexOf(true);
    if (currentStep > 0) {
      let newActive = [ false, false, false, false, false, false ];
      newActive[currentStep - 1] = true;
      this.setState({ active: newActive });
    }
  }

  componentDidMount() {
    this.updateProgress();
  }

  nextStep() {
    const currentStep = this.state.active.indexOf(true);
    if (currentStep < 5) { // length of active
      let newActive = [ false, false, false, false, false, false ];
      newActive[currentStep + 1] = true;
      this.setState({ active: newActive });
    }
  }

  hasEnabledTravis(u) {
    const url =
      'https://api.travis-ci.org/repo/' + u +
      '%2Fdevops-demo-app/builds?limit=5';
    return fetch(url, { headers: { 'Travis-API-Version': '3' } })
      .then(function(a) {
        return a.json();
      })
      .then(function(b) {
        if ( b.builds && b.builds.length > 0) {
          return true;
        }
        else {
          return false;
        }
      });
  }

  hasFixedBuild(u) {
    const url =
      'https://api.travis-ci.org/repo/' + u +
      '%2Fdevops-demo-app/builds?limit=5';
    return fetch(url, { headers: { 'Travis-API-Version': '3' } })
      .then(function(a) {
        return a.json();
      })
      .then(function(b) {
        if(b.builds[0].state === 'passed') {
          return true;
        }
        else {
          return false;
        }
      });

  }

  hasAddedTravis(u) {
    const url =
      'https://api.github.com/repos/'+u+'/devops-demo-app/contents/'
    return fetch(url)
      .then(function(a) {
        return a.json();
      })
      .then(function(b) {
        for (var key in b) {
          if (b[key].name === '.travis.yml') {
            return true;
          }
        }
        return false;
      });
  }

  hasForked(u) {
    const url =
      'https://api.github.com/repos/TreasonableShorebirds/devops-demo-app/forks';
    return fetch(url)
      .then(function(a) {
        return a.json();
      })
      .then(function(b) {
        for (var key in b) {
          if (b[key].owner.login === u) {
            return true;
          }
        }
        return false;
      });
  }

  updateCompletion(index, value) {
    let newCompleted = this.state.completed;
    newCompleted[index] = value;
    this.setState({ completed: newCompleted });
  }

  updateActive(index) {
    let newActive = [ false, false, false, false, false, false ];
    newActive[index] = true;
    this.setState({ active: newActive });
  }

  setRemainingToFalse(start) {
    for (var i = start; i < this.state.completed.length; i++) {
      this.updateCompletion(i, false);
    }
  }

  completedAll() {
    for (var i = 0; i < this.state.completed.length; i++) {
      if ( this.state.completed[i] === false ) {
        return false;
      }
    }
    return true;
  }

  updateProgress() {
    if (this.state.user !== '') {
      this.updateCompletion(0, true);
      var that = this;
      this.hasForked(this.state.user)
        .then(function(forked) {
          if (forked === true) {
            that.updateCompletion(1, true);
            that.hasAddedTravis(that.state.user)
              .then(function(addedTravis) {
                if (addedTravis === true) {
                  that.updateCompletion(2, true);
                  that.hasEnabledTravis(that.state.user)
                    .then(function(enabledTravis) {
                      if (enabledTravis === true) {
                        that.updateCompletion(3, true);
                        that.hasFixedBuild(that.state.user)
                          .then(function(fixedBuild) {
                            if (fixedBuild === true) {
                              that.updateCompletion(4, true);
                              if (that.state.done === 'yes') {
                                that.updateCompletion(5, true);
                                that.updateActive(that.state.completed.indexOf(false));
                              }
                              else {
                                that.setRemainingToFalse(5);
                                that.updateActive(that.state.completed.indexOf(false));
                              }
                            }
                            else {
                              that.setRemainingToFalse(4);
                              that.updateActive(that.state.completed.indexOf(false));
                            }
                          });
                      }
                      else {
                        that.setRemainingToFalse(3);
                        that.updateActive(that.state.completed.indexOf(false));
                      }
                    });
                } else {
                  that.setRemainingToFalse(2);
                  that.updateActive(that.state.completed.indexOf(false));
                }
              });
          } else {
            that.setRemainingToFalse(1);
            that.updateActive(that.state.completed.indexOf(false));
          }
        });
    } else {
      this.setRemainingToFalse(0);
      this.updateActive(this.state.completed.indexOf(false));
    }
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
                    Congratulations, you have completed the DevOps Challenge!
                  </Segment> :
                  <Instructions
                    activeStep={ this.state.active }
                    set={ this.setUser }
                    setkey ={ this.setKey }
                    updateP={ this.updateProgress }
                    done={ this.completeAll }
                    user={ this.state.user }
                    key={ this.state.key }
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
