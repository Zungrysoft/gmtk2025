import * as game from 'game'
import * as u from 'utils'
import * as soundmanager from 'soundmanager'
import * as vec2 from 'vector2'
import * as vec3 from 'vector3'
import Thing from 'thing'
import { drawBackground, drawSprite } from './draw.js'

export default class Furniture extends Thing {
  placed = false
  rotation = 0
  isBeingDragged = false

  constructor(sprite, type, aabb, position, micNumber) {
    super();
    this.sprite = sprite;
    this.type = type;
    this.aabb = aabb;
    this.position = [...position];
    this.homePosition = [...position];
    this.micNumber = micNumber;

    this.depth = this.mustBePlacedOn().length > 0 ? 31 : 30;
    if (type === 'mic') {
      this.depth = 50;
    }
  }

  update() {
    this.isError = false;
    this.scale = 1.0;

    if (this.isBeingDragged) {
      this.position = [...game.mouse.position];

      // Rotate object
      if (game.keysPressed.KeyR || game.mouse.rightClick || game.mouse.scrollDelta[1] < 0) {
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
    else {
      if (!this.isPlaced) {
        this.scale = 0.6;
        this.position = vec2.lerp(this.position, this.homePosition, 0.2)
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
      // First, check not colliding with other placeables
      for (const other of game.getThings().filter(t => t instanceof Furniture && t !== this && t.isPlaceable())) {
        if (u.checkAabbIntersection(this.getAabb(), other.getAabb())) {
          return false;
        }
      }

      // Second, check that it's on top of a valid surface
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

    soundmanager.playSound('move2', 0.2, 1.0);
  }

  isClickable() {
    if (game.getThing('house')?.gamePhase !== 'placement') {
      if (game.getThing('house')?.gamePhase === 'party' && this.type === 'mic' && game.getThing('house')?.selectedMic !== this.micNumber) {
        return true;
      }
      return false;
    }

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
    if (game.getThing('house')?.gamePhase === 'party' && this.type === 'mic') {
      game.getThing('house').selectedMic = this.micNumber;
      soundmanager.playSound('select', 0.2, 1.3);
      return;
    }

    if (this.isBeingDragged) {
      this.isBeingDragged = false;
      
      this.isPlaced = this.isValidPlacement();
      if (this.isPlaced) {
        soundmanager.playSound('move1', 0.2, 1.0);
      }
      else {
        this.rotation = 0;
        soundmanager.playSound('swipe', 0.2, 1.0);
      }
    }
    else {
      this.isBeingDragged = true;
      this.isPlaced = false;

      soundmanager.playSound('move1', 0.2, 1.3);
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

    let scaledAabb = rotatedAabb.map((x) => x * this.scale)

    return [
      scaledAabb[0] + this.position[0],
      scaledAabb[1] + this.position[1],
      scaledAabb[2] + this.position[0],
      scaledAabb[3] + this.position[1],
    ];
  }

  isPlaceable() {
    return this.mustBePlacedOn().length > 0;
  }

  mustBePlacedOn() {
    if (this.type.includes('food') || this.type === 'alcohol') {
      return ['table'];
    }
    if (this.type === 'mic') {
      return ['table', 'dancing', 'jazz', 'couch', 'chair', 'guitar', 'tv'];
    }
    return [];
  }

  draw() {
    let color = [1.0, 1.0, 1.0];
    if (this.isHighlighted && !this.isBeingDragged) {
      color = [1.3, 1.3, 1.3];
    }
    if (this.isError) {
      color = [1.0, 0.1, 0.1];
    }

    drawSprite({
      sprite: this.sprite,
      color: color,
      centered: true,
      width: 256 * this.scale,
      height: 256 * this.scale,
      depth: this.depth,
      rotation: Math.PI/2 * this.rotation,
      position: this.position,
    })

    if (this.micNumber != null) {
      let sprite = game.assets.textures["furniture_mic_a"];
      if (this.micNumber === 1) {
        sprite = game.assets.textures["furniture_mic_b"];
      }
      else if (this.micNumber === 2) {
        sprite = game.assets.textures["furniture_mic_c"];
      }

      let offset = [0, 0];
      if (this.rotation === 1 || this.rotation === 3) {
        offset = [-16, -20]
      }

      drawSprite({
        sprite: sprite,
        color: color,
        centered: true,
        width: 256 * this.scale,
        height: 256 * this.scale,
        depth: this.depth,
        rotation: 0,
        position: vec2.add(this.position, offset),
      })

      if (game.getThing('house').gamePhase === 'party') {
        // Selection indicator
        if (game.getThing('house').selectedMic === this.micNumber) {
          const scale = u.map(Math.sin(game.getThing('house').partyTime / 10), -1, 1, 1.0, 1.3);
          drawSprite({
            sprite: game.assets.textures.furniture_mic_selected,
            centered: true,
            width: 256 * this.scale * scale,
            height: 256 * this.scale * scale,
            depth: this.depth + 1,
            position: this.position,
          })
        }

        // Loudness indicator
        let total = 0;

        for (const { analyser, panner } of game.globals.audioSources) {
          const dataArray = new Uint8Array(analyser.fftSize);
          analyser.getByteTimeDomainData(dataArray);

          let sumSquares = 0;
          for (let i = 0; i < dataArray.length; i++) {
            const val = (dataArray[i] - 128) / 128;
            sumSquares += val * val;
          }

          const rms = Math.sqrt(sumSquares / dataArray.length);

          if (rms < 0.015) {
            continue;
          }

          const dist = vec3.distance([panner.positionX.value, panner.positionZ.value, panner.positionY.value], [...this.position, 128]);
          const scalar = Math.max(2.0, dist / 30)**(-2);

          total += rms * scalar;
        }

        let loudnessScale = (total**0.5) * 2048;
        drawSprite({
          sprite: game.assets.textures.furniture_mic_loudness,
          centered: true,
          width: loudnessScale,
          height: loudnessScale,
          depth: this.depth + 2,
          position: this.position,
        })
      }
    }
  }
}
