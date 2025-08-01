import * as game from 'game'
import * as u from 'utils'
import * as soundmanager from 'soundmanager'
import * as vec2 from 'vector2'
import * as vec3 from 'vector3'
import Thing from 'thing'
import { drawBackground, drawSprite, drawText, getTextHeight } from './draw.js'
import Guest from './guest.js'
import QuizClickable from './quizclickable.js'

const SOLVE_DURATION = 30;

const TEXT_REGULAR = [0.4, 0.266, 0.38];
const TEXT_HIGHLIGHTED = [0.65, 0.54, 0.64];
const TEXT_SELECTED = [0.91, 0.82, 0.90];

export default class Title extends Thing {
  stage = 0

  constructor() {
    super();
  }

  

  draw() {
    // Grey-out backdrop
    const backdropOpacity = u.map(vec2.distance(this.position, [0, 0]), 0, 300, 0.3, 0, true);
    drawBackground({
      sprite: game.assets.textures.square,
      depth: this.depth -1,
      color: [0, 0, 0],
      alpha: backdropOpacity,
    });

    // Base
    const colorScale = u.squareMap(this.solveTime, 0, SOLVE_DURATION, 1.0, 3.0, true);
    drawSprite({
      sprite: game.assets.textures.ui_quiz,
      width: 1280,
      height: 720,
      color: [colorScale, colorScale, colorScale],
      depth: this.depth,
      position: this.position,
    })

    const quiz = game.assets.data.quizzes[this.currentPage];
    let top = 52;
    let left = 436;

    // Hint
    if (quiz.hint) {
      let bottom = 673 - (getTextHeight(quiz.hint) * 0.6);
      drawText({
        text: quiz.hint,
        position: vec2.add(this.position, [left, bottom]),
        depth: this.depth + 1,
        color: TEXT_REGULAR,
        scale: 0.6,
      })
    }

    // Questions:
    for (const [questionIndex, question] of quiz.questions.entries()) {
      // Confirmation check mark
      if (this.solvedPages[this.currentPage]) {
        drawSprite({
          sprite: game.assets.textures.ui_checkmark,
          width: 128,
          height: 128,
          depth: this.depth + 2,
          position: vec2.add(vec2.add(this.position, [left, top]), [-74, -50]),
        })
      }

      // Title text
      drawText({
        text: question.title,
        position: vec2.add(this.position, [left, top]),
        depth: this.depth + 1,
        color: this.solvedPages[this.currentPage] ? TEXT_SELECTED : TEXT_REGULAR,
      })
      top += getTextHeight(question.title);

      if (question.audio_clip) {

        drawSprite({
          sprite: game.assets.textures.profile_unknown,
          width: 128,
          height: 128,
          depth: this.depth + 1,
          position: vec2.add(vec2.add(this.position, [left, top]), [0, 0]),
        })

        top += 102
      }

      top += 24

      for (const [index, option] of question.options.entries()) {
        const offset = [
          Math.floor(index % question.optionColumns) * Math.floor(405 / question.optionColumns),
          Math.floor(index / question.optionColumns) * 32,
        ]
 
        let color = TEXT_REGULAR;
        if (this.clickables[[questionIndex, index]]?.isHighlighted) {
          color = TEXT_HIGHLIGHTED;
        }
        if (this.selectedOptions[[this.currentPage, questionIndex]] == index) {
          color = TEXT_SELECTED;
        }

        drawText({
          text: option,
          position: vec2.add(vec2.add(this.position, [left, top]), offset),
          depth: this.depth + 1,
          color: color,
          scale: 0.8,
        })

        // Set aabb for the relevant clickable
        this.clickables[[questionIndex, index]]?.setAabb(vec2.add(vec2.add(this.position, [left, top]), offset), option.length * 18, 28)
      }
      top += Math.ceil(question.options.length / question.optionColumns) * 32;

      // Margin
      top += 24
    }
  }
}
