import React, { Component } from "react";
import "semantic-ui-css/semantic.min.css";
import { Table} from "semantic-ui-react";

class Leaderboard extends Component {
  render() {
    return (
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Place</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Score</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
            <Table.Cell>1</Table.Cell>
            <Table.Cell>Jacob</Table.Cell>
            <Table.Cell>1000000</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>2</Table.Cell>
            <Table.Cell>Rj</Table.Cell>
            <Table.Cell>10</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>3</Table.Cell>
            <Table.Cell>Daniel</Table.Cell>
            <Table.Cell>2</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>4</Table.Cell>
            <Table.Cell>Daniel</Table.Cell>
            <Table.Cell>2</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>5</Table.Cell>
            <Table.Cell>Danielhasareallylonngnamenowhtatihaveaddedthistexttoit haha</Table.Cell>
            <Table.Cell>2</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
  }
}

export default Leaderboard;
