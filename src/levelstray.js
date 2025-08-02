import * as game from 'game'
import * as u from 'utils'
import * as soundmanager from 'soundmanager'
import * as vec2 from 'vector2'
import * as vec3 from 'vector3'
import Thing from 'thing'
import { drawBackground, drawSprite } from './draw.js'
import Tray from './tray.js'

export default class LevelsTray extends Tray {
  draw() {
    super.draw()


    const cutLow = game.getThing('house').cutEqLow
    const cutMid = game.getThing('house').cutEqMid
    const cutHigh = game.getThing('house').cutEqHigh

    const left = 66
    const top = 48

    const lowPos = vec2.add(this.position, [-10 + left, 5 + top])
    drawSprite({
      sprite: cutLow ? game.assets.textures.ui_levels_switch_off : game.assets.textures.ui_levels_switch,
      width: 32,
      height: 64,
      depth: this.depth + 2,
      position: lowPos,
    })
    if (game.getThing('house')?.eqClickables?.[0]) {
      game.getThing('house').eqClickables[0].setAabb(lowPos, 32, 64)
    }

    const midPos = vec2.add(this.position, [20 + left, 5 + top])
    drawSprite({
      sprite: cutMid ? game.assets.textures.ui_levels_switch_off : game.assets.textures.ui_levels_switch,
      width: 32,
      height: 64,
      depth: this.depth + 2,
      position: midPos,
    })
    if (game.getThing('house')?.eqClickables?.[1]) {
      game.getThing('house').eqClickables[1].setAabb(midPos, 32, 64)
    }

    const highPos = vec2.add(this.position, [50 + left, 5 + top])
    drawSprite({
      sprite: cutHigh ? game.assets.textures.ui_levels_switch_off : game.assets.textures.ui_levels_switch,
      width: 32,
      height: 64,
      depth: this.depth + 2,
      position: highPos,
    })
    if (game.getThing('house')?.eqClickables?.[2]) {
      game.getThing('house').eqClickables[2].setAabb(highPos, 32, 64)
    }
  }

}
