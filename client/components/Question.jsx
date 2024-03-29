import React from 'react'
import { connect } from 'react-redux'
import socket from '../api/socket'
import UIfx from 'uifx'

import { isIOS } from 'react-device-detect';

const buttonfx = "/sfx/buttonClick.mp3"
const buttonClick = new UIfx(buttonfx)

class Question extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      display1: '',
      display2: '',
      display3: '',
      display4: '',
      answerSelected: false
    }

  }

  componentDidMount() {
    const answerArr = ['correctAnswer', 'incorrectAnswer1', 'incorrectAnswer2', 'incorrectAnswer3']
    let randomArr = this.randomAnswer(answerArr)
    this.setState({
      display1: randomArr[0],
      display2: randomArr[1],
      display3: randomArr[2],
      display4: randomArr[3]
    })
  }

  randomAnswer = (answerArr) => {
    let length = answerArr.length
    let lastItem
    let i
    while (length) {
      i = Math.floor(Math.random() * length--)
      lastItem = answerArr[length]
      answerArr[length] = answerArr[i]
      answerArr[i] = lastItem
    }
    return answerArr
  }

  handleClick = event => {
    if (!isIOS){
      buttonClick.play()
    }
    if (this.props.answerCount == this.props.players.length - 1) {
      this.selectAnswer(event)
      this.props.finishRound()

    }
    else {
      this.selectAnswer(event)
    }
  }

  selectAnswer = (event) => {
    if(this.state.answerSelected){
      //do nothing
    }
    else{
      this.setState({
        answerSelected:true
      })
      this.props.dispatch({
        type: 'SUBMIT_ANSWER',
        response: {
          question: this.props.questions.jumbledTrivias[this.props.player.index]
            .question,
          correctAnswer: this.props.questions.jumbledTrivias[
            this.props.player.index
          ].correctAnswer,
          selectedAnswer: event.target.id
        }
      })
      this.setState({
        submittedAnswer: true
      })
      socket.emit('submitted answer', this.props.teamName)     
    }
  }

  render() {
    let trivia = this.props.questions.trivias[this.props.player.index]
    let jumbledTrivia = this.props.questions.jumbledTrivias[this.props.player.index]
    return (
      <>
        <h2 className='questions-title'> {trivia.question}</h2>
        {!this.state.submittedAnswer &&
          <div className='questions-btns'>
            <div
              className='questions-btns__btn' id={jumbledTrivia[this.state.display1]}
              onClick={this.handleClick}
              >{jumbledTrivia[this.state.display1]}
            </div>
            <div
              className='questions-btns__btn'
              id={jumbledTrivia[this.state.display2]}
              onClick={this.handleClick}
              >{jumbledTrivia[this.state.display2]}
            </div>
            <div
              className='questions-btns__btn'
              id={jumbledTrivia[this.state.display3]}
              onClick={this.handleClick}
              >{jumbledTrivia[this.state.display3]}
            </div>
            <div
              className='questions-btns__btn'
              id={jumbledTrivia[this.state.display4]}
              onClick={this.handleClick}
              >{jumbledTrivia[this.state.display4]}
            </div>
          </div>}
        {this.state.submittedAnswer &&
          <div className='questions-btns__answered'>
            <div>{this.props.playerResponses[0].selectedAnswer}</div>
          </div>
        }
      </>
    )
  }
}

function mapStateToProps(state) {
  return {
    playerResponses: state.playerResponses,
    players: state.players,
    teamName: state.teamName,
    answerCount: state.answerCount,
    questions: state.questions,
    player: state.player
  }
}

export default connect(mapStateToProps)(Question)