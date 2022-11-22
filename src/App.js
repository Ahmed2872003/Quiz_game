import React, { Component } from "react";
import Question from "./Question";
import Start from "./Start";
export default class App extends Component {
  constructor() {
    super();
    this.state = {
      page: [],
      start: false,
      end: false,
      result: 0,
    };
    this.correctAns = new Map();
    this.grades = new Map();
    this.showQue = this.showQue.bind(this);
    this.finalResult = this.finalResult.bind(this);
    this.selected = this.selected.bind(this);
  }
  /*returns all questions*/
  async getQuestions() {
    try {
      const info = await fetch(
        "https://opentdb.com/api.php?amount=5&category=18&difficulty=easy&type=multiple"
      );
      return await info.json();
    } catch (e) {}
  }
  /*returns all questions*/
  selected(event, correct) {
    let event_target_parent = event.target.parentNode;
    let parent_children = Array.from(event_target_parent.children);
    let target_li = event.target;
    let sameSelected = false;
    if (!this.grades.has(event_target_parent)) {
      this.grades.set(event_target_parent, 0);
    }
    /*remove previous selected element */
    parent_children.forEach((child) => {
      if (child.classList.contains("selected")) {
        child.classList.remove("selected");
        /**checks if same choice is selected */
        if (child === target_li) sameSelected = true;
        /**checks if same choice is selected */
      }
    });
    if (!sameSelected) {
      let grade = this.grades.get(event_target_parent);
      if (target_li.innerHTML === correct) grade++;
      else if (target_li.innerHTML !== correct && grade > 0) grade--;
      this.grades.set(event_target_parent, grade);
    }
    /*remove previous selected element */
    target_li.classList.add("selected");
  }
  async showQue() {
    this.setState({ start: true });
    const info = (await this.getQuestions()).results;
    this.setState({
      page: info.map((e, i) => {
        this.correctAns.set(i + 1, e.correct_answer);
        return (
          <Question
            q={e.question}
            correct_ch={e.correct_answer}
            incorrect_ch={e.incorrect_answers}
            selected={this.selected}
            id={i + 1}
            end={this.state.end}
          />
        );
      }),
    });
  }
  finalResult(event) {
    let event_target = event.target;
    if (event_target.innerHTML === "Check answers") {
      let wholeQues = document.querySelectorAll(".question");
      for (let i = 0; i < wholeQues.length; i++) {
        let li_parent = wholeQues[i].children[1];
        let isChoosen = false;
        for (let j = 0; j < li_parent.children.length; j++) {
          if (
            li_parent.children[j].innerHTML ===
            this.correctAns.get(+wholeQues[i].id)
          )
            li_parent.children[j].style =
              "background-color:#94d7a2;color:#4b6577;";
          if (li_parent.children[j].classList.contains("selected")) {
            isChoosen = true;
            if (
              li_parent.children[j].innerHTML !==
              this.correctAns.get(+wholeQues[i].id)
            )
              li_parent.children[j].style =
                "background-color:#f7d9db;color:#b0a9bd;";
          }
        }
        if (!isChoosen) {
          let message = document.createElement("span");
          message.append(
            document.createTextNode(" (You didn't choose in that question)")
          );
          message.style.color = "#990000";

          wholeQues[i].children[0].appendChild(message);
        }
      }
      /**change state to end of quiz */
      this.setState({
        /**calc final grade */
        result: [...this.grades].reduce((sum, e) => sum + e[1], 0),
        end: true,
      });
      /**calc final grade */
      /**change state to end of quiz */
    } else {
      this.grades = new Map();
      this.setState({ page: [], end: false, start: false });
      this.showQue();
    }
  }
  render() {
    return (
      <div className="container">
        {/******************************************/}
        {this.state.start ? (
          this.state.page.length ? (
            this.state.page
          ) : (
            <div id="loading"></div>
          )
        ) : (
          <Start showQue={this.showQue} />
        )}
        {/******************************************/}
        <div className="check">
          {this.state.start && this.state.page.length > 0 && (
            <button className="checkAns" onClick={this.finalResult}>
              {this.state.end ? "Play again" : "Check answers"}
            </button>
          )}
          {this.state.end && (
            <p
              style={{ color: "#293264", fontSize: "20px", fontWeight: "700" }}
            >
              You scored {this.state.result}/{this.state.page.length} answers
            </p>
          )}
        </div>
      </div>
    );
  }
}
