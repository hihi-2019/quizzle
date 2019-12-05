import React from 'react'
import { connect } from 'react-redux'
import socket from '../api/socket'
// import { setInterval } from 'timers'

import QuestionSplash from './QuestionSplash'

// import { getQuestions } from '../../server/routes/questions'
class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      display1: '',
      display2: '',
      display3: '',
      display4: '',
      clock: 10
    }
  }

  componentDidMount() {
    socket.on('receive questions', ()=>{
      if(this.props.player.captain){
        setTimeout(() => this.finishRound(), 10000)
      }
        setInterval(() => {
          this.setState({
            clock: this.state.clock - 1
          })
        }, 1000)
    })

    const answerArr = ['correctAnswer', 'incorrectAnswer1', 'incorrectAnswer2', 'incorrectAnswer3']

    function randomAnswer(answerArr) {
      let length = answerArr.length
      let lastItem
      let i
      while (length) {
        i = Math.floor(Math.random() * length--)

        lastItem = answerArr[length]
        answerArr[length] = answerArr[i]
        answerArr[i] = lastItem
      }

      let randomArr = answerArr
      return randomArr
    }

    let randomArr = randomAnswer(answerArr)
    this.setState({
      display1: randomArr[0],
      display2: randomArr[1],
      display3: randomArr[2],
      display4: randomArr[3]
    })
  }

  finishRound = () => {
    socket.emit('reset answer count', this.props.teamName)
    socket.emit('increment pages', this.props.teamName)
  }

  handleClick = event => {
    event.preventDefault()

    if (this.props.answerCount == this.props.players.length - 1) {
      this.selectAnswer(event)
      this.finishRound()
    }
    else {
      this.selectAnswer(event)
    }
  }

  selectAnswer = (event) => {
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

  render() {
    let q = this.props.questions

    if (!q.trivias){
      return < QuestionSplash />
    }
    else {

    return (      
      <div>
        {q.trivias && <h2>{q.trivias[this.props.player.index].question}</h2>}
        <p>{this.state.clock}</p>
        {!this.state.submittedAnswer && q.jumbledTrivias && (
          <div className='btn-group'>
            <button
              id={
                q.jumbledTrivias[this.props.player.index][this.state.display1]
              }
              onClick={this.handleClick}
            >
              {q.jumbledTrivias[this.props.player.index][this.state.display1]}
            </button>
            <button
              id={
                q.jumbledTrivias[this.props.player.index][this.state.display2]
              }
              onClick={this.handleClick}
            >
              {q.jumbledTrivias[this.props.player.index][this.state.display2]}
            </button>
            <button
              id={
                q.jumbledTrivias[this.props.player.index][this.state.display3]
              }
              onClick={this.handleClick}
            >
              {q.jumbledTrivias[this.props.player.index][this.state.display3]}
            </button>
            <button
              id={
                q.jumbledTrivias[this.props.player.index][this.state.display4]
              }
              onClick={this.handleClick}
            >
              {q.jumbledTrivias[this.props.player.index][this.state.display4]}
            </button>
          </div>
        )}

        {this.state.submittedAnswer && (
          <div className='btn-group'>
            <button>
              {this.props.playerResponses[0].selectedAnswer}
            </button>
          </div>
        )}
      </div>
    )}
  }
}

function mapStateToProps(state) {
  return {
    player: state.player,
    questions: state.questions,
    playerResponses: state.playerResponses,
    teamName: state.teamName,
    players: state.players,
    answerCount: state.answerCount
  }
}

export default connect(mapStateToProps)(Game)
