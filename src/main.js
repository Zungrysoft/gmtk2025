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
  letter_0: 'images/letter_0.png',
  letter_1: 'images/letter_1.png',
  letter_2: 'images/letter_2.png',
  letter_3: 'images/letter_3.png',
  letter_4: 'images/letter_4.png',
  letter_5: 'images/letter_5.png',
  letter_6: 'images/letter_6.png',
  letter_7: 'images/letter_7.png',
  letter_8: 'images/letter_8.png',
  letter_9: 'images/letter_9.png',
  letter_a: 'images/letter_a.png',
  letter_b: 'images/letter_b.png',
  letter_c: 'images/letter_c.png',
  letter_d: 'images/letter_d.png',
  letter_e: 'images/letter_e.png',
  letter_f: 'images/letter_f.png',
  letter_g: 'images/letter_g.png',
  letter_h: 'images/letter_h.png',
  letter_i: 'images/letter_i.png',
  letter_j: 'images/letter_j.png',
  letter_k: 'images/letter_k.png',
  letter_l: 'images/letter_l.png',
  letter_m: 'images/letter_m.png',
  letter_n: 'images/letter_n.png',
  letter_o: 'images/letter_o.png',
  letter_p: 'images/letter_p.png',
  letter_q: 'images/letter_q.png',
  letter_r: 'images/letter_r.png',
  letter_s: 'images/letter_s.png',
  letter_t: 'images/letter_t.png',
  letter_u: 'images/letter_u.png',
  letter_v: 'images/letter_v.png',
  letter_w: 'images/letter_w.png',
  letter_x: 'images/letter_x.png',
  letter_y: 'images/letter_y.png',
  letter_z: 'images/letter_z.png',
  symbol_comma: 'images/symbol_comma.png',
  symbol_period: 'images/symbol_period.png',
  symbol_exclamation_point: 'images/symbol_exclamation_point.png',
  symbol_question_mark: 'images/symbol_question_mark.png',
  symbol_hyphen: 'images/symbol_hyphen.png',
  symbol_apostraphe: 'images/symbol_apostraphe.png',
  symbol_dollar_sign: 'images/symbol_dollar_sign.png',
  symbol_semicolon: 'images/symbol_semicolon.png',
  symbol_colon: 'images/symbol_colon.png',
  number_0: 'images/number_0.png',
  number_1: 'images/number_1.png',
  number_2: 'images/number_2.png',
  number_3: 'images/number_3.png',
  number_4: 'images/number_4.png',
  number_5: 'images/number_5.png',
  number_6: 'images/number_6.png',
  number_7: 'images/number_7.png',
  number_8: 'images/number_8.png',
  number_9: 'images/number_9.png',
  number_slash: 'images/number_slash.png',
  ui_background: 'images/ui_background.png',
  ui_send: 'images/ui_send.png',
  ui_erase: 'images/ui_erase.png',
  ui_lock: 'images/ui_lock.png',
  ui_lock_particle: 'images/ui_lock_particle.png',
  ui_upgrade_particle: 'images/ui_upgrade_particle.png',
  ui_success_particle: 'images/ui_success_particle.png',
  ui_smoke_particle: 'images/ui_smoke_particle.png',
  ui_shine_particle: 'images/ui_shine_particle.png',
  ui_hint: 'images/ui_hint.png',
  ui_quit: 'images/ui_quit.png',
  ui_close: 'images/ui_close.png',
  ui_dropdown_button: 'images/ui_dropdown_button.png',
  ui_tabs_long_underline: 'images/ui_tabs_long_underline.png',
  ui_tabs_long_border: 'images/ui_tabs_long_border.png',
  ui_tabs_long_tab_act1: 'images/ui_tabs_long_tab_act1.png',
  ui_tabs_long_tab_act2: 'images/ui_tabs_long_tab_act2.png',
  ui_tabs_long_tab_act3: 'images/ui_tabs_long_tab_act3.png',
  ui_tabs_long_tab_act4: 'images/ui_tabs_long_tab_act4.png',
  menu_title: 'images/menu_title.png',
  menu_storyselect: 'images/menu_storyselect.png',
  menu_settings: 'images/menu_settings.png',
  menu_savedata: 'images/menu_savedata.png',
  menu_credits: 'images/menu_credits.png',
  background_day: 'images/background_day.png',
  furniture_test: 'images/furniture_test.png',
  furniture_food1: 'images/furniture_food1.png',
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
