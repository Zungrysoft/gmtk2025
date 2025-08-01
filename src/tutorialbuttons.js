import * as game from 'game'
import * as u from 'utils'
import * as soundmanager from 'soundmanager'
import * as vec2 from 'vector2'
import * as vec3 from 'vector3'
import Tray from './tray.js'
import { drawBackground, drawSprite } from './draw.js'
import Button from './button.js'

export default class TutorialButton extends Button {
  isForward = true

  constructor(name, isForward, texture) {
    super(name, texture, texture, [80,100], [0,0], [0,0], true, [10,4,72,92])
    this.depth = 101
    this.isForward = isForward
    if (isForward) {
      this.position = [995,338] 
      this.openPosition = [995,338] 
      this.closedPosition = [995,338]
    }
    else {
      this.position = [208,332]
      this.openPosition = [208,332]
      this.closedPosition = [208,332]
    }

  }

  onClick() {
    if (this.isForward) game.getThing('tutorial').stage++
    else game.getThing('tutorial').stage--
  }
}
