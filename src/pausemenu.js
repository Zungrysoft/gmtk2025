import * as game from 'game'
import * as u from 'utils'
import * as soundmanager from 'soundmanager'
import * as vec2 from 'vector2'
import * as vec3 from 'vector3'
import Thing from 'thing'
import { drawBackground, drawSprite, drawText, getTextHeight } from './draw.js'
import Guest from './guest.js'
import QuizClickable from './quizclickable.js'

export default class PauseMenu extends Thing {
  showPauseMenu = false


  constructor() {
    super();
    game.setThingName(this, 'pausemenu')
    this.sprite = game.assets.textures.background_pause
    this.depth = 1000
  }

  draw() {
    if (this.showPauseMenu) {
      drawSprite({
      sprite: this.sprite,
      width: 1280,
      height: 720,
      depth: this.depth,
      position: this.position,
    
    })
    }
    
  }
}
