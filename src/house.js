import * as game from 'game'
import * as soundmanager from 'soundmanager'
import Thing from 'thing'
import { drawBackground, drawText } from './draw.js'
import Furniture from './furniture.js'
import GuestAntonio from './guestantonio.js'
import GuestAllAround from './guest_allaround.js'
import GuestDancer from './guest_dancer.js'
import GuestDrinker from './guest_drinker.js'
import GuestIntenseGamer from './guest_intensegamer.js'
import GuestQuietGamer from './guest_quietgamer.js'
import Tray from './tray.js'
import Button from './button.js'
import QuizButton from './quizbutton.js'

export default class House extends Thing {
  isDying = false
  stripsAnimationState = 128
  type = null
  gamePhase = ''
  night = 1
  selectedMic = 0
  partyTime = 0
  furnitureTray = null;

  constructor(sprite, type) {
    super();
    this.type = type;

    game.setThingName(this, 'house');
    this.initUiElements()
    this.changePhase('placement')

    soundmanager.updateSoundPan([100000, 100000, 100000], [1, 0, 0]);
  }

  update() {
    if (this.gamePhase === 'party') {
      this.partyTime ++;

      // Spatial audio
      const selectedMicObj = game.getThings().find(x => x instanceof Furniture && x.micNumber === this.selectedMic);
      if (selectedMicObj) {
        const pos = [...selectedMicObj.position, 30];
        let lookVector = [0, -1, 0];
        if (selectedMicObj.rotation === 1) {
          lookVector = [1, 0, 0];
        }
        else if (selectedMicObj.rotation === 2) {
          lookVector = [0, 1, 0];
        }
        else if (selectedMicObj.rotation === 3) {
          lookVector = [-1, 0, 0];
        }
        soundmanager.updateSoundPan(pos, lookVector);
      }
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

  // add the trays and clickable buttons to the scene
  initUiElements() {
    game.addThing(new Tray('tray_furniture', game.assets.textures.tray_furniture, game.assets.textures.tray_furniture,
                          [200,600], [0,0], [-163,0], true, [-10,-10,-9,-9]))
    game.addThing(new Tray('tray_logs', game.assets.textures.tray_logs_open, game.assets.textures.tray_logs_closed,
                          [200,600], [1080,125], [1244,125], true, [7,34,36,79]))
    game.addThing(new Tray('tray_mics', game.assets.textures.tray_mics, game.assets.textures.tray_mics,
                          [225,125], [0,595], [0,703], true, [0,8,213,125]))                   


    game.addThing(new Button('button_pause', game.assets.textures.button_pause, game.assets.textures.button_pause,
                            [100,100], [1180,20], [1180,-100], true, [3,3,97,97]))
    game.addThing(new Button('button_skipnight', game.assets.textures.button_skipnight, game.assets.textures.button_skipnight,
                            [100,100], [1180,20], [1180,-100], false, [4,4,92,95]))
    game.addThing(new Button('button_startnight', game.assets.textures.button_startnight, game.assets.textures.button_startnight,
                            [400,100], [456,613], [456,700], true, [45,7,357,90]))

    game.addThing(new QuizButton('button_quiz', game.assets.textures.ui_quiz_open, game.assets.textures.ui_quiz_closed,
                            [256, 128], [850,0], [850,0], true, [25, 0, 232, 73]))

  }

  // hide all the placement UI for when the party starts. swap pause with skip party
  tuckUiDuringParty() {
    game.getThing('tray_furniture').setOpenState(false)
    game.getThing('tray_logs').setOpenState(false)
    game.getThing('tray_mics').setOpenState(false)
    game.getThing('button_pause').setOpenState(false)
    game.getThing('button_skipnight').setOpenState(true)
    game.getThing('button_startnight').setOpenState(false)
  }

  // show all the UI during the party so the player can place again. swap skip party with pause
  showUiForPlacement() {
    game.getThing('tray_furniture').setOpenState(true)
    game.getThing('tray_logs').setOpenState(true)
    game.getThing('tray_mics').setOpenState(true)
    game.getThing('button_pause').setOpenState(true)
    game.getThing('button_skipnight').setOpenState(false)
    game.getThing('button_startnight').setOpenState(true)
  }



  changePhase(phase) {
    this.gamePhase = phase

    if (phase == 'placement') {
      this.showUiForPlacement()
      this.addFurniture()
      this.addGuests()
    }

    if (phase == 'party') {
      this.tuckUiDuringParty();
      for (const thing of game.getThings().filter(x => x instanceof Furniture)) {
        if (!thing.isPlaced) {
          thing.isDead = true;
        }
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

  addFurniture() {
    // Mics
    game.addThing(new Furniture(game.assets.textures.furniture_mic, 'mic', [-7, -13, 7, 13], [33, 33], 0));
    game.addThing(new Furniture(game.assets.textures.furniture_mic, 'mic', [-7, -13, 7, 13], [55, 33], 1));
    game.addThing(new Furniture(game.assets.textures.furniture_mic, 'mic', [-7, -13, 7, 13], [77, 33], 2));

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
    // drawBackground({ sprite: game.assets.textures.square, depth: 1, color: [0, 0, 0] });
    drawBackground({ sprite: game.assets.textures.background_day, depth: 3 });
    drawBackground({ sprite: game.assets.textures.house_day, depth: 10 });
  }
}
