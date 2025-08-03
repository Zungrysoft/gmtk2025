import * as game from 'game'
import * as u from 'utils'
import * as soundmanager from 'soundmanager'
import * as vec2 from 'vector2'
import * as vec3 from 'vector3'
import Tray from './tray.js'
import { drawBackground, drawSprite } from './draw.js'
import Button from './button.js'
import AudioCheck from './audiocheck.js'

export default class TutorialButton extends Button {
  isForward = true

  constructor(name, isForward, isMainMenuButton, texture, depth) {
    super(name, texture, texture, [128,128], [0,0], [0,0], true, [17,23,111,98])
    this.depth = depth
    this.isForward = isForward
    if (isForward) {
      this.position = [1012,300] 
      this.openPosition = [1012,300] 
      this.closedPosition = [1012,300] 
    }
    else {
      this.position = [128,302]
      this.openPosition = [128,302]
      this.closedPosition = [128,302]
    }

    if (isMainMenuButton) {
      this.size = [1280, 720]
      this.aabb = [460,514,784,659]
      this.position = [0,0]
      this.openPosition = [0,0]
      this.closedPosition = [0,0]
      
    }
  }

  isClickable() {
    return this.isForward || (game.getThing('tutorial')?.stage ?? 0) > 0
  }

  onClick() {
    if (!game.getThing('audiocheck')) {
      game.addThing(new AudioCheck());
    }

    if (this.isForward) game.getThing('tutorial').stage++
    else game.getThing('tutorial').stage--

    soundmanager.playSound('paper2', 0.13, [1.4, 1.6]);
    
  }
}
