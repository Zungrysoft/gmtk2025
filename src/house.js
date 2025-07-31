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
  gamePhase = ''
  night = 1
  selectedMic = 0
  partyTime = 0

  constructor(sprite, type) {
    super();
    this.type = type;

    game.setThingName(this, 'house');

    this.changePhase('placement')
  }

  update() {
    if (this.gamePhase === 'party') {
      this.partyTime ++;
    }


    if (game.keysDown.ShiftLeft) {
      if (game.keysPressed.KeyJ) {
        this.changePhase('party')
      } 

      // Randomize room structure
      if (game.keysPressed.KeyK) {
        for (let i = 0; i < 100; i ++) {
          for (const furniture of game.getThings().filter(x => x instanceof Furniture)) {
            if (furniture.isValidPlacement()) {
              continue;
            }

            for (let j = 0; j < 1000; j ++) {
              furniture.position = [Math.random() * 837 + 220, Math.random() * 461 + 117];
              furniture.rotation = Math.floor(Math.random() * 4)
              if (furniture.isValidPlacement()) {
                furniture.isPlaced = true;
                break;
              }
            }
          }
        }
      }
      
    }
    

  }

  changePhase(phase) {
    this.gamePhase = phase

    if (phase == 'placement') {
      this.addFurniture();
      this.addGuests();
    }

    if (phase == 'party') {
      for (const thing of game.getThings().filter(x => x instanceof Furniture)) {
        if (!thing.isPlaced) {
          thing.isDead = true;
        }

        this.selectedMic = 0
        this.partyTime = 0

        game.addThing(new GuestAntonio());
        // game.addThing(new GuestAllAround());
        game.addThing(new GuestDancer());
        // game.addThing(new GuestDrinker());
        // game.addThing(new GuestIntenseGamer());
        // game.addThing(new GuestQuietGamer());
      }
    }
  }

  addFurniture() {
    // Mics
    game.addThing(new Furniture(game.assets.textures.furniture_mic, 'mic', [-7, -21, 7, 41], [33, 33], 0));
    game.addThing(new Furniture(game.assets.textures.furniture_mic, 'mic', [-7, -21, 7, 41], [55, 33], 1));
    game.addThing(new Furniture(game.assets.textures.furniture_mic, 'mic', [-7, -21, 7, 41], [77, 33], 2));

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
