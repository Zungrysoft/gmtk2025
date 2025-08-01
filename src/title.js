import * as game from 'game'
import * as u from 'utils'
import * as soundmanager from 'soundmanager'
import * as vec2 from 'vector2'
import * as vec3 from 'vector3'
import Thing from 'thing'
import { drawBackground, drawSprite, drawText, getTextHeight } from './draw.js'
import Guest from './guest.js'
import QuizClickable from './quizclickable.js'

export default class Title extends Thing {
  stage = 0

  constructor() {
    super();
  }

  draw() {
    // Title
    let sprite = game.assets.textures.square

    // Tutorial
    if (stage === 1) {

    }

    // Headphones recommendation
    if (stage === 2) {
      
    }

    // Grey-out backdrop
    drawBackground({
      sprite: sprite,
      depth: 1000,
    });
  }
}
