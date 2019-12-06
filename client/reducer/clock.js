const timePerPlayer = 30

const reducer = (state = timePerPlayer, action) => {
  switch (action.type){
    case 'DECREMENT_CLOCK':{
      return state -1
    }
    case 'RESET_CLOCK':{
      return timePerPlayer * action.playerCount
    }
    default: return state
  }
}

export default reducer