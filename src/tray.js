import * as game from 'game'
import * as u from 'utils'
import * as soundmanager from 'soundmanager'
import * as vec2 from 'vector2'
import * as vec3 from 'vector3'
import Thing from 'thing'
import { drawBackground, drawSprite } from './draw.js'

export default class Tray extends Thing {
  openSprite = null
  closedSprite = null
  openPosition = null
  closedPosition = null
  defaultOpen = true
  isOpen = true
  isTransitioningOpen = false
  isTransitioningClosed = false
  size = [100,100]


  constructor(trayName, openSprite, closedSprite, size, openPosition, closedPosition, defaultOpen, toggleButtonAABB) {
    super()
    this.depth = 10 // draw on top of everything
    game.setThingName(this, trayName)
    this.openSprite = openSprite
    this.closedSprite = closedSprite
    this.size = [...size]
    this.openPosition = [...openPosition]
    this.closedPosition = [...closedPosition]
    this.defaultOpen = defaultOpen
    this.isOpen = defaultOpen
    this.aabb = toggleButtonAABB
    

    if (defaultOpen) {
      this.sprite = this.openSprite
      this.position = this.openPosition
    }
    else {
      this.sprite = this.closedSprite
      this.position = this.closedPosition
    }
    
  }


  toggleOpenState() {
    this.setOpenState(!this.isOpen)
  }

  setOpenState (open) {
    if (open) {
      this.isOpen = true
      this.sprite = this.openSprite
      this.isTransitioningOpen = true
    }
    else { 
      this.isOpen = false
      this.sprite = this.closedSprite
      this.isTransitioningClosed = true
    }
  }


  // tray is only not clickable if the party is currently happening or if it's in the middle of animating open/close
  isClickable() {
    if (game.getThing('house')?.gamePhase == 'party') return false
    if (this.isTransitioningClosed || this.isTransitioningOpen) return false
    return true
  }


  // the aabb is used as a proxy for the toggle open/closed button
  getAabb() {
    return [
      this.aabb[0] + this.position[0],
      this.aabb[1] + this.position[1],
      this.aabb[2] + this.position[0],
      this.aabb[3] + this.position[1],
    ];
  }

  onClick() {
    if (!this.isTransitioningClosed && !this.isTransitioningOpen) this.toggleOpenState()
  }

  draw() {

    // debug for placing the toggle clickbox
    // drawSprite({
    //   sprite: game.assets.textures.square,
    //   centered: false,
    //   width: this.getAabb()[2] - this.getAabb()[0],
    //   height: this.getAabb()[3] - this.getAabb()[1],
    //   depth: 1000,
    //   position: [this.getAabb()[0], this.getAabb()[1]],
    //   alpha: 0.3,
    // })


    drawSprite({
      sprite: this.sprite,
      width: this.size[0],
      height: this.size[1],
      depth: this.depth,
      position: this.position,
    
    })
  }


  update() {

    // if requested interpolate the tray's position. stop interpolation when it arrives
    if (this.isTransitioningOpen) {
      this.position = vec2.lerp(this.position, this.openPosition, 0.15)
      if (vec2.distance(this.position, this.openPosition) < 1) {
        this.position = this.openPosition
        this.isTransitioningOpen = false
      }
    }
    if (this.isTransitioningClosed) {
      this.position = vec2.lerp(this.position, this.closedPosition, 0.15)
      if (vec2.distance(this.position, this.closedPosition) < 1) {
        this.position = this.closedPosition
        this.isTransitioningClosed = false
      }
    }
  }

}
