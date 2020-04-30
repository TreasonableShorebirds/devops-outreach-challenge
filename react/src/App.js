import React, { Component } from "react";
import "semantic-ui-css/semantic.min.css";
import ConfettiCanvas from "react-confetti-canvas";
import { Container, Grid, Segment } from "semantic-ui-react";
import MainMenu from "./components/MainMenu";
import Progress from "./components/Progress";
import Buttons from "./components/Buttons";
import Instructions from "./components/Instructions";
import Footer from "./components/Footer";
import "./App.css";

const numberOfSteps = 8;
const nodeUrl = process.env.API_URL || 'http://localhost:3001/api/'

class App extends Component {
  constructor() {
    super();
    let localUser;
    let localDone;
    let localKey;
    let localReading;
    let localCompleted;
    if (window.localStorage) {
      localUser = JSON.parse(localStorage.getItem("USER"));
      localKey = JSON.parse(localStorage.getItem("KEY"));
      localDone = JSON.parse(localStorage.getItem("DONE"));
      localReading = JSON.parse(localStorage.getItem("READING"));
      localCompleted = JSON.parse(localStorage.getItem("COMPLETED"));
    }
    this.state = {
      user: localUser || '',
      key: localKey || '',
      done: localDone || 'no',
      doneReading: localReading || '',
      completed: localCompleted || 0, // The number of steps completed
      active: (localCompleted || 0) + 1, // The currently displayed step
    };

    this.updateProgress = this.updateProgress.bind(this);
    this.nextStep = this.nextStep.bind(this);
    this.prevStep = this.prevStep.bind(this);
    this.setUser = this.setUser.bind(this);
    this.clearUser = this.clearUser.bind(this);
    this.completeAll = this.completeAll.bind(this);
    this.setKey = this.setKey.bind(this);
    this.completedReading = this.completedReading.bind(this);
  }

  completeAll() {
    this.setState({ done: "yes" });
    localStorage.setItem("DONE", JSON.stringify("yes"));
  }

  completedReading() {
    console.log("test");
    this.setState({ doneReading: "yes" });
    localStorage.setItem("READING", JSON.stringify("yes"));
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
    this.setState({ user: '', done: 'no', key: '' });
    localStorage.removeItem('USER');
    localStorage.removeItem('DONE');
    localStorage.removeItem('KEY');
    localStorage.removeItem('READING');
    localStorage.removeItem('COMPLETED');
    this.updateCompletion(0);
    this.updateActive(1);
  }

  save(u) {
    if (!u) return;
    localStorage.setItem("USER", JSON.stringify(u));
  }

  saveKey(k) {
    if (!k) return;
    localStorage.setItem("KEY", JSON.stringify(k));
  }

  prevStep() {
    const currentStep = this.state.active;
    if (currentStep > 1) {
      this.setState({ active: currentStep - 1 });
    }
  }

  componentDidMount() {
    this.updateProgress();
  }

  nextStep() {
    const currentStep = this.state.active;
    console.log(numberOfSteps);
    if (currentStep < numberOfSteps) {
      // length of active
      this.setState({ active: currentStep + 1 });
    }
  }

  updateCompletion(index) {
    if (index > numberOfSteps) {
      index = numberOfSteps;
    } else if (index < 0) {
      index = 0;
    }
    this.setState({ completed: index });
    localStorage.setItem("COMPLETED", JSON.stringify(index));
  }

  updateActive(index) {
    if (index > numberOfSteps) {
      index = numberOfSteps;
    } else if (index < 1) {
      index = 1;
    }
    this.setState({ active: index });
  }

  completedAll() {
    return this.state.completed === numberOfSteps;
  }

  async updateProgress() {
    var newProgress;
    if (this.state.user === '') {
      if (!this.state.doneReading) {
        newProgress = 0;
      } else {
        newProgress = 1;
      }
    } else {
      const url = nodeUrl + 'stage/' + this.state.user + '/' + this.state.done;
      var response = await fetch(url);
      var data = await response.json();
      newProgress = data.stage;
    }

    this.updateCompletion(newProgress);
    this.updateActive(newProgress + 1);
  }

  render() {
    return (
      <div>
        {this.completedAll() ? (
          <div className="confetti">
            <ConfettiCanvas />
          </div>
        ) : null}
        <MainMenu clear={this.clearUser} user={this.state.user} />
        <Container style={{ marginTop: "7em" }}>
          <Grid>
            <Grid.Row className="back">
              <Grid.Column width={5}>
                <Progress
                  activeStep={this.state.active}
                  completedStep={this.state.completed}
                />
                <Buttons
                  prevS={this.prevStep}
                  nextS={this.nextStep}
                  updateP={this.updateProgress}
                />
              </Grid.Column>
              <Grid.Column width={11}>
                {this.completedAll() ? (
                  <Segment color="green">
                    Congratulations, you have completed the DevOps Challenge!{" "}
                    <br />
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="http://tinyurl.com/liatrio"
                    >
                      Link to form
                    </a>
                  </Segment>
                ) : (
                  <Instructions
                    activeStep={this.state.active}
                    set={this.setUser}
                    setkey={this.setKey}
                    updateP={this.updateProgress}
                    done={this.completeAll}
                    user={this.state.user}
                    mykey={this.state.key}
                    completedRead={this.completedReading}
                  />
                )}
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
