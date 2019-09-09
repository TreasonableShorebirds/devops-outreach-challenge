checkUsername = this.checkUsername.bind(this);
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
    const response = await fetch('https://api.github.com/users/' + u);
    const data = await response.json();
    return data.message === 'Not Found' ? false : data;
  }

  async handleSubmit(event) {
    event.preventDefault();
    try {
      const valid = await this.checkUsername(this.state.username);
    } catch (e) {
      console.log(e);
    }
    if(valid) {
      const url = nodeUrl + 'user/' + this.state.username;
      try {
        const response =  await fetch(url);
        const data = await response.json();
      } catch (e) {
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
