import * as game from 'game'
import * as webgl from 'webgl'
import * as soundmanager from 'soundmanager'
import House from './house.js'
import Selector from './selector.js'
import Quiz from './quiz.js'
import QuizArrowButton from './quizarrowbutton.js'
import QuizCheckButton from './quizcheckbutton.js'
import RecallPanel from './recallpanel.js'
import Tutorial from './tutorial.js'

document.title = 'Girl Gossip: Revelations'
game.setWidth(1280)
game.setHeight(720)
game.createCanvases();
const { ctx } = game
ctx.save()
ctx.fillStyle = 'white'
ctx.font = 'italic bold 64px Arial'
ctx.fillText('Loading audio...', 64, game.getHeight() - 128)
ctx.font = 'italic bold 48px Arial'
ctx.fillText('(this may take a minute or so)', 64, game.getHeight() - 64)
ctx.restore()

let fontData = {};
for (const char of "abcdefghijklmnopqrstuvwxyz") {
  fontData["letter_lower_" + char] = 'images/font/letter_lower_' + char + '.png';
  fontData["letter_upper_" + char] = 'images/font/letter_upper_' + char + '.png';
}
for (const symbol of ['comma', 'period', 'exclamation_point', 'question_mark', 'colon', 'apostraphe']) {
  fontData["letter_symbol_" + symbol] = 'images/font/letter_symbol_' + symbol + '.png';
}
for (let i = 0; i < 10; i ++) {
  fontData["letter_number_" + i.toString()] = 'images/font/letter_number_' + i.toString() + '.png';
}

game.assets.images = await game.loadImages({
  square: 'images/square.png',
  tray_furniture: 'images/ui/ui_tray_furniture.png',
  tray_logs: 'images/ui/ui_tray_logs.png',
  tray_mics: 'images/ui/ui_tray_mics.png',
  button_pause: 'images/ui/ui_button_pause.png',
  button_options: 'images/ui/ui_button_options.png',
  button_skipnight: 'images/ui/ui_button_skipnight.png',
  button_startnight: 'images/ui/ui_button_startnight.png',
  house_day: 'images/ui/ui_house_day.png',
  house_night: 'images/ui/ui_house_night.png',
  background_day: 'images/ui/ui_background_day.png',
  background_night: 'images/ui/ui_background_night.png',
  background_pause: 'images/ui/ui_background_pause.png',

  furniture_table1: 'images/furniture/furniture_table1.png',
  furniture_table2: 'images/furniture/furniture_table2.png',
  furniture_table3: 'images/furniture/furniture_table3.png',
  furniture_icon_table3: 'images/furniture/furniture_icon_table3.png',
  furniture_couch: 'images/furniture/furniture_couch.png',
  furniture_loveseat: 'images/furniture/furniture_loveseat.png',
  furniture_chair1: 'images/furniture/furniture_chair1.png',
  furniture_chair2: 'images/furniture/furniture_chair2.png',
  furniture_icon_chair1: 'images/furniture/furniture_icon_chair.png',
  furniture_food_platter: 'images/furniture/furniture_food_platter.png',
  furniture_icon_food_platter: 'images/furniture/furniture_icon_food_platter.png',
  furniture_food_pizza: 'images/furniture/furniture_food_pizza.png',
  furniture_icon_food_pizza: 'images/furniture/furniture_icon_food_pizza.png',
  furniture_alcohol: 'images/furniture/furniture_alcohol.png',
  furniture_icon_alcohol: 'images/furniture/furniture_icon_alcohol.png',
  furniture_dancing: 'images/furniture/furniture_dj.png',
  furniture_icon_dancing: 'images/furniture/furniture_icon_dj.png',
  furniture_guitar: 'images/furniture/furniture_guitar.png',
  furniture_icon_guitar: 'images/furniture/furniture_icon_guitar.png',
  furniture_game: 'images/furniture/furniture_game.png',
  furniture_icon_game: 'images/furniture/furniture_icon_game.png',
  furniture_mic: 'images/furniture/furniture_mic.png',
  furniture_mic_a: 'images/furniture/furniture_mic_a.png',
  furniture_mic_b: 'images/furniture/furniture_mic_b.png',
  furniture_mic_c: 'images/furniture/furniture_mic_c.png',
  furniture_mic_selected: 'images/furniture/furniture_mic_selected.png',
  furniture_mic_loudness: 'images/furniture/furniture_mic_loudness.png',
  furniture_disabled: 'images/furniture/furniture_disabled.png',

  ui_quiz: 'images/ui/ui_quiz.png',
  ui_checkmark: 'images/ui/ui_checkmark.png',
  ui_quiz_open: 'images/ui/ui_quiz_open.png',
  ui_quiz_close: 'images/ui/ui_quiz_close.png',
  ui_quiz_left: 'images/ui/ui_quiz_left.png',
  ui_quiz_right: 'images/ui/ui_quiz_right.png',
  ui_quiz_check: 'images/ui/ui_quiz_check.png',
  ui_quiz_check_block: 'images/ui/ui_quiz_check_block.png',
  ui_tooltip: 'images/ui/ui_tooltip.png',
  ui_tooltip2: 'images/ui/ui_tooltip2.png',
  ui_levels: 'images/ui/ui_levels.png',
  ui_levels_switch: 'images/ui/ui_levels_switch.png',
  ui_levels_switch_off: 'images/ui/ui_levels_switch_off.png',
  ui_recall: 'images/ui/ui_recall.png',
  ui_number: 'images/ui/ui_number.png',
  ui_play: 'images/ui/ui_play.png',
  ui_walking_man_1: 'images/ui/walking_man_1.png',
  ui_walking_man_2: 'images/ui/walking_man_2.png',
  ui_gossip: 'images/ui/ui_gossip.png',
  ui_gossip2: 'images/ui/ui_gossip2.png',

  profile_jimmy: 'images/profile/profile_jimmy.png',
  profile_sam: 'images/profile/profile_sam.png',
  profile_laura: 'images/profile/profile_laura.png',
  profile_zoe: 'images/profile/profile_zoe.png',
  profile_taylor: 'images/profile/profile_taylor.png',
  profile_alfonso: 'images/profile/profile_alfonso.png',

  tutorial_bg: 'images/ui/ui_tutorial_background.png',
  tutorial_rightbutton: 'images/ui/ui_button_tutorial_right.png',
  tutorial_leftbutton: 'images/ui/ui_button_tutorial_left.png',
  tutorial_text1: 'images/ui/ui_tutorial_text1.png',
  tutorial_text2: 'images/ui/ui_tutorial_text2.png',
  tutorial_text3: 'images/ui/ui_tutorial_text3.png',
  tutorial_text4: 'images/ui/ui_tutorial_text4.png',
  tutorial_text5: 'images/ui/ui_tutorial_text5.png',
  tutorial_text6: 'images/ui/ui_tutorial_text6.png',
  tutorial_text7: 'images/ui/ui_tutorial_text7.png',
  mainmenu_bg: 'images/ui/ui_mainmenu_background.png',
  mainmenu_title: 'images/ui/ui_mainmenu_title.png',
  mainmenu_button: 'images/ui/ui_mainmenu_button.png',

  profile_unknown: 'images/profile/profile_unknown.png',

  ...fontData,
})

