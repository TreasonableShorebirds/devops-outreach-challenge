import React, { Component } from "react";
import "semantic-ui-css/semantic.min.css";
import { Table} from "semantic-ui-react";

const nodeUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/'

class Leaderboard extends Component {
  constructor() {
    super();
    this.state = {
      users: []
    };
  }
  componentDidMount() {
    this.updateLeaderboard();
  }

  async updateLeaderboard() {
    const url = nodeUrl + 'leaderboard';
    var response = await fetch(url);
    this.state.users = await response.json();
    console.log(this.state.users[0].githubUsername);
    console.log(this.state.users[0].stage);
    this.forceUpdate();
  }

  render() {
    return (
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Score</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {this.state.users.map((user) => {
            return (
              <Table.Row key={user.githubUsername}>
                <Table.Cell>{user.githubUsername}</Table.Cell>
                <Table.Cell>{user.stage}</Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    );
  }
}

export default Leaderboard;
