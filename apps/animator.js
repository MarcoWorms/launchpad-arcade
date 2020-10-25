const { writeFile } = require('fs')

const path = require('path')

const { start } = require('../launchpad')


let currentColor = { r: 0, g: 0, b: 0 }

let frames = []

let currentFrame = 0

let editorState = 'edit'

let animationTimer = null

let playFrame = 0

let playSpeed = 1000/12


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

  launchpad.setRgbColorXY({ x: 1, y: 9, r: 63, g: 63, b: 63})
  launchpad.setRgbColorXY({ x: 2, y: 9, r: 63, g: 63, b: 63})
  launchpad.setRgbColorXY({ x: 3, y: 9, r: 63, g: 63, b: 63})
  launchpad.setRgbColorXY({ x: 4, y: 9, r: 63, g: 63, b: 63})
  launchpad.setRgbColorXY({ x: 5, y: 9, r: 0, g: 15, b: 0})
  launchpad.setRgbColorXY({ x: 6, y: 9, r: 15, g: 0, b: 0})
  launchpad.setRgbColorXY({ x: 7, y: 9, r: 0, g: 0, b: 15})
}

const onButtonPress = ({ launchpad, button: { id, x, y }}) => {

  if (x === 9) {
    currentColor = launchpad.colorState(id)
    launchpad.setRgbColorXYNoSave({ x: 8, y: 9, ...currentColor})
  }

  if (y === 9) {

    if (x === 1) {
      if (editorState === 'play') { return }
      currentFrame = 0
      frames[currentFrame] && launchpad.loadPadState(frames[currentFrame])
    }
    if (x === 2) {
      if (editorState === 'play') { return }
      currentFrame = frames.length - 1
      frames[currentFrame] && launchpad.loadPadState(frames[currentFrame])
    }
    if (x === 3) {
      if (editorState === 'play') { return }
      currentFrame = Math.max(0, currentFrame - 1)
      frames[currentFrame] && launchpad.loadPadState(frames[currentFrame])
    }
    if (x === 4) {
      if (editorState === 'play') { return }
      currentFrame += 1
      frames[currentFrame] && launchpad.loadPadState(frames[currentFrame]) 
    }

    if (x === 5) {
      editorState = 'play'
      clearInterval(animationTimer)
      playFrame = currentFrame
      animationTimer = setInterval(() => {
        launchpad.loadPadState(frames[playFrame])
        playFrame += 1
        if (playFrame === frames.length) {
          playFrame = 0
        }
      }, playSpeed)
    }

    if (x === 6) {
      editorState = 'edit'
      clearInterval(animationTimer)
      launchpad.loadPadState(frames[currentFrame])
    }
    if (x === 7) {
      
      writeFile(path.join(__dirname, 'animations', Date.now() + '.json'), JSON.stringify(frames), () => { console.log('File saved') })
    }
    if (x === 8) {
      if (editorState === 'play') { return }
      onStart({ launchpad })
      frames[currentFrame] = JSON.parse(JSON.stringify(launchpad.state()))
    }
    launchpad.setRgbColorXY({ x: 8, y: 9, ...currentColor})
  }

  if (x !== 9 && y !== 9) {
    if (editorState === 'play') { return }
    launchpad.setRgbColor({ id, ...currentColor })
    frames[currentFrame] = JSON.parse(JSON.stringify(launchpad.state()))
  }
  // launchpad.setButtonColor({ id, color: 1 })
}

const onButtonRelease = ({ launchpad, button: { id, x, y }}) => {
  // console.log("button released!", id)
  // launchpad.({ id, r: 0, g: 0, b: 0  })
}

const launchpad = start({
  inputMidiPort: 0,
  outputMidiPort: 1, // 0 on mac, 1 on windows, don't know why
  onStart,
  onButtonPress,
  onButtonRelease,
})