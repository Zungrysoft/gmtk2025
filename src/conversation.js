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
  curSounds = []

  constructor(conversation) {
    super();
    this.conversation = conversation;

    this.playDialogue()
  }

  update() {
    this.time ++
  }

  playDialogue() {
    const endListener = () => {
      this.endConversation()
    }

    this.endListener = endListener

    for (const dialogue of this.conversation.audio) {
      const soundPos = game.getThings().find(x => x instanceof Guest && x.name === dialogue.speaker)?.position ?? [-1000, -1000];

      const snd = soundmanager.playSound('conversation_' + dialogue.sound, 0.9, 1.0, [...soundPos, 120], 1);
      this.curSounds.push(snd)

      snd.addEventListener('ended', endListener);
    }
  }

  endConversation() {
    this.isDead = true
    if (this.curSounds) {
      for (const snd of this.curSounds) {
        snd.removeEventListener('ended', this.endListener)
      }
    }
  }

  hasParticipant(participant) {
    return this.conversation.audio.map(x => x.speaker).includes(participant)
  }
}
