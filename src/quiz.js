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

  constructor() {
    super();

    game.setThingName(this, 'quiz');
    // this.isEnabled = true
    this.setUpPageClickables();

    // this.leftClickable = game.addThing(new QuizClickable(this, "left", -1));
    // this.rightClickable = game.addThing(new QuizClickable(this, "right", -1));
  }

  update() {
    this.solveTime --;
    const desiredPosition = this.isEnabled ? [0, 0] : [0, -800];
    this.position = vec2.lerp(this.position, desiredPosition, 0.1);

    // Change page
    if ((game.keysPressed.KeyA || game.keysPressed.ArrowLeft) && this.currentPage > 0) {
      this.changePage(this.currentPage - 1);
    }
    if ((game.keysPressed.KeyD || game.keysPressed.ArrowRight) && this.currentPage < game.assets.data.quizzes.length - 1) {
      this.changePage(this.currentPage + 1);
    }

    // Check for correct answers
    const quiz = game.assets.data.quizzes[this.currentPage];
    if (!this.solvedPages[this.currentPage]) {
      let correctAnswers = 0;
      for (const [questionIndex, question] of quiz.questions.entries()) {
        if (this.selectedOptions[[this.currentPage, questionIndex]] == question.correctOption) {
          correctAnswers ++;
        }
      }

      if (correctAnswers >= quiz.questions.length) {
        soundmanager.playSound('solve', 0.6, 1.0);
        this.solvedPages[this.currentPage] = true;
        this.setUpPageClickables();
        this.solveTime = SOLVE_DURATION;
      }
    }
    
  }  

  changePage(page) {
    this.currentPage = page;

    // Sound

    this.solveTime = 0

    this.setUpPageClickables();
  }

  setUpPageClickables() {
    // Delete old clickables
    for (const id in this.clickables) {
      this.clickables[id].isDead = true;
      delete this.clickables[id];
    }

    // Create new clickables for buttons (unless page is solved)
    if (!this.solvedPages[this.currentPage]) {
      const quiz = game.assets.data.quizzes[this.currentPage];
      for (const questionIndex in quiz.questions) {
        for (const index in quiz.questions[questionIndex].options) {
          this.clickables[[questionIndex, index]] = game.addThing(new QuizClickable(this, questionIndex, index));
        }
        if (quiz.questions[questionIndex].audioClip) {
          this.clickables[[questionIndex, -1]] = game.addThing(new QuizClickable(this, questionIndex, -1));
        }
      }
    }
  }

  clickedButton(question, option) {
    // Play sound effect button
    if (question == 'left' && this.currentPage > 0) {
      this.changePage(this.currentPage - 1);
    }
    else if (question == 'right' && this.currentPage < game.assets.data.quizzes.length - 1) {
      this.changePage(this.currentPage + 1);
    }
    else if (option == -1) {
      // Play profile picture sound
    }
    else {
      if (this.selectedOptions[[this.currentPage, question]] != option) {
        // Sound effect
      }
      this.selectedOptions[[this.currentPage, question]] = option;
    }
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
        color: [0.4, 0.266, 0.38],
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
        color: [0.4, 0.266, 0.38]
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

        let color = [0.4, 0.266, 0.38];
        if (this.clickables[[questionIndex, index]]?.isHighlighted) {
          color = [0.65, 0.54, 0.64];
        }
        if (this.selectedOptions[[this.currentPage, questionIndex]] == index) {
          color = [0.91, 0.82, 0.90];
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
