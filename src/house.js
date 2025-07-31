import * as game from 'game'
import Thing from 'thing'
import { drawBackground } from './draw.js'
import Furniture from './furniture.js'
import GuestAntonio from './guestantonio.js'
import GuestAllAround from './guest_allaround.js'
import GuestDancer from './guest_dancer.js'
import GuestDrinker from './guest_drinker.js'
import GuestIntenseGamer from './guest_intensegamer.js'
import GuestQuietGamer from './guest_quietgamer.js'

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
    if (game.keysPressed.KeyJ) {
      game.addThing(new GuestAntonio());
      game.addThing(new GuestAllAround());
      game.addThing(new GuestDancer());
      game.addThing(new GuestDrinker());
      game.addThing(new GuestIntenseGamer());
      game.addThing(new GuestQuietGamer());
    }

  }

  changePhase(phase) {
    this.game_phase = phase

    if (phase == 'placement') {
      this.addFurniture();
      this.addGuests();
    }
  }

  addFurniture() {
    // Mics
    game.addThing(new Furniture(game.assets.textures.furniture_mic, 'mic', [-7, -21, 7, 41], [33, 33]));
    game.addThing(new Furniture(game.assets.textures.furniture_mic, 'mic', [-7, -21, 7, 41], [55, 33]));
    game.addThing(new Furniture(game.assets.textures.furniture_mic, 'mic', [-7, -21, 7, 41], [77, 33]));

    // Misc.
    game.addThing(new Furniture(game.assets.textures.furniture_dancing, 'dancing', [-77, -107, 77, 101], [512, 128]));

    // Seating
    game.addThing(new Furniture(game.assets.textures.furniture_couch, 'couch', [-115, -46, 115, 46], [128, 512]));
    game.addThing(new Furniture(game.assets.textures.furniture_chair1, 'chair', [-40, -45, 40, 45], [128, 512]));
    game.addThing(new Furniture(game.assets.textures.furniture_chair2, 'chair', [-40, -45, 40, 45], [128, 512]));
    game.addThing(new Furniture(game.assets.textures.furniture_loveseat, 'chair', [-50, -44, 45, 41], [128, 512]));

    // Tables
    game.addThing(new Furniture(game.assets.textures.furniture_table1, 'table', [-105, -52, 105, 52], [128, 256]));
    game.addThing(new Furniture(game.assets.textures.furniture_table2, 'table', [-83, -64, 83, 64], [128, 512]));
    game.addThing(new Furniture(game.assets.textures.furniture_table3, 'table', [-66, -48, 66, 48], [128, 512]));

    // Food
    game.addThing(new Furniture(game.assets.textures.furniture_alcohol, 'alcohol', [-59, -37, 59, 36], [512, 512]));
    game.addThing(new Furniture(game.assets.textures.furniture_food_platter, 'food_platter', [-30, -20, 30, 20], [512, 512]));
    game.addThing(new Furniture(game.assets.textures.furniture_food_pizza, 'food_pizza', [-38, -38, 38, 38], [512, 512]));
  }

  addGuests() {
    
  }

  draw() {
    drawBackground({ sprite: game.assets.textures.square, depth: 1, color: [0, 0, 0] });
    drawBackground({ sprite: game.assets.textures.background_day, depth: 3 });
  }
}