game.assets.data = await game.loadJson({
  conversations: 'data/conversations_data_new.json',
  comments: 'data/comments.json',
  quizzes: 'data/quizzes.json',
})

const allConversations = [...game.assets.data.conversations, ...Object.values(game.assets.data.comments)]
const conversationAudioStrings = allConversations.flatMap(c => c.audio.map(a => a.sound))
let conversationAudio = {};
for (const aString of conversationAudioStrings) {
  conversationAudio['conversation_' + aString] = 'sounds/conversations/' + aString + '.wav';
}

// Sounds that will be played in 3D-space simulation
const foleySounds = {
  footstep_shoes_1: 'sounds/footsteps/footstep_shoes_1.wav',
  footstep_shoes_2: 'sounds/footsteps/footstep_shoes_2.wav',
  footstep_shoes_3: 'sounds/footsteps/footstep_shoes_3.wav',
  footstep_flipflops_1: 'sounds/footsteps/footstep_flipflops_1.wav',
  footstep_flipflops_2: 'sounds/footsteps/footstep_flipflops_2.wav',
  footstep_flipflops_3: 'sounds/footsteps/footstep_flipflops_3.wav',
  footstep_barefoot_1: 'sounds/footsteps/footstep_barefoot_1.wav',
  footstep_barefoot_2: 'sounds/footsteps/footstep_barefoot_2.wav',
  footstep_barefoot_3: 'sounds/footsteps/footstep_barefoot_3.wav',

  foley_outdoor_ambience: 'sounds/foley/outdoor_ambience.wav',
  foley_guitar_1: 'sounds/foley/guitar1.wav',
  foley_guitar_2: 'sounds/foley/guitar2.wav',
  foley_guitar_3: 'sounds/foley/guitar3.wav',
  foley_guitar_4: 'sounds/foley/guitar4.wav',
  foley_guitar_pick_up: 'sounds/foley/guitar_pick_up.wav',
  foley_guitar_put_down: 'sounds/foley/guitar_put_down.wav',
  foley_alcohol_1: 'sounds/foley/alcohol_1.wav',
  foley_alcohol_2: 'sounds/foley/alcohol_2.wav',
  foley_alcohol_3: 'sounds/foley/alcohol_3.wav',
  foley_chair_sit_1: 'sounds/foley/chair_sit_1.wav',
  foley_chair_sit_2: 'sounds/foley/chair_sit_2.wav',
  foley_chair_sit_3: 'sounds/foley/chair_sit_3.wav',
  foley_chair_stand_1: 'sounds/foley/chair_stand_1.wav',
  foley_chair_stand_2: 'sounds/foley/chair_stand_2.wav',
  foley_chair_stand_3: 'sounds/foley/chair_stand_3.wav',
  foley_game_1: 'sounds/foley/game_1.wav',
  foley_game_2: 'sounds/foley/game_2.wav',
  foley_game_3: 'sounds/foley/game_3.wav',
  foley_game_4: 'sounds/foley/game_4.wav',
  foley_game_5: 'sounds/foley/game_5.wav',
  foley_game_6: 'sounds/foley/game_6.wav',
  foley_game_7: 'sounds/foley/game_7.wav',
  foley_game_8: 'sounds/foley/game_8.wav',
  foley_food_platter_1: 'sounds/foley/food_platter_1.wav',
  foley_food_platter_2: 'sounds/foley/food_platter_2.wav',
  foley_food_platter_3: 'sounds/foley/food_platter_3.wav',
  foley_food_platter_4: 'sounds/foley/food_platter_4.wav',
  foley_food_platter_5: 'sounds/foley/food_platter_5.wav',
  foley_food_platter_6: 'sounds/foley/food_platter_6.wav',
  foley_club_music_left: 'sounds/foley/annoying_club_music_left.wav',
  // foley_club_music_right: 'sounds/foley/annoying_club_music_right.wav',
};

