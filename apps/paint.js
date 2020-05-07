const { start } = require('../launchpad')

const onStart = ({ launchpad }) => {
  launchpad.setAllColor(0)

  launchpad.setRgbColorXY({ x: 9, y: 1, r: 63, g: 0, b: 0})
  launchpad.setRgbColorXY({ x: 9, y: 2, r: 0, g: 63, b: 0})
  launchpad.setRgbColorXY({ x: 9, y: 3, r: 0, g: 0, b: 63})
  launchpad.setRgbColorXY({ x: 9, y: 4, r: 63, g: 63, b: 0})
  launchpad.setRgbColorXY({ x: 9, y: 5, r: 63, g: 0, b: 63})
  launchpad.setRgbColorXY({ x: 9, y: 6, r: 0, g: 63, b: 63})
  launchpad.setRgbColorXY({ x: 9, y: 7, r: 63, g: 63, b: 63})
  launchpad.setRgbColorXY({ x: 9, y: 8, r: 0, g: 0, b: 0})

  launchpad.setRgbColorXY({ x: 5, y: 9, r: 10, g: 0, b: 0})
  launchpad.setRgbColorXY({ x: 6, y: 9, r: 0, g: 10, b: 0})
  launchpad.setRgbColorXY({ x: 7, y: 9, r: 0, g: 0, b: 10})
}

let currentColor = { r: 0, g: 0, b: 0 }

let selectedColorChannels = { r: 1, g: 1, b: 1 }

const onButtonPress = ({ launchpad, button: { id, x, y }}) => {
  if (x === 9) {
    currentColor = launchpad.colorState(id)
    launchpad.setRgbColorXY({ x: 8, y: 9, ...currentColor})
  }
  if (y === 9) {
    if (x === 1) {
      currentColor.r = Math.min(currentColor.r + selectedColorChannels.r * 8, 63)
      currentColor.g = Math.min(currentColor.g + selectedColorChannels.g * 8, 63)
      currentColor.b = Math.min(currentColor.b + selectedColorChannels.b * 8, 63)
    }
    if (x === 2) {
      currentColor.r = Math.max(currentColor.r - selectedColorChannels.r * 8, 0)
      currentColor.g = Math.max(currentColor.g - selectedColorChannels.g * 8, 0)
      currentColor.b = Math.max(currentColor.b - selectedColorChannels.b * 8, 0)
    }
    if (x === 3) {
      currentColor.r = Math.min(currentColor.r + selectedColorChannels.r, 63)
      currentColor.g = Math.min(currentColor.g + selectedColorChannels.g, 63)
      currentColor.b = Math.min(currentColor.b + selectedColorChannels.b, 63)
    }
    if (x === 4) {
      currentColor.r = Math.max(currentColor.r - selectedColorChannels.r, 0)
      currentColor.g = Math.max(currentColor.g - selectedColorChannels.g, 0)
      currentColor.b = Math.max(currentColor.b - selectedColorChannels.b, 0)
    }
    if (x === 5) {
      selectedColorChannels.r = selectedColorChannels.r ? 0 : 1
      selectedColorChannels.r
        ? launchpad.setRgbColor({ id, r: 10, g: 0, b: 0})
        : launchpad.setRgbColor({ id, r: 1, g: 0, b: 0})
    }
    if (x === 6) {
      selectedColorChannels.g = selectedColorChannels.g ? 0 : 1
      selectedColorChannels.g
        ? launchpad.setRgbColor({ id, r: 0, g: 10, b: 0})
        : launchpad.setRgbColor({ id, r: 0, g: 1, b: 0})
    }
    if (x === 7) {
      selectedColorChannels.b = selectedColorChannels.b ? 0 : 1
      selectedColorChannels.b
        ? launchpad.setRgbColor({ id, r: 0, g: 0, b: 10})
        : launchpad.setRgbColor({ id, r: 0, g: 0, b: 1})
    }
    if (x === 8) {
      onStart({ launchpad })
      return
    }
    launchpad.setRgbColorXY({ x: 8, y: 9, ...currentColor})
  }
  if (x !== 9 && y !== 9) {
    launchpad.setRgbColor({ id, ...currentColor })
  }
  // launchpad.setButtonColor({ id, color: 1 })
}

const onButtonRelease = ({ launchpad, button: { id, x, y }}) => {
  // console.log("button released!", id)
  // launchpad.({ id, r: 0, g: 0, b: 0  })
}

const launchpad = start({
  inputMidiPort: 0,
  outputMidiPort: 0,
  onStart,
  onButtonPress,
  onButtonRelease,
})