import React from 'react'
import { connect } from 'react-redux'
import socket from '../api/socket'
import UIfx from 'uifx'

import { isIOS } from 'react-device-detect';

const buttonfx = "/sfx/buttonClick.mp3"
const buttonClick = new UIfx(buttonfx)

class AddScore extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            team: '',
            buttonClicked: false,
            message: ''
        };
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    submitScore = () => {
        if (!isIOS){
            buttonClick.play()
          }
        if (this.state.buttonClicked == true) {
            // do nothing
        }
        else if (this.state.team == '') {
            this.setState({
                message: 'You need to enter a name for your team!'
            })
        }
        else {
            let teamScore = this.props.score.points
            socket.emit('add to leaderboard', { teamName: this.state.team, teamCode: this.props.teamName, teamSize: this.props.players.length, teamScore: teamScore, totalRounds: this.props.totalRounds })
            this.setState({
                buttonClicked: true
            })
        }
    }

    playAgain = () => {
        if (!isIOS){
            buttonClick.play()
          }
        socket.emit('reset game', this.props.teamName)
        if (this.props.missingPlayers.length != 0) {
            socket.emit('all players in', { teamName: this.props.teamName, numOfPlayers: this.props.players.length - this.props.missingPlayers.length, players: this.props.players })
        } else {
            socket.emit('all players in', { teamName: this.props.teamName, numOfPlayers: this.props.players.length, players: this.props.players })
        }
    }

    mainMenu = () => {
        if (!isIOS){
            buttonClick.play()
          }
        socket.emit('reset game', this.props.teamName)
        socket.emit('main menu', this.props.teamName)
    }

    render() {
        return (
            <div className="leaderboard">
                <h1 className="leaderboard-title">Add Score to Leaderboard</h1>
                <p className="leaderboard-team">Team name:</p>
                <input className="leaderboard-team__field" name="team" onChange={this.handleChange} />
                <h3 className="leaderboard-team__score">Your Score: {this.props.score.points}</h3>
                <h2>{this.state.message}</h2>
                <div className='home-btns'>
                    <div className='home-btns__btn' onClick={this.submitScore}>Submit Score</div>
                </div>
                <section className='leaderboard-btnSection'>
                    <div className='setup-btns__btn' onClick={this.playAgain}>Play Again</div>
                    <div className='home-btns__btn' onClick={this.mainMenu}>Main Menu</div>
                </section>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        players: state.players,
        teamName: state.teamName,
        score: state.score,
        totalRounds: state.totalRounds,
        missingPlayers: state.missingPlayers
    }
}

export default connect(mapStateToProps)(AddScore)