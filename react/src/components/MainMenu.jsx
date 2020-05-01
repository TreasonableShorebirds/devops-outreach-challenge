import React, { Component } from "react";
import logo from "../logo.png";
import {
  Menu,
  Icon,
  Container,
  Image,
  Dropdown,
  Segment,
  TransitionablePortal,
} from "semantic-ui-react";
import Leaderboard from "./Leaderboard";

class MainMenu extends Component {
  state = { activeItem: "home", open: false };

  handleOpen = () => this.setState({ open: true });

  handleClose = () => this.setState({ open: false });
  render() {
    return (
      <Menu fixed="top" inverted>
        <Container>
          <Menu.Item header as="a" href="/" float="left">
            <Image
              size="mini"
              src="https://assets.website-files.com/5c0ef0d637368ba8badd3577/5d38ec257a00daabc1da3514_Project-Product-icon-hex.svg"
              style={{ marginRight: "1.5em" }}
            />
            DevOps Challenge
          </Menu.Item>
          <TransitionablePortal
            closeOnTriggerClick
            onOpen={this.handleOpen}
            onClose={this.handleClose}
            openOnTriggerClick
            trigger={
              <Menu.Item
                content={this.state.open ? "Close Leaderboard" : "Leaderboard"}
                negative={this.state.open}
                positive={!this.state.open}
              />
            }
          >
            <Segment
              style={{
                left: "40%",
                position: "fixed",
                top: "10%",
                zIndex: 1000,
              }}
              size="massive"
            >
              <Leaderboard />
            </Segment>
          </TransitionablePortal>
          {this.props.user ? (
            <Menu.Item
              header
              as="a"
              target="_blank"
              rel="noopener noreferrer"
              href={"https://github.com/" + this.props.user}
            >
              <Icon name="github" />
              {this.props.user}
            </Menu.Item>
          ) : null}
          <Dropdown item simple text="Help">
            <Dropdown.Menu>
              <Dropdown.Item
                as="a"
                target="_blank"
                rel="noopener noreferrer"
                href="https://help.github.com/articles/fork-a-repo/#fork-an-example-repository"
              >
                How to Fork a Repository on GitHub
              </Dropdown.Item>
              <Dropdown.Item
                as="a"
                target="_blank"
                rel="noopener noreferrer"
                href="https://help.github.com/articles/adding-a-file-to-a-repository/"
              >
                How to Add a File to a Repository on GitHub
              </Dropdown.Item>
              <Dropdown.Item
                as="a"
                target="_blank"
                rel="noopener noreferrer"
                href="https://blog.travis-ci.com/2017-08-24-trigger-custom-build"
              >
                How to Trigger a Build using the Travis CI Web Console
              </Dropdown.Item>
              <Dropdown.Item
                as="a"
                target="_blank"
                rel="noopener noreferrer"
                href="https://docs.travis-ci.com/user/getting-started/"
                name="Getting Started with Travis CI"
              >
                Getting Started with Travis CI
              </Dropdown.Item>
              <Dropdown.Item
                as="a"
                target="_blank"
                rel="noopener noreferrer"
                href="https://help.github.com/articles/editing-files-in-your-repository/"
              >
                How to Edit a File in a Repository on GitHub
              </Dropdown.Item>
              <Dropdown.Item
                as="a"
                target="_blank"
                rel="noopener noreferrer"
                href="https://docs.docker.com/get-started/"
              >
                Getting Started with Docker
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Menu.Item
            as="a"
            href="/"
            name="Reset Progress"
            onClick={this.props.clear}
          />
          <Menu.Item as="div" position="right" href="https://www.liatrio.com/">
            <Image
              size="mini"
              href="https://www.liatrio.com/"
              src={logo}
              style={{ marginLeft: "1.5em" }}
            />
            <Dropdown item simple text="About Liatrio" direction="left">
              <Dropdown.Menu>
                <Dropdown.Item
                  as="a"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.liatrio.com/"
                >
                  Liatrio
                </Dropdown.Item>
                <Dropdown.Item
                  as="a"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.liatrio.com/blog"
                >
                  Liatrio Blog
                </Dropdown.Item>
                <Dropdown.Item
                  as="a"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.liatrio.com/blog/liatrio-apprenticeship-evolve-past-traditional-it-internships"
                >
                  Liatrio Apprenticeship more than an Internship
                </Dropdown.Item>
                <Dropdown.Item
                  as="a"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.liatrio.com/blog/github-devops-bootcamp"
                >
                  Liatrio Apprentice Bootcamp
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
        </Container>
      </Menu>
    );
  }
}

export default MainMenu;
