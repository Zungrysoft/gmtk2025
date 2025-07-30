import * as game from 'game'
import Thing from 'thing'
import { drawBackground } from './draw.js'
import Furniture from './furniture.js'

export default class House extends Thing {
  isDying = false
  stripsAnimationState = 128
  type = null
  furniture_bounds = [[256, 555], [931, 555], [931, 166], [406, 166], [406, 360], [256, 360]]
  game_phase = ''
  night = 1
  tray_position = 100

  constructor(sprite, type) {
    super();
    this.type = type;

    this.changePhase('placement')
  }

  update() {
  }

  changePhase(phase) {
    this.game_phase = phase

    if (phase == 'placement') {
      this.addFurniture();
    }
  }

  addFurniture() {
    game.addThing(new Furniture(game.assets.textures.furniture_test, 'table', [-64, -62, 64, 62], [128, 256]))
    game.addThing(new Furniture(game.assets.textures.furniture_test, 'table', [-64, -62, 64, 62], [128, 512]))
    game.addThing(new Furniture(game.assets.textures.furniture_food1, 'food1', [-18, -18, 18, 18], [512, 512]))
  }

  draw() {
    drawBackground({ sprite: game.assets.textures.square, depth: 1, color: [0, 0, 0] });
    drawBackground({ sprite: game.assets.textures.background_day, depth: 3 });
  }
}
