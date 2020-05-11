const { start } = require('../launchpad')

let playerPad = {
  x: 5,
  color: 3,
}

const drawPlayerPad = ({ launchpad }) => {
  launchpad.setColorXY({ color: playerPad.color, x: playerPad.x - 1, y: 1 })
  launchpad.setColorXY({ color: playerPad.color, x: playerPad.x, y: 1 })
  launchpad.setColorXY({ color: playerPad.color, x: playerPad.x + 1, y: 1 })
}

let ball = {
  x: 5,
  y: 8,
  color: 17,
  speedX: 1,
  speedY: 1
}

const drawBall = ({ launchpad }) => {
  launchpad.setColorXY({ ...ball, ...{ x: Math.round(ball.x), y: Math.round(ball.y) } })
}


let objective = {
  x: 5,
  y: 8,
  color: 72,
  speedX: 0,
  speedY: 0
}

const drawObjective = ({ launchpad }) => {
  launchpad.setColorXY({ ...objective, ...{ x: Math.round(objective.x), y: Math.round(objective.y) } })
}

const draw = ({ launchpad }) => {
  launchpad.setAllColor(0)

  drawPlayerPad({ launchpad })
  // drawObjective({ launchpad })
  drawBall({ launchpad })
}

let gameLoop = null
let tickTimeout = 50

const randomizeObjectivePosition = () => {
  objective.x = 1 + Math.floor(Math.random() * 8)
  objective.y = 8 - Math.floor(Math.random() * 2)
}

const speedUp = () => {
  if (tickTimeout === 50) { return }
  tickTimeout -= 20
}

const onStart = ({ launchpad }) => {

  // randomizeObjectivePosition()

  ball.y = 6
  ball.speedY = -1

  clearInterval(gameLoop)
  gameLoop = setTimeout(function tick () {
    
    if (ball.y === 2 && ball.speedY < 0) {
      if (playerPad.x === Math.round(ball.x)) {
        ball.speedY = 1
        ball.speedX = 0
        speedUp()
      }

      if (playerPad.x - 1 === Math.round(ball.x)) {
        ball.speedY = 1
        ball.speedX = -0.5
        speedUp()
      }

      if (playerPad.x + 1 === Math.round(ball.x)) {
        ball.speedY = 1
        ball.speedX = 0.5
        speedUp()
      }

      if (playerPad.x + 2 === Math.round(ball.x) && ball.speedX < 0) {
        ball.speedY = 1
        ball.speedX = 1
        speedUp()
      }

      if (playerPad.x - 2 === Math.round(ball.x) && ball.speedX > 0) {
        ball.speedY = 1
        ball.speedX = -1
        speedUp()
      }
    }
    if (Math.round(ball.y) <= 1 && ball.speedY < 0) {
      ball.speedX = 0
      ball.speedY = 0
    }
    if (Math.round(ball.y) >= 8 && ball.speedY > 0) {
      ball.speedY = -Math.abs(ball.speedY)
    }
    if (Math.round(ball.x) <= 1 && ball.speedX < 0) {
      ball.speedX = Math.abs(ball.speedX)
    }
    if (Math.round(ball.x) >= 8 && ball.speedX > 0) {
      ball.speedX = -Math.abs(ball.speedX)
    }
    ball.x += ball.speedX
    ball.y += ball.speedY


    // if (Math.round(ball.x) === objective.x && Math.round(ball.y) === objective.y) {
    //   randomizeObjectivePosition()
    //   if (tickTimeout === 50) { return }
    //   tickTimeout -= 50
    // }

    draw({ launchpad })

    gameLoop = setTimeout(tick, tickTimeout)
  }, tickTimeout)
}

const onButtonPress = ({ launchpad, button: { id, x, y }}) => {
  if (y === 1 && x < 9) {
    playerPad.x = x

    if (playerPad.x === 1) { playerPad.x = 2 }
    if (playerPad.x === 8) { playerPad.x = 7 }

  }
  if (y === 9 && x === 8) {
    onStart({ launchpad })
  }
  draw({ launchpad })
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