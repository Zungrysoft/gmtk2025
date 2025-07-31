import * as game from 'game'
import * as webgl from 'webgl'
import * as soundmanager from 'soundmanager'
import House from './house.js'
import Selector from './selector.js'

document.title = 'Into the Loop'
game.setWidth(1280)
game.setHeight(720)
game.createCanvases();
const { ctx } = game
ctx.save()
ctx.fillStyle = 'white'
ctx.font = 'italic bold 64px Arial'
ctx.fillText('Loading...', 64, game.getHeight() - 64)
ctx.restore()

game.assets.images = await game.loadImages({
  square: 'images/square.png',
  background_day: 'images/ui/ui_layout_sample.png',
  furniture_food1: 'images/furniture_food1.png',
  furniture_table1: 'images/furniture/furniture_table1.png',
  furniture_table2: 'images/furniture/furniture_table2.png',
  furniture_table3: 'images/furniture/furniture_table3.png',
  furniture_couch: 'images/furniture/furniture_couch.png',
  furniture_loveseat: 'images/furniture/furniture_loveseat.png',
  furniture_chair1: 'images/furniture/furniture_chair1.png',
  furniture_chair2: 'images/furniture/furniture_chair2.png',
  furniture_food_platter: 'images/furniture/furniture_food_platter.png',
  furniture_food_pizza: 'images/furniture/furniture_food_pizza.png',
  furniture_alcohol: 'images/furniture/furniture_alcohol.png',
  furniture_dancing: 'images/furniture/furniture_dj.png',
})

game.assets.data = await game.loadJson({
  stories: 'data/stories.json',
  words_orth: 'data/words_orth.json',
  answers_orth_brother: 'data/answers_orth_brother.json',
  words_long: 'data/words_long.json',
  answers_long_act1: 'data/answers_long_act1.json',
  answers_long_act2: 'data/answers_long_act2.json',
  answers_long_act3: 'data/answers_long_act3.json',
  answers_long_act4: 'data/answers_long_act4.json',
})

game.assets.sounds = await game.loadAudio({
  click1: 'sounds/click1.wav',
  click2: 'sounds/click2.wav',
  click3: 'sounds/click3.wav',
  swipe: 'sounds/swipe.wav',
  swoosh1: 'sounds/swoosh1.wav',
  discover: 'sounds/discover.wav',
  break2: 'sounds/break2.wav',
  break5: 'sounds/break5.wav',
  collect: 'sounds/collect.wav',
  impact1: 'sounds/impact1.wav',
  newword1: 'sounds/newword1.wav',
  newword2: 'sounds/newword2.wav',
  newword3: 'sounds/newword3.wav',
  error: 'sounds/error.wav',
  block: 'sounds/block.wav',
  talk: 'sounds/talk.wav',
  hate: 'sounds/hate.wav',
  hate2: 'sounds/hate2.wav',
  hint: 'sounds/hint.wav',
  menubutton: 'sounds/menubutton.wav',
  musicchange: 'sounds/musicchange.wav',

  music1: 'sounds/track1.flac',
  music2: 'sounds/track2.flac',
  music3: 'sounds/track3.flac',
})
soundmanager.setSoundsTable(game.assets.sounds)

game.assets.textures = Object.fromEntries(
  Object.entries(game.assets.images).map(([name, image]) => [
    name, webgl.createTexture(image)
  ])
)

game.setScene(() => {
  // Global things
  game.addThing(new House());
  game.addThing(new Selector());

  // Camera setup
  game.getCamera3D().lookVector = [0, 0, -1];
  game.getCamera3D().upVector = [0, 1, 0];
  game.getCamera3D().near = 0.01;
  game.getCamera3D().isOrtho = true;
  game.getCamera3D().updateMatrices();
  game.getCamera3D().setUniforms();
})
