import React, { Component } from 'react';    
import logo from '../logo.png';    
import { Menu, Icon, Container, Image, Dropdown } from 'semantic-ui-react';
    
class MainMenu extends Component {    
  render() {    
    return (    
      <Menu fixed='top' inverted>    
        <Container>    
          <Menu.Item    
            header    
            as='a'
            href='/'
          >    
            <Image    
              size='mini'    
              src={logo}    
              style={{ marginRight: '1.5em' }}    
            />    
            DevOps Challenge
          </Menu.Item>    
          <Dropdown item simple text='Help'>    
            <Dropdown.Menu>    
              <Dropdown.Item
                as='a'
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/join">
                Sign Up for GitHub
              </Dropdown.Item>    
              <Dropdown.Item
                as='a'
                target="_blank"
                rel="noopener noreferrer"
                href="https://help.github.com/articles/fork-a-repo/#fork-an-example-repository">
                How to Fork a Repository on GitHub
              </Dropdown.Item>    
              <Dropdown.Item
                as='a'
                target="_blank"
                rel="noopener noreferrer"
                href="https://help.github.com/articles/adding-a-file-to-a-repository/">
                How to Add a File to a Repository on GitHub
              </Dropdown.Item>    
              <Dropdown.Item
                as='a'
                target="_blank"
                rel="noopener noreferrer"
                href="https://blog.travis-ci.com/2017-08-24-trigger-custom-build">
                How to Trigger a Build using the Travis CI Web Console
              </Dropdown.Item>
              <Dropdown.Item
                as='a'
                target="_blank"
                rel="noopener noreferrer"
                href="https://docs.travis-ci.com/user/getting-started/">
                Getting Started with Travis CI
              </Dropdown.Item>    
              <Dropdown.Item
                as='a'
                target="_blank"
                rel="noopener noreferrer"
                href="https://help.github.com/articles/editing-files-in-your-repository/">
                How to Edit a File in a Repository on GitHub
              </Dropdown.Item>    
              <Dropdown.Item
                as='a'
                onClick={ this.props.clear }
              >
                Reset Progress Tracking
              </Dropdown.Item>
            </Dropdown.Menu>    
          </Dropdown>
          { this.props.user ?
            <Menu.Item    
              header    
              as='a'
              target="_blank"
              rel="noopener noreferrer"
              href={ 'https://github.com/' + this.props.user }
            >
              <Icon name='github' />
              {this.props.user}
            </Menu.Item> : null }
        </Container>    
      </Menu>    
    );    
  }    
}    
    
export default MainMenu;  
