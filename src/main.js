import * as game from 'game'
import * as webgl from 'webgl'
import * as soundmanager from 'soundmanager'
import House from './house.js'
import Selector from './selector.js'
import Quiz from './quiz.js'

document.title = 'In the Loop'
game.setWidth(1280)
game.setHeight(720)
game.createCanvases();
const { ctx } = game
ctx.save()
ctx.fillStyle = 'white'
ctx.font = 'italic bold 64px Arial'
ctx.fillText('Loading...', 64, game.getHeight() - 64)
ctx.restore()

let fontData = {};
for (const char of "abcdefghijklmnopqrstuvwxyz") {
  fontData["letter_lower_" + char] = 'images/font/letter_lower_' + char + '.png';
  fontData["letter_upper_" + char] = 'images/font/letter_upper_' + char + '.png';
}
for (const symbol of ['comma', 'period', 'exclamation_point', 'question_mark', 'colon']) {
  fontData["letter_symbol_" + symbol] = 'images/font/letter_symbol_' + symbol + '.png';
}

game.assets.images = await game.loadImages({
  square: 'images/square.png',
  tray_furniture: 'images/ui/ui_tray_furniture.png',
  tray_logs_open: 'images/ui/ui_tray_logs_open.png',
  tray_logs_closed: 'images/ui/ui_tray_logs_closed.png',
  tray_mics: 'images/ui/ui_tray_mics.png',
  button_pause: 'images/ui/ui_button_pause.png',
  button_skipnight: 'images/ui/ui_button_skipnight.png',
  button_startnight: 'images/ui/ui_button_startnight.png',
  house_day: 'images/ui/ui_house_day.png',
  background_day: 'images/ui/ui_background_day.png',
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
  furniture_mic: 'images/furniture/furniture_mic.png',
  furniture_mic_a: 'images/furniture/furniture_mic_a.png',
  furniture_mic_b: 'images/furniture/furniture_mic_b.png',
  furniture_mic_c: 'images/furniture/furniture_mic_c.png',
  furniture_mic_selected: 'images/furniture/furniture_mic_selected.png',
  furniture_mic_loudness: 'images/furniture/furniture_mic_loudness.png',
  ui_quiz: 'images/ui/ui_quiz.png',
  ui_checkmark: 'images/ui/ui_checkmark.png',
  ui_quiz_open: 'images/ui/ui_quiz_open.png',
  ui_quiz_close: 'images/ui/ui_quiz_close.png',

  profile_unknown: 'images/profile/profile_unknown.png',

  ...fontData,
})

game.assets.data = await game.loadJson({
  conversations: 'data/conversations.json',
  quizzes: 'data/quizzes.json',
})

const conversationAudioStrings = game.assets.data.conversations.flatMap(c => c.audio.map(a => a.sound))
let conversationAudio = {};
for (const aString of conversationAudioStrings) {
  conversationAudio['conversation_' + aString] = 'sounds/conversations/' + aString + '.wav';
}

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
  move1: 'sounds/move1.wav',
  move2: 'sounds/move2.wav',
  select: 'sounds/select.wav',
  solve: 'sounds/solve2.wav',

  ...conversationAudio,

  footstep1: 'sounds/footsteps/footstep1.wav',
  footstep2: 'sounds/footsteps/footstep2.wav',
  footstep3: 'sounds/footsteps/footstep3.wav',

  music1: 'sounds/track1.flac',
  music2: 'sounds/track2.flac',
  music3: 'sounds/track3.flac',
})
soundmanager.setSoundsTable(game.assets.sounds)

const positionalSounds = [
  ...conversationAudioStrings.map(x => 'conversation_' + x),
  'footstep1',
  'footstep2',
  'footstep3',
]
soundmanager.configurePositionalSound(positionalSounds);

game.assets.textures = Object.fromEntries(
  Object.entries(game.assets.images).map(([name, image]) => [
    name, webgl.createTexture(image)
  ])
)

game.setScene(() => {
  // Global things
  game.addThing(new House());
  game.addThing(new Selector());
  game.addThing(new Quiz());

  // Camera setup
  game.getCamera3D().lookVector = [0, 0, -1];
  game.getCamera3D().upVector = [0, 1, 0];
  game.getCamera3D().near = 0.01;
  game.getCamera3D().isOrtho = true;
  game.getCamera3D().updateMatrices();
  game.getCamera3D().setUniforms();
})
