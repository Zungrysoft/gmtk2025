import * as game from 'game'
import * as soundmanager from 'soundmanager'
import Thing from 'thing'
import { drawBackground, drawText } from './draw.js'
import Furniture from './furniture.js'
import Guest from './guest.js'
import GuestHungry from './guest_hungry.js'
import GuestAllAround from './guest_allaround.js'
import GuestDancer from './guest_dancer.js'
import GuestDrinker from './guest_drinker.js'
import GuestIntenseGamer from './guest_intensegamer.js'
import GuestQuietGamer from './guest_quietgamer.js'
import Tray from './tray.js'
import Button from './button.js'
import QuizButton from './quizbutton.js'
import StartButton from './startbutton.js'
import SkipButton from './skipbutton.js'
import PauseButton from './pausebutton.js'
import PauseMenu from './pausemenu.js'
import Tutorial from './tutorial.js'
import WalkingMan from './walkingman.js'
import Reminder from './reminder.js'
import Conversation from './conversation.js'
import LevelsTray from './levelstray.js'
import QuizClickable from './quizclickable.js'

export default class House extends Thing {
  isDying = false
  stripsAnimationState = 128
  type = null
  gamePhase = 'start'
  night = 0
  selectedMic = 0
  partyTime = 0
  nightOverlayAlpha = 0
  furnitureTray = null

  qTime = 120

  cutEqLow = false
  cutEqMid = false
  cutEqHigh = false
  eqClickables = {}


  constructor(sprite, type) {
    super();
    this.type = type;

    game.setThingName(this, 'house')
    this.initUiElements()
    
  }

  clickedButton(ind) {
    if (ind === 0) {
      this.cutEqLow = !this.cutEqLow
    }
    if (ind === 1) {
      this.cutEqMid = !this.cutEqMid
    }
    if (ind === 2) {
      this.cutEqHigh = !this.cutEqHigh
    }

    soundmanager.playSound('click2', 0.1, 1.4)

    for (const { eqLow, eqMid, eqHigh } of game.globals.audioSources) {
      eqLow.gain.value = this.cutEqLow ? -30 : 0;
      eqMid.gain.value = this.cutEqMid ? -30 : 0;
      eqHigh.gain.value = this.cutEqHigh ? -30 : 0;
    }
  }

  getIsEnabled() {
    return true
  }

  setUpEqClickables() {
    this.eqClickables[0] = game.addThing(new QuizClickable(this, 0, -1));
    this.eqClickables[1] = game.addThing(new QuizClickable(this, 1, -1));
    this.eqClickables[2] = game.addThing(new QuizClickable(this, 2, -1));
  }

  deleteEqClickables() {
    for (const id in this.eqClickables) {
      this.eqClickables[id].isDead = true;
      delete this.eqClickables[id];
    }
  }