game.assets.sounds = await game.loadAudio({
  click1: 'sounds/click1.wav',
  click2: 'sounds/click2.wav',
  click3: 'sounds/click3.wav',
  swipe: 'sounds/swipe.wav',
  error: 'sounds/error.wav',
  block: 'sounds/block.wav',
  move1: 'sounds/move1.wav',
  move2: 'sounds/move2.wav',
  select: 'sounds/select.wav',
  solve: 'sounds/solve2.wav',
  bad: 'sounds/bad.wav',
  paper1: 'sounds/paper1.wav',
  paper2: 'sounds/paper2.wav',
  recall: 'sounds/recall.wav',

  intro_alfonso_1: 'sounds/intro/intro_alfonso_1.wav',
  intro_alfonso_2: 'sounds/intro/intro_alfonso_2.wav',
  intro_alfonso_3: 'sounds/intro/intro_alfonso_3.wav',
  intro_jimmy_1: 'sounds/intro/intro_jimmy_1.wav',
  intro_jimmy_2: 'sounds/intro/intro_jimmy_2.wav',
  intro_jimmy_3: 'sounds/intro/intro_jimmy_3.wav',
  intro_taylor_1: 'sounds/intro/intro_taylor_1.wav',
  intro_taylor_2: 'sounds/intro/intro_taylor_2.wav',
  intro_taylor_3: 'sounds/intro/intro_taylor_3.wav',
  intro_sam_1: 'sounds/intro/intro_sam_1.wav',
  intro_sam_2: 'sounds/intro/intro_sam_2.wav',
  intro_sam_3: 'sounds/intro/intro_sam_3.wav',
  intro_laura_1: 'sounds/intro/intro_laura_1.wav',
  intro_laura_2: 'sounds/intro/intro_laura_2.wav',
  intro_laura_3: 'sounds/intro/intro_laura_3.wav',
  intro_zoe_1: 'sounds/intro/intro_zoe_1.wav',
  intro_zoe_2: 'sounds/intro/intro_zoe_2.wav',
  intro_zoe_3: 'sounds/intro/intro_zoe_3.wav',

  ...conversationAudio,
  ...foleySounds,

  music1: 'sounds/track1.flac',
  music2: 'sounds/track2.flac',
  music3: 'sounds/track3.flac',
})
soundmanager.setSoundsTable(game.assets.sounds)

const positionalSounds = [
  ...conversationAudioStrings.map(x => 'conversation_' + x),
  ...Object.keys(foleySounds),
]
soundmanager.configurePositionalSound(positionalSounds);

game.assets.textures = Object.fromEntries(
  Object.entries(game.assets.images).map(([name, image]) => [
    name, webgl.createTexture(image)
  ])
)

game.setScene(() => {
  // Global things
  game.addThing(new Selector());
  game.addThing(new House());
  game.addThing(new Quiz());
  game.addThing(new QuizArrowButton(true));
  game.addThing(new QuizArrowButton(false));
  game.addThing(new QuizCheckButton());
  game.addThing(new RecallPanel());
  game.addThing(new Tutorial());

  game.globals.soundWave = [0, 0, 0, 0, 0, 0, 0, 0]

  // Camera setup
  game.getCamera3D().lookVector = [0, 0, -1];
  game.getCamera3D().upVector = [0, 1, 0];
  game.getCamera3D().near = 0.01;
  game.getCamera3D().isOrtho = true;
  game.getCamera3D().updateMatrices();
  game.getCamera3D().setUniforms();
})
