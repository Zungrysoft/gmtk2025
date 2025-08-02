import * as game from 'game'
import * as u from 'utils'
import * as soundmanager from 'soundmanager'
import * as vec2 from 'vector2'
import * as vec3 from 'vector3'
import Tray from './tray.js'
import { drawBackground, drawSprite } from './draw.js'
import Button from './button.js'

export default class QuizButton extends Button {
  depth = 105

  onClick() {
    game.getThing('quiz').toggleIsEnabled();
  }

  update() {
    super.update();

    this.isOpen = this.isVisible();
    this.sprite = game.getThing('quiz')?.isEnabled ? game.assets.textures.ui_quiz_close : game.assets.textures.ui_quiz_open;
  }

  isVisible() {
    return !game.getThing('tutorial');
  }

  isClickable() {
    return this.isVisible()
  }

  // draw() {
  //   if (this.isVisible()) {
  //     super.draw();
  //   }
  // }
}
