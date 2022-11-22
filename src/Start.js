import React, { Component } from "react";

export default class Start extends Component {
  render() {
    return (
      <div className="start--page">
        <h1>Quizzical</h1>
        <p>Computer science</p>
        <button onClick={this.props.showQue}>Start Quiz</button>
      </div>
    );
  }
}
