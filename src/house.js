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
    // Tables
    game.addThing(new Furniture(game.assets.textures.furniture_table1, 'table', [-105, -52, 105, 52], [128, 256]))
    game.addThing(new Furniture(game.assets.textures.furniture_table2, 'table', [-83, -64, 83, 64], [128, 512]))
    game.addThing(new Furniture(game.assets.textures.furniture_table3, 'table', [-66, -48, 66, 48], [128, 512]))

    // Seating
    game.addThing(new Furniture(game.assets.textures.furniture_chair1, 'chair', [-40, -45, 40, 45], [128, 512]))
    game.addThing(new Furniture(game.assets.textures.furniture_chair2, 'chair', [-40, -45, 40, 45], [128, 512]))
    game.addThing(new Furniture(game.assets.textures.furniture_couch, 'couch', [-115, -46, 115, 46], [128, 512]))
    game.addThing(new Furniture(game.assets.textures.furniture_loveseat, 'loveseat', [-50, -44, 45, 41], [128, 512]))

    // Food
    game.addThing(new Furniture(game.assets.textures.furniture_food_platter, 'food_platter', [-30, -20, 30, 20], [512, 512]))
    game.addThing(new Furniture(game.assets.textures.furniture_alcohol, 'food_alcohol', [-59, -37, 59, 36], [512, 512]))
  }

  draw() {
    drawBackground({ sprite: game.assets.textures.square, depth: 1, color: [0, 0, 0] });
    drawBackground({ sprite: game.assets.textures.background_day, depth: 3 });
  }
}
