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

export const TEXT_TITLE = [0.31, 0.18, 0.30];
export const TEXT_REGULAR = [0.4, 0.266, 0.38];
export const TEXT_HIGHLIGHTED = [0.65, 0.54, 0.64];
export const TEXT_HIGHLIGHTED2 = [0.45, 0.44, 0.54];
export const TEXT_SELECTED = [0.91, 0.82, 0.90];

export default class Quiz extends Thing {
  completedQuizzes = {};
  isEnabled = false
  currentPage = 0
  depth = 100
  position = [0, -800];
  clickables = {}
  selectedOptions = {}
  solvedPages = {}
  solveTime = 0
  errorTime = 0
  failedAttempts = {}

  constructor() {
    super();

    game.setThingName(this, 'quiz');
    this.setUpPageClickables();
  }

  update() {
    this.solveTime --;
    this.errorTime --;
    const desiredPosition = this.isEnabled ? [0, 0] : [0, -800];
    this.position = vec2.lerp(this.position, desiredPosition, 0.1);

    if (game.keysPressed.KeyQ) {
      this.toggleIsEnabled();
    }

    // Change page
    if (this.isEnabled) {
      if ((game.keysPressed.KeyA || game.keysPressed.ArrowLeft) && this.currentPage > 0) {
        this.changePage(this.currentPage - 1);
      }
      if ((game.keysPressed.KeyD || game.keysPressed.ArrowRight) && this.currentPage < this.getHighestAvailablePage()) {
        this.changePage(this.currentPage + 1);
      }
    }
  }

  isCheckBlocked() {
    return (this.failedAttempts[this.currentPage] ?? 0) >= 3;
  }

  checkAnswer() {
    const quiz = game.assets.data.quizzes[this.currentPage];
    if (!quiz.questions) {
      return;
    }

    if (!this.solvedPages[this.currentPage]) {
      let correctAnswers = 0;
      for (const [questionIndex, question] of quiz.questions.entries()) {
        if (this.selectedOptions[[this.currentPage, questionIndex]] == question.correctOption || question.correctOption === "any") {
          correctAnswers ++;
        }
      }

      if (correctAnswers >= quiz.questions.length) {
        soundmanager.playSound('solve', 0.3, 1.0);
        this.solvedPages[this.currentPage] = true;
        this.setUpPageClickables();
        this.solveTime = SOLVE_DURATION;
      }
      else {
        soundmanager.playSound('bad', 0.3, 0.9);
        this.errorTime = SOLVE_DURATION;
        this.failedAttempts[this.currentPage] = (this.failedAttempts[this.currentPage] ?? 0) + 1;
      }
    }
  }

  getHighestAvailablePage() {
    // return game.assets.data.quizzes.length - 1;

    let ret = 0;
    let solvedPagesCount = Object.keys(this.solvedPages).length;
    for (const quiz of game.assets.data.quizzes) {
      if (solvedPagesCount >= quiz.unlockThreshold ?? 0) {
        ret ++;
      }
    }
    return ret - 1;
  }

  changePage(page, noSound = false) {
    this.currentPage = page;

    if (!noSound) {
      soundmanager.playSound('paper2', 0.13, [1.1, 1.3]);
    }

    this.solveTime = 0
    this.errorTime = 0

    this.setUpPageClickables();
  }

  toggleIsEnabled() {
    this.isEnabled = !this.isEnabled;
    this.setUpPageClickables();
    soundmanager.playSound('paper1', 0.2, 1.0);
  }

  setUpPageClickables() {
    // Delete old clickables
    for (const id in this.clickables) {
      this.clickables[id].isDead = true;
      delete this.clickables[id];
    }

    // Create new clickables for buttons (unless page is solved)
    if (this.isEnabled) {
      const quiz = game.assets.data.quizzes[this.currentPage];
      for (const questionIndex in quiz.questions) {
        if (!this.solvedPages[this.currentPage]) {
          for (const index in quiz.questions[questionIndex].options) {
            this.clickables[[questionIndex, index]] = game.addThing(new QuizClickable(this, questionIndex, index));
          }
        }
        if (quiz.questions[questionIndex].audioClip) {
          this.clickables[[questionIndex, -1]] = game.addThing(new QuizClickable(this, questionIndex, -1));
        }
      }
    }
  }

