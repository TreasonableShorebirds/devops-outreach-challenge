import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';

class Buttons extends Component {
  render() {
    return (
      <Button.Group fluid>
        <Button
          compact
          icon='left arrow'
          onClick={ this.props.prevS }
        />
        <Button
          compact
          icon='refresh'
          onClick={ this.props.updateP }
        />
        <Button
          compact
          icon='right arrow'
          onClick={ this.props.nextS }
        />
      </Button.Group>
    );
  }
}

export default Buttons;
