import * as game from 'game'
import Thing from 'thing'
import { drawBackground } from './draw.js'

export default class House extends Thing {
  isDying = false
  stripsAnimationState = 128
  type = null

  constructor(sprite, type) {
    super();
    this.type = type;
  }

  update() {
    console.log("House in the house")
  }

  draw() {
    drawBackground({ sprite: game.assets.textures.square, depth: 1, color: [0, 0, 0] });
    drawBackground({ sprite: game.assets.textures.background_day, depth: 3 });
  }
}
