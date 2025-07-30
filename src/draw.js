import * as game from 'game'
import * as matrix from 'matrices'
import * as webgl from 'webgl'
import * as u from 'utils'

export function drawSprite({
  sprite,
  color = [1.0, 1.0, 1.0],
  alpha = 1.0,
  position = [0, 0],
  width = 32,
  height = 32,
  depth = 100,
  centered = false,
  rotation = 0,
  stripsAnimationState = 256,
} = {}) {
  webgl.setTexture(sprite)
  webgl.set('color', [...color, alpha])
  webgl.set('stripsAnimationState', stripsAnimationState)
  webgl.set('modelMatrix', matrix.getTransformation({
    position: [
      u.map(position[0] + (centered ? 0 : width/2), 0, game.getWidth(), -1, 1),
      u.map(position[1] + (centered ? 0 : height/2), 0, game.getHeight(), 1, -1),
      convertDepth(depth),
    ],
    scale: rotation === Math.PI * 0.5 || rotation === Math.PI * 1.5 ? [-height / game.getHeight(), width / game.getWidth(), 1.0] : [width / game.getWidth(), -height / game.getHeight(), 1.0],
    rotation: [0, 0, rotation],
  }))

  webgl.drawScreen()
}

export function drawBackground({
  sprite,
  color = [1.0, 1.0, 1.0],
  alpha = 1.0,
  depth = 2,
  stripsAnimationState = 256,
} = {}) {
  const dSprite = sprite ?? game.assets.textures.square;

  webgl.setTexture(dSprite)
  webgl.set('color', [...color, alpha])
  webgl.set('stripsAnimationState', stripsAnimationState)
  webgl.set('modelMatrix', matrix.getTransformation({
    position: [0, 0, convertDepth(depth)],
    scale: [1.0, -1.0, 1.0],
  }))

  webgl.drawScreen()
}

function convertDepth(depth) {
  const near = game.getCamera3D().near;
  const far = game.getCamera3D().far;

  if (depth <= 0) {
    return far
  }
  return -(near + (1.0 / depth) * (far - near));
}