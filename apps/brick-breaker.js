const { start } = require('../launchpad')

let playerPad = {
  x: 4,
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
  color: 12,
  directionX: 1,
  directionY: 1
}

const drawBall = ({ launchpad }) => {
  launchpad.setColorXY(ball)
}

const draw = ({ launchpad }) => {
  launchpad.setAllColor(0)

  drawPlayerPad({ launchpad })
  drawBall({ launchpad })
}

const onStart = ({ launchpad }) => {
  const gameLoop = setInterval(() => {
    draw({ launchpad })
  }, 1000/60)

  const ballLoop = setInterval(() => {
    if (ball.y === 2 && ball.directionY === -1) {
      if (playerPad.x === ball.x) {
        ball.directionY = 1
        ball.directionX = 0
      }
      if (playerPad.x === ball.x - 1) {
        ball.directionY = 1
        ball.directionX = 1
      }
      if (playerPad.x === ball.x + 1) {
        ball.directionY = 1
        ball.directionX = -1
      }
    }
    if (ball.y === 1 && ball.directionY === -1) {
      ball.directionY = 0
      ball.directionX = 0
    }
    if (ball.y === 8 && ball.directionY === 1) {
      ball.directionY = -1
    }
    if (ball.x === 1 && ball.directionX === -1) {
      ball.directionX = 1
    }
    if (ball.x === 8 && ball.directionX === 1) {
      ball.directionX = -1
    }
    ball.x += ball.directionX
    ball.y += ball.directionY
  }, 200)
}

const onButtonPress = ({ launchpad, button: { id, x, y }}) => {
  if (y === 1 && x < 9) {
    playerPad.x = x

    if (playerPad.x === 1) { playerPad.x = 2 }
    if (playerPad.x === 8) { playerPad.x = 7 }

  }
}

const onButtonRelease = ({ launchpad, button: { id, x, y }}) => {

}

const launchpad = start({
  inputMidiPort: 0,
  outputMidiPort: 0,
  onStart,
  onButtonPress,
  onButtonRelease,
})