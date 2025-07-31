import * as game from 'game'
import * as u from 'utils'
import * as soundmanager from 'soundmanager'
import * as vec2 from 'vector2'
import * as vec3 from 'vector3'
import Tray from './tray.js'
import { drawBackground, drawSprite } from './draw.js'

export default class Button extends Tray {

  constructor(trayName, openSprite, closedSprite, openPosition, closedPosition, defaultOpen, toggleButtonAABB, size) {
    super(trayName, openSprite, closedSprite, openPosition, closedPosition, defaultOpen, toggleButtonAABB, size)
  }


  onClick() {
    if (!this.isTransitioningClosed && !this.isTransitioningOpen) this.toggleOpenState();
  }


  update() {
    super.update()

  }
}
