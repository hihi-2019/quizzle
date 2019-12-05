import React from 'react'

import Welcome from './Welcome'
import Instructions from './Instructions'
import SetupGame from './SetupGame'
import Game from './Game'
import Results from './Results'
import GameEnd from './GameEnd'
import Lobby from './Lobby'

import socket from '../api/socket'

import { connect } from 'react-redux'



class App extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    // Start game from Lobby
    socket.on('all players in', () => {
      this.props.dispatch({
        type: 'START_GAME'
      })
    })

    // Get new question (from Results and GameEnd)
    socket.on('new question', () => {
      this.props.dispatch({
        type: 'RESET_QUESTIONS'
      })
      this.props.dispatch({
        type: 'START_GAME'
      })
      this.props.dispatch({
        type: 'CLEAR_PR_STATE'
      })
      this.props.dispatch({
        type: 'INCREMENT_ROUND'
      })
    })

    // Listen for submitted answers
    socket.on('submitted answer', () => {
      this.props.dispatch({
        type: 'INCREMENT_ANSWER_COUNT',
      })
    })

    // Listen for submitted answers
    socket.on('reset answer count', () => {
      this.props.dispatch({
        type: 'RESET_ANSWER_COUNT',
      })
    })

    // Get questions arrays from API, when questions are received start timer
    socket.on('receive questions', questions => {
      this.props.dispatch({
        type: 'ADD_QUESTIONS',
        questions: questions
      })
      this.interval = setInterval(() => {
        if(this.props.clock == 0){
          clearInterval(this.interval)
          this.props.dispatch({
            type: 'RESET_CLOCK'
          })
        }
        else{
          this.props.dispatch({
            type: 'DECREMENT_CLOCK'
          })      
        }
      }, 1000)
    })

    // Get final results (from Results to GameEnd)
    socket.on('score', score=>{
      this.props.dispatch({
        type: 'INCREMENT_SCORE',
        score: score
      })
    })

    // Reset scores
    socket.on('reset score', ()=>{
      this.props.dispatch({
        type: 'RESET_SCORE'
      })
    })

    // factor this out
    socket.on('end game', () => {
      this.props.dispatch({
        type: 'INCREMENT_PAGE'
      })
    })

    // Return to main menu page (from GameEnd to Welcome)
    socket.on('main menu', () => {
      this.props.dispatch({
        type: 'MAIN_MENU',
      })
    })

    // Get final results (from Results to GameEnd)
    socket.on('increment pages', () => {
      this.props.dispatch({
        type: 'INCREMENT_PAGE'
      })
    })
  }
  render() {
    return (
      <>
        {this.props.pageNumber == -1 && <Instructions />}
        {this.props.pageNumber == 0 && <Welcome />}
        {this.props.pageNumber == 1 && <SetupGame />}
        {this.props.pageNumber == 2 && <Lobby />}
        {this.props.pageNumber == 3 && <Game />}
        {this.props.pageNumber == 4 && <Results />}
        {this.props.pageNumber == 5 && <GameEnd />}
      </>
    )
  }


}

function mapStateToProps(state) {
  return {
    pageNumber: state.pageNumber,
    clock: state.clock
  }
}

export default connect(mapStateToProps)(App)
