import * as game from 'game'
import * as u from 'utils'
import * as soundmanager from 'soundmanager'
import * as vec2 from 'vector2'
import * as vec3 from 'vector3'
import Thing from 'thing'
import { drawBackground, drawSprite, drawText, getTextHeight } from './draw.js'
import TutorialButton from './tutorialbuttons.js'
import TutorialText from './tutorialtext.js'
import AudioCheck from './audiocheck.js'

export default class Tutorial extends Thing {
  stage = 0
  depth = 100
  constructor() {
    super();
    game.setThingName(this, 'tutorial')
    
    game.addThing(new TutorialButton('mainmenu_button', true, true, game.assets.textures.mainmenu_button, 201))
    game.addThing(new TutorialText('mainmenu_background', game.assets.textures.mainmenu_bg, 200))
    game.addThing(new TutorialText('mainmenu_title', game.assets.textures.mainmenu_title, 201))

    game.addThing(new TutorialButton('tutorial_button_forward', true, false, game.assets.textures.ui_quiz_right, -1))
    game.addThing(new TutorialButton('tutorial_button_backward', false, false, game.assets.textures.ui_quiz_left, -1))
    game.addThing(new TutorialText('tutorial_text1', game.assets.textures.tutorial_text1, 99))
    game.addThing(new TutorialText('tutorial_text2', game.assets.textures.tutorial_text2, 99))
    game.addThing(new TutorialText('tutorial_text3', game.assets.textures.tutorial_text3, 99))
    game.addThing(new TutorialText('tutorial_text4', game.assets.textures.tutorial_text4, 99))
    game.addThing(new TutorialText('tutorial_text5', game.assets.textures.tutorial_text5, 99))
    game.addThing(new TutorialText('tutorial_text6', game.assets.textures.tutorial_text6, 99))
    game.addThing(new TutorialText('tutorial_text7', game.assets.textures.tutorial_text7, 99))
  }

  draw() {
    drawSprite({ // draw tutorial background
      sprite: game.assets.textures.tutorial_bg,
      width: 1280,
      height: 720,
      depth: this.depth,
    
    })

    // if(this.stage === 0) {

    // }

    if (this.stage === 1) {
      if (game.getThing('mainmenu_button')) {
        game.getThing('mainmenu_button').isDead = true
      }
      if (game.getThing('mainmenu_background')) {
        game.getThing('mainmenu_background').isDead = true
      }
      if (game.getThing('mainmenu_title')) {
        game.getThing('mainmenu_title').isDead = true
      }

      game.getThing('tutorial_button_forward').depth = 101
      game.getThing('tutorial_text1').depth = 101
      game.getThing('tutorial_text2').depth = 99
    }
    if (this.stage === 2) {
      game.getThing('tutorial_button_backward').depth = 101
      game.getThing('tutorial_text1').depth = 99
      game.getThing('tutorial_text2').depth = 101
      game.getThing('tutorial_text3').depth = 99
    }if (this.stage === 3) {
      game.getThing('tutorial_text2').depth = 99
      game.getThing('tutorial_text3').depth = 101
      game.getThing('tutorial_text4').depth = 99
    }if (this.stage === 4) {
      game.getThing('tutorial_text3').depth = 99
      game.getThing('tutorial_text4').depth = 101
      game.getThing('tutorial_text5').depth = 99
    }if (this.stage === 5) {
      game.getThing('tutorial_text4').depth = 99
      game.getThing('tutorial_text5').depth = 101
      game.getThing('tutorial_text6').depth = 99
    }if (this.stage === 6) {
      game.getThing('tutorial_text5').depth = 99
      game.getThing('tutorial_text6').depth = 101
      game.getThing('tutorial_text7').depth = 99
    }
    if (this.stage === 7) {
      game.getThing('tutorial_text6').depth = 99
      game.getThing('tutorial_text7').depth = 101
    }


    if (this.stage === 8) {
      game.getThing('house').changePhase('placement')

      game.getThing('tutorial_text1').isDead = true
      game.getThing('tutorial_text2').isDead = true
      game.getThing('tutorial_text3').isDead = true
      game.getThing('tutorial_text4').isDead = true
      game.getThing('tutorial_text5').isDead = true
      game.getThing('tutorial_text6').isDead = true
      game.getThing('tutorial_text7').isDead = true
      game.getThing('tutorial_button_forward').isDead = true
      game.getThing('tutorial_button_backward').isDead = true
      game.getThing('tutorial').isDead = true
      
    }
  }
}
