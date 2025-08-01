import * as game from 'game'
import * as u from 'utils'
import * as soundmanager from 'soundmanager'
import * as vec2 from 'vector2'
import * as vec3 from 'vector3'
import Thing from 'thing'
import Tray from './tray.js'
import { drawBackground, drawSprite } from './draw.js'
import Button from './button.js'

export default class QuizArrowButton extends Thing {
  depth = 200

  constructor(isLeft) {
    super()

    this.sprite = isLeft ? game.assets.textures.ui_quiz_left : game.assets.textures.ui_quiz_right;
    this.isLeft = isLeft;
    this.aabb = [26, 32, 109, 96]
  }

  onClick() {
    const curPage = game.getThing('quiz').currentPage;
    if (this.isLeft) {
      game.getThing('quiz').changePage(curPage - 1);
    }
    else {
      game.getThing('quiz').changePage(curPage + 1);
    }
  }

  update() {
    let offset = this.isLeft ? [290, 516] : [850, 516];
    this.position = vec2.add(game.getThing('quiz').position, offset)
  }

  isClickable() {
    return game.getThing('quiz')?.isEnabled && !this.isDisabled();
  }

  isDisabled() {
    const curPage = game.getThing('quiz')?.currentPage ?? 0;

    if (this.isLeft && curPage <= 0) {
      return true;
    }
    if (!this.isLeft && curPage >= game.getThing('quiz').getHighestAvailablePage()) {
      return true;
    }

    return false;
  }

  getAabb() {
    return [
      this.aabb[0] + this.position[0],
      this.aabb[1] + this.position[1],
      this.aabb[2] + this.position[0],
      this.aabb[3] + this.position[1],
    ];
  }

  draw() {
    if (this.isDisabled()) {
      return;
    }

    const color = this.isHighlighted ? [1.3, 1.3, 1.3] : [1.0, 1.0, 1.0]

    drawSprite({
      sprite: this.sprite,
      color: color,
      width: 128,
      height: 128,
      depth: this.depth,
      position: this.position,
      alpha: this.isClickable() ? 1.0 : 0.5,
    
    })
  }

}
