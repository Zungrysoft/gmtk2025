import * as game from 'game'
import * as u from 'utils'
import * as soundmanager from 'soundmanager'
import * as vec2 from 'vector2'
import * as vec3 from 'vector3'
import Thing from 'thing'
import { drawBackground, drawSprite, drawText, getTextHeight } from './draw.js'
import Guest from './guest.js'
import QuizClickable from './quizclickable.js'
import Furniture from './furniture.js'
import { TEXT_HIGHLIGHTED, TEXT_REGULAR } from './quiz.js'

const SOLVE_DURATION = 30

export default class RecallPanel extends Thing {
  depth = 70
  position = [3000, 0];
  clickables = {}
  solveTime = 0
  memory = []

  constructor() {
    super();

    game.setThingName(this, 'recall');
    this.setUpPageClickables();
  }

  getIsEnabled() {
    return this.getIsOpen() && !game.getThing('quiz').getIsEnabled();
  }

  getIsOpen() {
    return game.getThing('house').gamePhase === 'placement' && (game.getThing('house').night ?? 0) >= 3;
  }

  update() {
    this.solveTime --;
    const desiredPosition = this.getIsOpen() ? [1080, 120] : [1280, 120];
    this.position = vec2.lerp(this.position, desiredPosition, 0.1);
  }

  addMemory(night) {
    let memoryObj = {
      text: night % 100,
      placements: [],
    };

    // For each placed furniture, add it to memory
    game.getThings().filter(x => x instanceof Furniture && x.isPlaced).forEach(x => memoryObj.placements.push({
      id: x.id,
      position: [...x.position],
      rotation: x.rotation,
    }))

    this.memory.push(memoryObj);

    if (this.memory.length > 9*3) {
      this.memory.shift()
    }

    // Now reset clickables
    this.setUpPageClickables();
  }

  recall(id) {
    soundmanager.playSound('recall', 0.08, 1.2);
    this.solveTime = SOLVE_DURATION;

    let memoryObj = this.memory?.[id]
    if (!memoryObj) {
      return;
    }

    // Start by unplacing all existing furniture
    game.getThings().filter(x => x instanceof Furniture).forEach(x => x.isPlaced = false)

    // Place furniture
    for (const placement of memoryObj.placements) {
      const furnitureObj = game.getThings().find(x => x instanceof Furniture && x.id === placement.id)

      if (!furnitureObj) {
        continue
      }
      furnitureObj.position = placement.position
      furnitureObj.rotation = placement.rotation
      furnitureObj.isPlaced = true
    }
  }

  setUpPageClickables() {
    // Delete old clickables
    for (const id in this.clickables) {
      this.clickables[id].isDead = true;
      delete this.clickables[id];
    }

    // Create new clickables for buttons
    for (const i in this.memory) {
      this.clickables[i] = game.addThing(new QuizClickable(this, i, -1));
    }
  }

  clickedButton(i) {
    this.recall(i);
  }

  draw() {
    // Base
    const colorScale = u.squareMap(this.solveTime, 0, SOLVE_DURATION, 1.0, 3.0, true);
    drawSprite({
      sprite: game.assets.textures.ui_recall,
      width: 200,
      height: 600,
      color: [colorScale, colorScale, colorScale],
      depth: this.depth,
      position: this.position,
    })

    for (const [i, memoryObj] of this.memory.entries()) {
      const offset = [
        Math.floor(i % 3) * 56 + 26,
        Math.floor(i / 3) * 56 + 68,
      ]

      // Box
      drawSprite({
        sprite: game.assets.textures.ui_number,
        width: 64,
        height: 64,
        depth: this.depth + 1,
        position: vec2.add(this.position, offset),
      })

      // Number
      let color = TEXT_REGULAR;
      if (this.clickables[i]?.isHighlighted) {
        color = TEXT_HIGHLIGHTED;
      }
      drawText({
        text: memoryObj.text,
        position: vec2.add(vec2.add(this.position, offset), [memoryObj.text.toString().length > 1 ? 5 : 15, 15]),
        depth: this.depth + 10,
        color: color,
      })

      this.clickables[i]?.setAabb(vec2.add(this.position, offset), 56, 56);
    }
  }
}
