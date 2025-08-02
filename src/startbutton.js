import * as game from 'game'
import * as u from 'utils'
import * as soundmanager from 'soundmanager'
import * as vec2 from 'vector2'
import * as vec3 from 'vector3'
import Tray from './tray.js'
import { drawBackground, drawSprite, drawText } from './draw.js'
import Button from './button.js'
import Furniture from './furniture.js'

export default class StartButton extends Button {

  onClick() {
    game.getThing('house').changePhase('party');
  }

  isClickable() {
    return !game.getThings().some(x => x instanceof Furniture && x.type == 'mic' && !x.isPlaced);
  }

  draw() {
    super.draw();

    const isQuizOpen = game.getThing('quiz').getIsEnabled();
    if (!this.isClickable() && !isQuizOpen) {
      if (u.pointInsideAabb(...game.mouse.position, this.getAabb())) {
        drawSprite({
          sprite: game.assets.textures.ui_tooltip2,
          width: 512,
          height: 128,
          depth: 50,
          position: vec2.add(game.mouse.position, [-256, -128]),
        })

        drawText({
          text: "Place all three mics.",
          color: [0.4, 0.266, 0.38],
          depth: 51,
          scale: 0.9,
          position: vec2.add(game.mouse.position, [-198, -90]),
        })
      }
    }
  }
}
