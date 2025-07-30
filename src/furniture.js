import * as game from 'game'
import * as u from 'utils'
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
    this.position = [...position];
    this.homePosition = [...position]

    this.depth = this.mustBePlacedOn().length > 0 ? 31 : 30;
  }

  update() {
    this.isError = false;

    if (this.isBeingDragged) {
      this.position = [...game.mouse.position];

      // Rotate object
      if (game.keysPressed.KeyR || game.mouse.scrollDelta[1] < 0) {
        this.rotate();
      }
      else if (game.mouse.scrollDelta[1] > 0) {
        this.rotate(true);
      }

      // Check collision with other furniture
      if (!this.isValidPlacement()) {
        this.isError = true;
      }
    }
  }

  isValidPlacement() {
    // First, check collision with house walls to make sure furniture is placed inside the house
    for (const worldAabb of [
      [0, 0, 1280, 126],
      [0, 0, 234, 720],
      [0, 478, 463, 720],
      [0, 589, 1280, 720],
      [1039, 0, 1280, 720],
    ]) {
      if (u.checkAabbIntersection(worldAabb, this.getAabb())) {
        return false;
      }
    }

    // Placeable (food, mics, etc.)
    if (this.isPlaceable()) {
      for (const other of game.getThings().filter(t => t instanceof Furniture && t !== this && this.mustBePlacedOn().includes(t.type))) {
        const worldAabb = this.getAabb();
        let cornerCount = 0;
        for (const cornerPos of [
          [worldAabb[0], worldAabb[1]],
          [worldAabb[0], worldAabb[3]],
          [worldAabb[2], worldAabb[1]],
          [worldAabb[2], worldAabb[3]],
        ]) {
          if (u.checkAabbIntersection([...cornerPos, ...cornerPos], other.getAabb())) {
            cornerCount ++;
          }
        }
        if (cornerCount === 4) {
          return true;
        }
      }
      return false;
    }

    // Non-placeable (table, couch, etc.)
    for (const other of game.getThings().filter(t => t instanceof Furniture && t !== this && !t.isPlaceable())) {
      if (u.checkAabbIntersection(this.getAabb(), other.getAabb())) {
        return false;
      }
    }
    return true;
  }

  rotate(backwards = false) {
    if (backwards) {
      this.rotation -= 1;
      if (this.rotation === -1) {
        this.rotation = 3;
      }
    }
    else {
      this.rotation += 1;
      if (this.rotation === 4) {
        this.rotation = 0;
      }
    }
  }

  isClickable() {
    if (!this.isBeingDragged && !this.isPlaceable()) {
      for (const other of game.getThings().filter(t => t instanceof Furniture && t !== this && t.isPlaceable())) {
        if (u.checkAabbIntersection(this.getAabb(), other.getAabb())) {
          return false;
        }
      }
    }

    return true;
  }

  onClick() {
    if (this.isBeingDragged) {
      this.isBeingDragged = false;

      if (!this.isValidPlacement()) {
        this.position = [...this.homePosition];
      }
    }
    else {
      this.isBeingDragged = true;
    }
  }

  getAabb() {
    let rotatedAabb = this.aabb;
    if (this.rotation === 2) {
      rotatedAabb = [
        -this.aabb[2],
        -this.aabb[3],
        -this.aabb[0],
        -this.aabb[1],
      ]
    }
    if (this.rotation === 1) {
      rotatedAabb = [
        -this.aabb[3],
        this.aabb[0],
        -this.aabb[1],
        this.aabb[2],
      ]
    }
    if (this.rotation === 3) {
      rotatedAabb = [
        this.aabb[1],
        -this.aabb[2],
        this.aabb[3],
        -this.aabb[0],
      ]
    }

    return [
      rotatedAabb[0] + this.position[0],
      rotatedAabb[1] + this.position[1],
      rotatedAabb[2] + this.position[0],
      rotatedAabb[3] + this.position[1],
    ];
  }

  isPlaceable() {
    return this.mustBePlacedOn().length > 0;
  }

  mustBePlacedOn() {
    if (this.type.includes('food')) {
      return ['table'];
    }
    if (this.type === 'microphone') {
      return ['table', 'speakers', 'couch', 'loveseat', 'chair', 'guitar', 'tv'];
    }
    if (this.type.includes('cd')) {
      return ['speakers'];
    }
    return [];
  }

  draw() {
    let color = [1.0, 1.0, 1.0];
    if (this.isHighlighted && !this.isBeingDragged) {
      color = [1.3, 1.3, 1.3];
    }
    if (this.isError) {
      color = [1.0, 0.0, 0.0];
    }

    drawSprite({
      sprite: this.sprite,
      color: color,
      centered: true,
      width: 256,
      height: 256,
      depth: this.depth,
      rotation: Math.PI/2 * this.rotation,
      position: this.position,
    })
  }
}
