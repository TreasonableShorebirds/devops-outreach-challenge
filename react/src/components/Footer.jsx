import React, { Component } from "react";
import logo from "../liatrio-logo.png";

class Footer extends Component {
  render() {
    return (
      <div>
        <a rel="noopener noreferrer" href="http://liatrio.com" target="_blank">
          <img src={logo} alt="Pipeline Diagram" height="70" />
        </a>
      </div>
    );
  }
}

export default Footer;
