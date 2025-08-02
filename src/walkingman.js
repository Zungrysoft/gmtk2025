import * as game from 'game'
import * as u from 'utils'
import * as vec2 from 'vector2'
import * as soundmanager from 'soundmanager'
import Thing from 'thing'
import Furniture from './furniture.js'
import { drawSprite, drawText } from './draw.js'
import Conversation from './conversation.js'

const CONVERSATION_RADIUS = 130
const TALK_RADIUS = CONVERSATION_RADIUS * 2.1

export default class WalkingMan extends Thing {
  position = [0, 0]
  time = 0

  constructor(isLeaving) {
    super();

    
    this.isLeaving = isLeaving
    this.position = isLeaving ? [406, 441] : [406, 760]
  }

  update() {
    this.time++

    const speed = 2.4
    if (this.isLeaving) {
      this.position[1] += speed;
    }
    else {
      this.position[1] -= speed;
    }

    if (this.position[1] < 300 || this.position[1] > 900) {
      this.isDead === true
    }
    
  }

  draw() {
    const frame = Math.floor(this.time / 20) % 4;

    drawSprite({
      sprite: frame % 2 === 0 ? game.assets.textures.ui_walking_man_1 : game.assets.textures.ui_walking_man_2,
      centered: true,
      width: frame < 2 ? -64 : 64,
      height: this.isLeaving ? -64 : 64,
      alpha: u.clamp((this.position[1] - 477) * 0.02, 0, 1),
      position: this.position,
      depth: 40,
    })
  }
}
