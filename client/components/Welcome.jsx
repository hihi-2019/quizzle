import React from 'react'
import { connect } from 'react-redux'
import Instructions from './Instructions'
import Create from './Create'
import Join from './Join'
import UIfx from 'uifx'

import { isIOS } from 'react-device-detect';

const buttonfx = "/sfx/buttonClick.mp3"
const buttonClick = new UIfx(buttonfx)

export class Welcome extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      display: "main",
      history: ["main"],
      historyIndex: 0,
    }
  }

  componentDidMount() {
    if(this.props.window != false){
      window.addEventListener('popstate', () => {
        let historyState = this.state.history
        let historyIndex = this.state.historyIndex
        
        if (historyIndex > 0) {
          this.state.history.pop()
          this.setState({
            display: historyState[historyIndex - 1],
            historyIndex: this.state.historyIndex - 1
          })
        }
      })
    }
  }


  changePage = (event, page) => {
    event.preventDefault();
    if (!isIOS){
      buttonClick.play()
    }

    this.setState({
      display: page,
      history: [...this.state.history, page],
      historyIndex: this.state.historyIndex + 1
    })
  }

  render() {
    return (
      <>
        {this.state.display == "main" && <main>
          <section className='home'>
            <h1 className='home-gameTitle'>Quizzical</h1>
            <div className='home-logo'>
              <img className='home-logo__pic' id="home-logo"
                src='./imgs/img-2.png'
                alt='logo'
              />
            </div>
            <div className='home-btns'>
              <div className='home-btns__btn' id="create-btn" onClick={(e) => this.changePage(e, 'create')}>
                CREATE TEAM
              </div>
              <div className='home-btns__btn' id="join-btn" onClick={(e) => this.changePage(e, 'join')}>
                JOIN TEAM
              </div>
              <div className='home-btns__btn' id="instruct-btn" onClick={(e) => this.changePage(e, 'instructions')}>
                HOW TO PLAY
              </div>
            </div>
          </section>
        </main>}
        {this.state.display == "instructions" && <Instructions changePage={this.changePage} />}
        {this.state.display == "create" && <Create changePage={this.changePage} />}
        {this.state.display == "join" && <Join changePage={this.changePage} />}
      </>
    )
  }
}


export default connect()(Welcome)