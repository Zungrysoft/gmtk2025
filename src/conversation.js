import * as game from 'game'
import * as u from 'utils'
import * as vec2 from 'vector2'
import * as soundmanager from 'soundmanager'
import Thing from 'thing'
import Furniture from './furniture.js'
import { drawSprite } from './draw.js'
import Guest from './guest.js'

export default class Conversation extends Thing {
  time = 0

  constructor(conversation) {
    super();
    this.conversation = conversation;

    this.dialogueLine = 0;
    this.playDialogue(0)
  }

  update() {
    this.time ++
  }

  playDialogue() {
    const dialogue = this.conversation.audio[this.dialogueLine];
    const soundPos = game.getThings().find(x => x instanceof Guest && x.name === dialogue.speaker)?.position ?? [-1000, -1000];

    this.curSound = soundmanager.playSound('conversation_' + dialogue.sound, 0.66, 1.0, [...soundPos, 120], 1);
    this.curSound.addEventListener('ended', () => {
      this.moveToNextDialogue();
    });
  }

  moveToNextDialogue() {
    if (this.isDead) {
      return;
    }

    this.dialogueLine ++

    // Conversation
    if (this.dialogueLine >= this.conversation.audio.length) {
      this.isDead = true;
      return;
    }
    
    this.playDialogue();
  }
}