  clickedButton(question, option) {
    if (option == -1) {
      // Play profile picture sound
      soundmanager.playSound(game.assets.data.quizzes[this.currentPage].questions[question].audioClip.sounds, 0.3, 1.0);
    }
    else {
      if (this.selectedOptions[[this.currentPage, question]] == option) {
        soundmanager.playSound('click3', 0.4, 1.9);
        this.selectedOptions[[this.currentPage, question]] = null;
      }
      else {
        soundmanager.playSound('click3', 0.4, 1.4);
        this.selectedOptions[[this.currentPage, question]] = option;
      }
      
    }
  }

  getIsEnabled() {
    return this.isEnabled;
  }

  draw() {
    // Grey-out backdrop
    const backdropOpacity = u.map(vec2.distance(this.position, [0, 0]), 0, 300, 0.8, 0, true);
    drawBackground({
      sprite: game.assets.textures.square,
      depth: this.depth -1,
      color: [0, 0, 0],
      alpha: backdropOpacity,
    });

    // Base
    const colorScale = u.squareMap(this.solveTime, 0, SOLVE_DURATION, 1.0, 3.0, true);
    const redScale = u.squareMap(this.errorTime, 0, SOLVE_DURATION, 1.0, 0.6, true);
    drawSprite({
      sprite: game.assets.textures.ui_quiz,
      width: 1280,
      height: 720,
      color: [colorScale, colorScale * redScale, colorScale * redScale],
      depth: this.depth,
      position: this.position,
    })

    const quiz = game.assets.data.quizzes[this.currentPage];
    let top = 52;
    let left = 436;

    if (quiz.hasArt) {
      drawSprite({
        sprite: game.assets.textures.ui_gossip,
        width: 1280,
        height: 720,
        depth: this.depth+1,
        position: this.position,
      })
      top += 242
    }

    if (quiz.hasArt2) {
      drawSprite({
        sprite: game.assets.textures.ui_gossip2,
        width: 1280,
        height: 720,
        depth: this.depth+1,
        position: this.position,
      })
    }

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

    // Message
    if (quiz.message) {
      drawText({
        text: quiz.message,
        position: vec2.add(this.position, [left, top]),
        depth: this.depth + 1,
        color: TEXT_REGULAR,
      })
      top += getTextHeight(quiz.message);
    }

    // Questions:
    if (quiz.questions) {
      for (const [questionIndex, question] of quiz.questions.entries()) {
        // Title text
        if (question.title) {
          // Confirmation check mark
          if (this.solvedPages[this.currentPage]) {
            drawSprite({
              sprite: game.assets.textures.ui_checkmark,
              width: 128,
              height: 128,
              depth: this.depth + 10,
              position: vec2.add(vec2.add(this.position, [left, top]), [-74, -50]),
            })
          }

          drawText({
            text: question.title,
            position: vec2.add(this.position, [left, top]),
            depth: this.depth + 1,
            color: this.solvedPages[this.currentPage] ? TEXT_SELECTED : TEXT_TITLE,
          })
          top += getTextHeight(question.title);
        }
        else {
          top -= 24
        }

        if (question.audioClip) {
          drawSprite({
            sprite: this.solvedPages[this.currentPage] ? game.assets.textures[question.audioClip.picture] : game.assets.textures.profile_unknown,
            width: 128,
            height: 128,
            depth: this.depth + 1,
            position: vec2.add(vec2.add(this.position, [left, top]), [0, 0]),
          })

          let color = [1, 1, 1];
          if (this.clickables[[questionIndex, -1]]?.isHighlighted) {
            color = [1.3, 1.3, 1.3];
          }
          drawSprite({
            sprite: game.assets.textures.ui_play,
            width: 128,
            height: 128,
            color: color,
            depth: this.depth + 1,
            position: vec2.add(vec2.add(this.position, [left, top]), [140, 0]),
          })
          this.clickables[[questionIndex, -1]]?.setAabb(vec2.add(vec2.add(this.position, [left, top]), [140, 0]), 128, 128)

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
            color = TEXT_HIGHLIGHTED2;
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
}
