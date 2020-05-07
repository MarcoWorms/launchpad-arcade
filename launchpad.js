// Launchpad MK2 Programmer’s Reference Manual
// https://d2xhy469pqj8rc.cloudfront.net/sites/default/files/novation/downloads/10529/launchpad-mk2-programmers-reference-guide-v1-02.pdf

// Thanks https://github.com/tjhorner/node-launchpad-mk2 for the inspiration!!

const midi = require('midi')

const buttonsIdLayout = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 11, 12, 13, 14, 15, 16, 17, 18, 19],
  [0, 21, 22, 23, 24, 25, 26, 27, 28, 29],
  [0, 31, 32, 33, 34, 35, 36, 37, 38, 39],
  [0, 41, 42, 43, 44, 45, 46, 47, 48, 49],
  [0, 51, 52, 53, 54, 55, 56, 57, 58, 59],
  [0, 61, 62, 63, 64, 65, 66, 67, 68, 69],
  [0, 71, 72, 73, 74, 75, 76, 77, 78, 79],
  [0, 81, 82, 83, 84, 85, 86, 87, 88, 89],
  [0, 104, 105, 106, 107, 108, 109, 110, 111, 0],
]

const getButtonIdByXY = ({ x, y }) => buttonsIdLayout[y][x]

const getButtonXYById = (id) => {
  let result = null
  buttonsIdLayout.forEach((row, y) => {
    row.forEach((btnId, x) => {
      if (id === btnId) {
        result = { x, y }
      }
    })
  })
  return result
}

const makeLaunchpadSystemMessage = (message) => [
  ...[240, 0, 32, 41, 2, 24],
  ...message,
  247,
]

const start = ({ inputMidiPort, outputMidiPort, onButtonPress, onButtonRelease, onStart }) => {
  const input = new midi.input()
  const output = new midi.output()

  input.openPort(inputMidiPort)
  output.openPort(outputMidiPort)

  const padState = {}

  const launchpad = {
    setColor: ({ id, color }) => {
      padState[id] = color
      output.sendMessage(makeLaunchpadSystemMessage([10, id, color]))
    },
    setColorXY: ({ x, y, color }) => {
      padState[getButtonIdByXY({ x, y })] = color
      output.sendMessage(makeLaunchpadSystemMessage([10, getButtonIdByXY({ x, y }), color]))
    },
    setRgbColor: ({ id, r, g, b }) => {
      padState[id] = { r, g, b }
      output.sendMessage(makeLaunchpadSystemMessage([11, id, r, g, b]))
    },
    setRgbColorXY: ({ x, y, r, g, b }) => {
      padState[getButtonIdByXY({ x, y })] = { r, g, b }
      output.sendMessage(makeLaunchpadSystemMessage([11, getButtonIdByXY({ x, y }), r, g, b]))
    },
    setAllColor: (color) => {
      output.sendMessage(makeLaunchpadSystemMessage([14, color]))
    },
    flashColor: ({ id, color }) => {
      output.sendMessage(makeLaunchpadSystemMessage([35, 0, id, color]))
    },
    flashColorXY: ({ id, color }) => {
      output.sendMessage(makeLaunchpadSystemMessage([35, 0, getButtonIdByXY({ x, y }), color]))
    },
    pulseColor: ({ id, color }) => {
      output.sendMessage(makeLaunchpadSystemMessage([40, 0, id, color]))
    },
    pulseColorXY: ({ id, color }) => {
      output.sendMessage(makeLaunchpadSystemMessage([40, 0, getButtonIdByXY({ x, y }), color]))
    },
    scrollText: ({ text, color, loop }) => {
      const textAsCharCode = text.split('').map(char => char.charCodeAt(0))
      const loopAsByte = loop ? 1 : 0

      output.sendMessage(makeLaunchpadSystemMessage([20, 0, color, loopAsByte, ...textAsCharCode]))
    },
    colorState: (id) => Object.assign({}, padState[id]),
  }

  input.on("message", (dTime, message) => {
    if (message[0] === 176 || message[0] === 144) {

      const button = {
        id: message[1],
        ...getButtonXYById(message[1])
      }

      if(message[2] > 0) {
        onButtonPress({ launchpad, button })
      } else {
        onButtonRelease({ launchpad, button })
      }
    }
  })

  onStart({ launchpad })
}

module.exports = {
  start,
}