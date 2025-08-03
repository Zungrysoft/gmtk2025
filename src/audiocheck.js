import * as game from 'game'
import * as u from 'utils'
import * as soundmanager from 'soundmanager'
import * as vec2 from 'vector2'
import * as vec3 from 'vector3'
import Tray from './tray.js'
import { drawBackground, drawSprite, drawText, getTextHeight, getTextWidth } from './draw.js'
import Button from './button.js'
import Furniture from './furniture.js'
import Thing from 'thing'
import { TEXT_REGULAR, TEXT_SELECTED } from './quiz.js'

export default class AudioCheck extends Thing {
  time = 0
  shouldDraw = false
  depth = 100000
  totalSound = 0

  constructor() {
    super()
    game.setThingName(this, 'audiocheck')
    soundmanager.updateSoundPan([100000, 100000, 100000], [1, 0, 0])
  }

  update() {
    this.time ++

    if (this.time === 2) {
      soundmanager.playSound('foley_guitar_pick_up', 0.001, 1.0, [100000, 100000, 100000]);
    }

    if (this.time > 2) {
      for (const { analyser } of game.globals.audioSources) {
        const dataArray = new Uint8Array(analyser.fftSize);
        analyser.getByteTimeDomainData(dataArray);
        for (let i = 0; i < dataArray.length; i++) {
          const val = (dataArray[i] - 128) / 128;
          this.totalSound += Math.abs(val)
        }
      }
    }

    if (this.time === 60) {
      console.log("Spatial audio check:", this.totalSound)
      if (this.totalSound < 3) {
        this.shouldDraw = true
      }
    }
  }

  draw() {
    if (this.shouldDraw) {
      drawBackground({
        color: [0, 0, 0],
        depth: this.depth,
      })
      drawText({
        text: "Error: Spatial audio is not working in your browser.\nTry upgrading your browser or switching to a different one.",
        color: [1, 0, 0],
        position: [10, 10],
        depth: this.depth + 1,
      })
    }
  }
}
