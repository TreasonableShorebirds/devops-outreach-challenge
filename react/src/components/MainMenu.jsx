import React, { Component } from "react";
import logo from "../logo.png";
import { Menu, Icon, Container, Image, Dropdown, Modal, Button} from "semantic-ui-react";
import Leaderboard from "./Leaderboard"

class MainMenu extends Component {
  state = { activeItem: "home", open: false };

  show = () => () => this.setState({ open: true })
  close = () => this.setState({ open: false })

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


          <Menu.Item onClick={this.show('large')}>Leaderboard</Menu.Item>
          <Modal size='large' open={this.state.open} onClose={this.close}>
            <Modal.Header>Leaderboard</Modal.Header>
            <Modal.Content>
              <Leaderboard/>
            </Modal.Content>
          </Modal>


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
                href="https://github.com/join"
              >
                Sign Up for GitHub
              </Dropdown.Item>
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
            </Dropdown.Menu>
          </Dropdown>
          <Menu.Item
            as="a"
            href="/"
            name="Reset Progress"
            onClick={this.props.clear}
          />
          <Menu.Item as="a" href="https://www.liatrio.com/" position="right">
            <Image size="mini" src={logo} style={{ marginLeft: "1.5em" }} />
            <Dropdown
              header
              item
              simple
              text="Liatrio"
              href="https://www.liatrio.com/"
              direction="left"
            >
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
