const { start } = require('../launchpad')

const merge = (...props) => Object.assign({}, ...props)

const square = props => ({
  x: 1,
  y: 1,
  color: 3,
  speedX: 1,
  speedY: 1,
  onWallCollisionTop: square => ({ speedY: -Math.abs(square.speedY) }),
  onWallCollisionBottom: square => ({ speedY: Math.abs(square.speedY) }),
  onWallCollisionLeft: square => ({ speedX: Math.abs(square.speedX) }),
  onWallCollisionRight: square => ({ speedX: -Math.abs(square.speedX) }),
  ...props,
})

const enemy = () => square({
  x: 1 + Math.floor(Math.random() * 8),
  y: 8,
  speedY: -1,
  color: 7,
  onWallCollisionBottom: () => { dispatch: 'game-over' }
})

const bullet = ({ x, y }) => square({
  x,
  y,
  speedY: 1,
  color: 16,
  onWallCollisionTop: () => {destroy: true },
})

let state = {
  squares: [],
}

const addNewSquare = square => {
  state.squares.push(square)
}

const moveSquares = (launchpad) => {
  
  state.squares.forEach((square, index) => {
    
    if (Math.round(square.y) >= 8 && square.speedY > 0) {
      square = {...square, ...square.onWallCollisionTop(square) }
    }
    if (Math.round(square.y) <= 1 && square.speedY < 0) {
      square = {...square, ...square.onWallCollisionBottom(square) }
    }
    if (Math.round(square.x) <= 1 && square.speedX < 0) {
      square = {...square, ...square.onWallCollisionLeft(square) }
    }
    if (Math.round(square.x) >= 8 && square.speedX > 0) {
      square = {...square, ...square.onWallCollisionRight(square) }
    }
    
    if (square.destroy) {
      state.squares.splice(index, 1)
      return
    }
    
    if (square.dispatch === "game-over") {

      clearInterval(moveEnemiesIntervalId)
      launchpad.scrollText({ text: 'You died :(' })

    }
    
    square.x += square.speedX
    square.y += square.speedY
    
  })
  
}

const draw = launchpad => {
  launchpad.setAllColor(0)
  drawSquares(launchpad)
}

const drawSquares = launchpad => {
  state.squares.forEach(square => {
    launchpad.setColorXY({ ...square, ...{ x: Math.round(square.x), y: Math.round(square.y) } })
  })
}


let moveEnemiesIntervalId = null
let moveEnemiesTimeout = 1000

const onStart = launchpad => {
  
  moveEnemiesIntervalId = setTimeout(function tick () {
    
    moveSquares(launchpad)

    state.squares.push(enemy())

    draw(launchpad)

    moveEnemiesIntervalId = setTimeout(tick, moveEnemiesTimeout)
  }, moveEnemiesTimeout)

}

const onButtonPress = ({ launchpad, button: { id, x, y }}) => {

  if (y === 1) {

    state.squares.push(bullet({ x, y }))

    draw(launchpad)
  }

}

const onButtonRelease = ({ launchpad, button: { id, x, y }}) => {

}

const launchpad = start({
  inputMidiPort: 0,
  outputMidiPort: 1,
  onStart,
  onButtonPress,
  onButtonRelease,
})