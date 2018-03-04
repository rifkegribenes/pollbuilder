import React, { Component } from "react";

export default class ErrorMessages extends Component {
  render() {
    return this.props.display === true ? (
      <div>{this.props.children}</div>
    ) : null;
  }
}
