import React, { Component } from "react";

export default class question extends Component {
  constructor(props) {
    super(props);
    this.question = this.props.q;
    this.choices = this.props.incorrect_ch;
  }
  render() {
    /*push all info about incorrect answers */
    this.choices.push(this.props.correct_ch);
    let choices = this.choices.map((e, i) => (
      <li
        key={i + 1}
        onClick={(e) => this.props.selected(e, this.props.correct_ch)}
      >
        {e}
      </li>
    ));
    /*push all info about incorrect answers */
    /*change index's correct answer in random index */
    let random = Math.floor(Math.random() * choices.length);

    [choices[choices.length - 1], choices[random]] = [
      choices[random],
      choices[choices.length - 1],
    ];
    /*change index's correct answer in random index */
    return (
      <div className="question" key={this.props.id} id={this.props.id}>
        <h3>{`${this.props.id} - ${this.question}`}</h3>
        <ul key={this.props.id}>{choices}</ul>
        <hr></hr>
      </div>
    );
  }
}
