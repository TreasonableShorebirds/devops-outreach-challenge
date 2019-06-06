import React, { Component } from 'react';
import { Step } from 'semantic-ui-react';

const stepTitles = [
  'GitHub Account',
  'Fork devops-demo-app',
  'Add CI Config.',
  'Enable Travis CI',
  'Correct Build Error',
  'Run devops-demo-app'
];

class Progress extends Component {
  renderSteps() {
    let steps = [];
    stepTitles.forEach((t, i) => {
      steps.push(
        <Step
          key={ t }
          active={ this.props.activeStep[i] }
          completed={ this.props.completedStep[i] }
        >
          <Step.Content>
            <Step.Title>{ t }</Step.Title>
          </Step.Content>
        </Step>
      );
    });
    return steps;
  }

  render() {
    return (
      <Step.Group ordered fluid vertical size='mini'>
      { this.renderSteps() }
      </Step.Group>
    );
  }
}

export default Progress;
