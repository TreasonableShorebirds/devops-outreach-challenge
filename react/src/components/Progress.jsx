import React, { Component } from 'react';
import { Step } from 'semantic-ui-react';

const stepTitles = [
  'Background Information',
  'GitHub Account',
  'Fork demo-application',
  'Add CI Config.',
  'Enable Travis CI',
  'Fix Docker Errors',
  'Fix React Errors',
  'Run demo-application'
];

class Progress extends Component {
  renderSteps() {
    let steps = [];
    stepTitles.forEach((t, i) => {
      steps.push(
        <Step
          key={ t }
          active={ i === this.props.activeStep }
          completed={ i <= this.props.completedStep }
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
