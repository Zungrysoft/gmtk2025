import * as game from 'game'
import Thing from 'thing'
import { drawBackground, drawSprite } from './draw.js'

export default class Furniture extends Thing {
  placed = false
  rotation = 0
  isBeingDragged = false

  constructor(sprite, type, aabb, position) {
    super();
    this.sprite = sprite;
    this.type = type;
    this.aabb = aabb;
    this.position = position;
  }

  update() {
    if (this.isBeingDragged) {
      this.position = [...game.mouse.position];
    }
  }

  rotate() {
    this.rotation += 1
  }

  isClickable() {
    return true;
  }

  onClick() {
    this.isBeingDragged = !this.isBeingDragged;
    console.log(this.isBeingDragged)
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
    drawSprite({
      sprite: this.sprite,
      color: this.isError ? [1.0, 0.0, 0.0] : [1.0, 1.0, 1.0],
      centered: true,
      width: 256,
      height: 256,
      depth: 30,
      rotation: Math.PI/2 * this.rotation,
      position: this.position,
    })
  }
}
