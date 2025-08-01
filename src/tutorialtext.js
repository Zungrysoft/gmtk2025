import * as game from 'game'
import * as u from 'utils'
import * as soundmanager from 'soundmanager'
import * as vec2 from 'vector2'
import * as vec3 from 'vector3'
import Thing from 'thing'
import { drawBackground, drawSprite, drawText, getTextHeight } from './draw.js'

export default class TutorialText extends Thing {
  titleCardAsset = null
  depth = 99

  constructor(name, asset) {
    super();
    game.setThingName(this, name)
    this.titleCardAsset = asset
  }

  draw() {
    drawSprite({
      sprite: this.titleCardAsset,
      width: 1280,
      height: 720,
      depth: this.depth
    
    })
  }
}
