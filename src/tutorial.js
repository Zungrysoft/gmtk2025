import * as game from 'game'
import * as u from 'utils'
import * as soundmanager from 'soundmanager'
import * as vec2 from 'vector2'
import * as vec3 from 'vector3'
import Thing from 'thing'
import { drawBackground, drawSprite, drawText, getTextHeight } from './draw.js'
import TutorialButton from './tutorialbuttons.js'
import TutorialText from './tutorialtext.js'

export default class Tutorial extends Thing {
  stage = 0

  constructor() {
    super();
    game.setThingName(this, 'tutorial')
    game.addThing(new TutorialButton('tutorial_button_forward',true,game.assets.textures.tutorial_rightbutton))
    game.addThing(new TutorialButton('tutorial_button_backward',false,game.assets.textures.tutorial_leftbutton))
    game.addThing(new TutorialText('tutorial_text1', game.assets.textures.tutorial_text1))
    game.addThing(new TutorialText('tutorial_text2', game.assets.textures.tutorial_text2))
    game.addThing(new TutorialText('tutorial_text3', game.assets.textures.tutorial_text3))
    game.addThing(new TutorialText('tutorial_text4', game.assets.textures.tutorial_text4))
    game.addThing(new TutorialText('tutorial_text5', game.assets.textures.tutorial_text5))
    game.addThing(new TutorialText('tutorial_text6', game.assets.textures.tutorial_text6))
    game.getThing('house').tuckUi(false)
  }

  draw() {
    drawSprite({
      sprite: game.assets.textures.tutorial_bg,
      width: 1280,
      height: 720,
      depth: 100
    
    })

    if (this.stage === 0) {
      game.getThing('tutorial_button_backward').depth = 99
      game.getThing('tutorial_text1').depth = 101
      game.getThing('tutorial_text2').depth = 99
    }
    if (this.stage === 1) {
      game.getThing('tutorial_button_backward').depth = 101
      game.getThing('tutorial_text1').depth = 99
      game.getThing('tutorial_text2').depth = 101
      game.getThing('tutorial_text3').depth = 99
    }if (this.stage === 2) {
      game.getThing('tutorial_text2').depth = 99
      game.getThing('tutorial_text3').depth = 101
      game.getThing('tutorial_text4').depth = 99
    }if (this.stage === 3) {
      game.getThing('tutorial_text3').depth = 99
      game.getThing('tutorial_text4').depth = 101
      game.getThing('tutorial_text5').depth = 99
    }if (this.stage === 4) {
      game.getThing('tutorial_text4').depth = 99
      game.getThing('tutorial_text5').depth = 101
      game.getThing('tutorial_text6').depth = 99
    }if (this.stage === 5) {
      game.getThing('tutorial_text5').depth = 99
      game.getThing('tutorial_text6').depth = 101
    }


    if (this.stage === 6) {
      game.getThing('house').showUi()

      game.getThing('tutorial_text1').isDead = true
      game.getThing('tutorial_text2').isDead = true
      game.getThing('tutorial_text3').isDead = true
      game.getThing('tutorial_text4').isDead = true
      game.getThing('tutorial_text5').isDead = true
      game.getThing('tutorial_text6').isDead = true
      game.getThing('tutorial_button_forward').isDead = true
      game.getThing('tutorial_button_backward').isDead = true
      game.getThing('tutorial').isDead = true
    }
  }
}
