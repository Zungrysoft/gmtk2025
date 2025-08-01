import * as game from 'game'
import * as u from 'utils'
import * as soundmanager from 'soundmanager'
import * as vec2 from 'vector2'
import * as vec3 from 'vector3'
import Tray from './tray.js'
import { drawBackground, drawSprite } from './draw.js'
import Button from './button.js'

export default class PauseButton extends Button {

  onClick() {
    // game.getThing('pausemenu').showPauseMenu = true
  }

  isClickable() {
      if (game.getThing('quiz')?.isEnabled) return false
      if (this.isTransitioningClosed || this.isTransitioningOpen) return false
      return true
  }

}
