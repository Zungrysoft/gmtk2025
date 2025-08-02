import * as game from 'game'
import * as u from 'utils'
import * as soundmanager from 'soundmanager'
import * as vec2 from 'vector2'
import * as vec3 from 'vector3'
import Thing from 'thing'
import Tray from './tray.js'
import { drawBackground, drawSprite, drawText } from './draw.js'
import Button from './button.js'

export default class QuizCheckButton extends Thing {
  depth = 200

  constructor() {
    super()
    this.aabb = [41, 30, 238, 108];
  }

  onClick() {
    game.getThing('quiz').checkAnswer();
  }

  update() {
    let offset = [850, 400];
    this.position = vec2.add(game.getThing('quiz').position, offset)
  }

  isClickable() {
    const failedTooManyTimes = game.getThing('quiz').isCheckBlocked();
    return game.getThing('quiz')?.isEnabled && !this.isDisabled() && !failedTooManyTimes;
  }

  isDisabled() {
    const quiz = game.getThing('quiz');
    const numQuestions = game.assets.data.quizzes[quiz.currentPage]?.questions?.length ?? 0;
    let notAnsweredAll = false;
    for (let i = 0; i < numQuestions; i ++) {
      if (quiz.selectedOptions[[quiz.currentPage, i]] == undefined) {
        notAnsweredAll = true;
        break;
      }
    }
    return quiz.solvedPages[quiz.currentPage] || numQuestions === 0 || notAnsweredAll;
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
      sprite: game.assets.textures.ui_quiz_check,
      color: color,
      width: 256,
      height: 128,
      depth: this.depth,
      position: this.position,
      alpha: this.isClickable() ? 1.0 : 0.5,
    })

    
    if (game.getThing('quiz').isCheckBlocked()) {
      drawSprite({
        sprite: game.assets.textures.ui_quiz_check_block,
        color: color,
        width: 256,
        height: 128,
        depth: this.depth+1,
        position: this.position,
      })

      if (u.pointInsideAabb(...game.mouse.position, this.getAabb())) {
        drawSprite({
          sprite: game.assets.textures.ui_tooltip2,
          width: 512,
          height: 128,
          depth: 2000,
          position: vec2.add(game.mouse.position, [-256, -128]),
        })

        drawText({
          text: "Try again later.",
          color: [0.4, 0.266, 0.38],
          depth: 2000,
          scale: 0.9,
          position: vec2.add(game.mouse.position, [-198, -90]),
        })
      }
    }
  }

}
