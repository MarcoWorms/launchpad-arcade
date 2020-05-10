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
  speedX: 1,
  speedY: 1
}

const drawBall = ({ launchpad }) => {
  launchpad.setColorXY({ ...ball, ...{ x: Math.round(ball.x), y: Math.round(ball.y) } })
}

const draw = ({ launchpad }) => {
  launchpad.setAllColor(0)

  drawPlayerPad({ launchpad })
  drawBall({ launchpad })
}

const onStart = ({ launchpad }) => {
  const ballLoop = setInterval(() => {
    if (ball.y === 2 && ball.speedY < 0) {
      if (playerPad.x === ball.x) {
        ball.speedY = 1
        ball.speedX = 0
      }
      if (playerPad.x > ball.x - 2 && ball.speedX > 0) {
        ball.speedY = 1
        ball.speedX = -1
      }
      if (playerPad.x < ball.x + 2 && ball.speedX < 0) {
        ball.speedY = 1
        ball.speedX = 1
      }
      if (playerPad.x === ball.x - 1) {
        ball.speedY = 1
        ball.speedX = 0.5
      }
      if (playerPad.x === ball.x + 1) {
        ball.speedY = 1
        ball.speedX = -0.5
      }
    }
    if (ball.y === 1 && ball.speedY < 0) {
      ball.speedY = 0
      ball.speedX = 0
    }
    if (ball.y === 8 && ball.speedY > 0) {
      ball.speedY = -Math.abs(ball.speedY)
    }
    if (ball.x === 1 && ball.speedX < 0) {
      ball.speedX = Math.abs(ball.speedX)
    }
    if (ball.x === 8 && ball.speedX > 0) {
      ball.speedX = -Math.abs(ball.speedX)
    }
    ball.x += ball.speedX
    ball.y += ball.speedY
    draw({ launchpad })
  }, 200)
}

const onButtonPress = ({ launchpad, button: { id, x, y }}) => {
  if (y === 1 && x < 9) {
    playerPad.x = x

    if (playerPad.x === 1) { playerPad.x = 2 }
    if (playerPad.x === 8) { playerPad.x = 7 }

  }
  if (y === 9 && x === 8) {
    ball.y = 6
    ball.speedY = 1
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