  update() {
    if (this.gamePhase === 'party') {
      this.partyTime ++;
      this.nightOverlayAlpha = Math.min(1, this.nightOverlayAlpha + 1/60)

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

      // Check for party end
      if (this.partyTime > 700 && game.getThings().filter(x => x instanceof Guest && x.hasEntered).length === 0) {
        this.changePhase('placement')
      }
    }
    else {
      this.nightOverlayAlpha = Math.max(0, this.nightOverlayAlpha - 1/60)

      if (this.night === 2 && !game.getThing('quiz').isEnabled) {
        this.qTime --
        if (this.qTime === 0) {
          this.qTime --
          game.addThing(new Reminder("What if you set up\n   the party differently?"))
        }
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

      // Randomize mics
      if (game.keysPressed.KeyL) {
        for (const furniture of game.getThings().filter(x => x instanceof Furniture && x.type === 'mic')) {
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

  // add the trays and clickable buttons to the scene
  initUiElements() {
    game.addThing(new Tray('tray_furniture', game.assets.textures.tray_furniture, game.assets.textures.tray_furniture,
                          [200,600], [0,0], [-200,0], false, [-10,-10,-9,-9]))
    game.addThing(new Tray('tray_mics', game.assets.textures.tray_mics, game.assets.textures.tray_mics,
                          [225,125], [0,595], [0,703], false, [0,8,213,125]))
    game.addThing(new LevelsTray('tray_levels', game.assets.textures.ui_levels, game.assets.textures.ui_levels,
                          [512, 128], [384,720-128], [384,720], false, [0, 0, 512, 128]))                              


    // game.addThing(new PauseButton('button_pause', game.assets.textures.button_pause, game.assets.textures.button_pause,
    //                             [100,100], [1170,20], [1170,-100], true, [3,3,97,97]))
    game.addThing(new SkipButton('button_skipnight', game.assets.textures.button_skipnight, game.assets.textures.button_skipnight,
                                [100,100], [1070,20], [1070,-100], false, [4,4,92,95]))
    game.addThing(new StartButton('button_startnight', game.assets.textures.button_startnight, game.assets.textures.button_startnight,
                                [400,100], [456,613], [456,730], false, [45,7,357,90]))
                            

    game.addThing(new QuizButton('button_quiz', game.assets.textures.ui_quiz_open, game.assets.textures.ui_quiz_closed,
                                [256, 128], [165,0], [165,-128], false, [25, 0, 232, 73]))

    // game.addThing(new PauseMenu())

  }

  // hide all the placement UI for when the party starts
  tuckUi(showSkipButton) {
    game.getThing('tray_furniture').setOpenState(false)
    game.getThing('tray_mics').setOpenState(false)
    if (showSkipButton) game.getThing('button_skipnight').setOpenState(true)
    else                game.getThing('button_skipnight').setOpenState(false)
    game.getThing('button_startnight').setOpenState(false)
    game.getThing('tray_levels').setOpenState(true)
  }

  // show all the UI during the party so the player can place again
  showUi() {
    game.getThing('tray_furniture').setOpenState(true)
    game.getThing('tray_mics').setOpenState(true)
    game.getThing('button_skipnight').setOpenState(false)
    game.getThing('button_startnight').setOpenState(true)
    game.getThing('tray_levels').setOpenState(false)
  }



  changePhase(phase, noSound = false) {
    this.gamePhase = phase

    if (phase == 'placement') {
      this.night ++
      if (this.night === 2) {
        game.getThing('quiz').toggleIsEnabled()
        game.getThing('quiz').changePage(0, true)
      }

      if (this.night > 1) {
        soundmanager.stopAll()
      }

      if (!noSound) {
        soundmanager.playSound('swipe', 0.3, 1.0);
      }

      this.deleteEqClickables();

      // Reset quiz failed attempts
      game.getThing('quiz').failedAttempts = {}
      
      this.showUi()
      for (const thing of game.getThings().filter(x => x instanceof Guest)) {
        thing.isDead = true
      }
      
      for (const thing of game.getThings().filter(x => x instanceof Furniture)) {
        thing.isDead = true
      }

      for (const thing of game.getThings().filter(x => x instanceof Conversation)) {
        thing.endConversation()
      }
      this.addFurniture()
    }

    if (phase == 'party') {
      game.getThing('recall').addMemory(this.night)

      if (this.night === 1) {
        game.addThing(new Reminder("Listen for voices...\n   Listen for names..."))
      }

      this.setUpEqClickables();
      
      this.addGuests()
      if (!noSound) {
        soundmanager.playSound('swipe', 0.3, 0.8);
      }
      this.tuckUi(true)
      for (const thing of game.getThings().filter(x => x instanceof Furniture)) {
        if (!thing.isPlaced) {
          thing.isDead = true
        }
        else {
          thing.startAmbientSounds();
        }
      }
      // Ambient outdoor sounds
      soundmanager.playSound('foley_outdoor_ambience', 0.7, 1.0, [409, 481, 120]);

      this.selectedMic = 0
      this.partyTime = 0
    }
  }

  addFurniture() {
    // Mics
    game.addThing(new Furniture(game.assets.textures.furniture_mic, 'mic', 0, [-7, -13, 7, 13], [65, 690], 0));
    game.addThing(new Furniture(game.assets.textures.furniture_mic, 'mic', 1, [-7, -13, 7, 13], [105, 690], 1));
    game.addThing(new Furniture(game.assets.textures.furniture_mic, 'mic', 2, [-7, -13, 7, 13], [145, 690], 2));

    // Seating
    game.addThing(new Furniture(game.assets.textures.furniture_chair1, 'chair', 3, [-40, -45, 40, 45], [33, 173], null, game.assets.textures.furniture_icon_chair1));
    game.addThing(new Furniture(game.assets.textures.furniture_chair2, 'chair', 4, [-40, -45, 40, 45], [75, 173], null, game.assets.textures.furniture_icon_chair1));
    game.addThing(new Furniture(game.assets.textures.furniture_loveseat, 'chair', 5, [-50, -44, 45, 41], [142, 170], null, game.assets.textures.furniture_icon_loveseat));
    game.addThing(new Furniture(game.assets.textures.furniture_couch, 'couch', 6, [-115, -46, 115, 46], [120, 220], null, game.assets.textures.furniture_icon_couch));

    // Tables
    game.addThing(new Furniture(game.assets.textures.furniture_table1, 'table', 7, [-105, -52, 105, 52], [27, 72], null, game.assets.textures.furniture_icon_table1));
    game.addThing(new Furniture(game.assets.textures.furniture_table2, 'table', 8, [-83, -64, 83, 64], [87, 74], null, game.assets.textures.furniture_icon_table2));
    game.addThing(new Furniture(game.assets.textures.furniture_table3, 'table', 9, [-66, -48, 66, 48], [143, 77], null, game.assets.textures.furniture_icon_table3));

    // Food
    game.addThing(new Furniture(game.assets.textures.furniture_alcohol, 'alcohol', 10, [-59, -37, 59, 36], [39, 356], null, game.assets.textures.furniture_icon_alcohol));
    game.addThing(new Furniture(game.assets.textures.furniture_food_platter, 'food_platter', 11, [-30, -20, 30, 20], [128, 332], null, game.assets.textures.furniture_icon_food_platter));
    game.addThing(new Furniture(game.assets.textures.furniture_food_pizza, 'food_pizza', 12, [-38, -38, 38, 38], [42, 257], null, game.assets.textures.furniture_icon_food_pizza));

    // Misc.
    game.addThing(new Furniture(game.assets.textures.furniture_game, 'game', 13, [-38, -38, 38, 38], [123, 550], null, game.assets.textures.furniture_icon_game));
    game.addThing(new Furniture(game.assets.textures.furniture_dancing, 'dancing', 14, [-77, -107, 77, 101], [38, 469], null, game.assets.textures.furniture_icon_dancing));
    game.addThing(new Furniture(game.assets.textures.furniture_guitar, 'guitar', 15, [-27, -46, 27, 46], [121, 426], null, game.assets.textures.furniture_icon_guitar));

  }

  addGuests() {
    game.addThing(new GuestHungry());
    game.addThing(new GuestAllAround());
    game.addThing(new GuestDancer());
    game.addThing(new GuestDrinker());
    game.addThing(new GuestIntenseGamer());
    game.addThing(new GuestQuietGamer());
  }

  draw() {
    // drawBackground({ sprite: game.assets.textures.square, depth: 1, color: [0, 0, 0] });
    
    
    drawBackground({ sprite: game.assets.textures.background_day, depth: 3 });
    drawBackground({ sprite: game.assets.textures.background_night, depth: 5, alpha: this.nightOverlayAlpha });
    drawBackground({ sprite: game.assets.textures.house_day, depth: 10 });
    drawBackground({ sprite: game.assets.textures.house_night, depth: 12, alpha: this.nightOverlayAlpha });
  }
}
