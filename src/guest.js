import * as game from 'game'
import * as u from 'utils'
import * as vec2 from 'vector2'
import * as soundmanager from 'soundmanager'
import Thing from 'thing'
import Furniture from './furniture.js'
import { drawSprite, drawText } from './draw.js'
import Conversation from './conversation.js'
import WalkingMan from './walkingman.js'

const CONVERSATION_RADIUS = 130
const TALK_RADIUS = CONVERSATION_RADIUS * 2.1

export default class Guest extends Thing {
  // Config
  name = "unnamed"
  hunger = 0
  maxDrunkedness = 1
  arrivalTime = 0
  speedMultiplier = 1.0
  activityOffset = [0, 0]
  likes_dancing = 10
  likes_relax = 10
  likes_food_pizza = 10
  likes_food_platter = 10
  likes_game = 10
  likes_alcohol = 10
  shoeType = 'shoes'

  // Variables
  drunkedness = 0
  currentActivity = null;
  activityTime = 0;
  position = [405, 465];
  activityCompletions = {};
  footstepTime = 1.0;
  timeToWait = 60 * 10;
  discussedInfoKeys = {}
  activitiesDone = 0

  constructor() {
    super();
  }

  update() {
    // Spawn animation of entering the party
    if (this.enteringTime === 95) {
      game.addThing(new WalkingMan(false))
    }

    if (this.enteringTime == null) {
      this.enteringTime = this.arrivalTime;
    }
    if (this.enteringTime > 0) {
      this.enteringTime --;
      return;
    }

    this.hasEntered = true

    this.inTransit = false;

    // if (this.isInConversation()) {
    //   this.activityTime --;
    //   this.beenDoingActivityFor ++;
    //   this.activityFoley();
    //   return;
    // }

    let activityPosition = this.activityFurniture?.position
    if (activityPosition) {
      activityPosition = vec2.add(activityPosition, vec2.scale(this.activityOffset, 0.5));
    }
    else {
      activityPosition = [405, 465];
    }
    if (this.currentActivity) {
      // Walk toward activity
      const dist = vec2.distance(this.position, activityPosition)
      const moveSpeed = 2 * this.speedMultiplier;
      if (dist > moveSpeed * 1.1) {
        const vel = vec2.scale(vec2.normalize(vec2.subtract(activityPosition, this.position)), moveSpeed);
        this.position = vec2.add(this.position, vel);
        this.conversationTime = 120;
        this.inTransit = true;

        this.footstepTime -= 0.03 * this.speedMultiplier;
        if (this.footstepTime <= 0) {
          this.footstepTime = 1.0;
          soundmanager.playSound([
            `footstep_${this.shoeType}_1`,
            `footstep_${this.shoeType}_2`,
            `footstep_${this.shoeType}_3`,
          ], this.shoeType === 'flipflops' ? 0.4 : 0.6, 1.0, [...this.position, 0]);
        }
      }
      else {
        // Snap to final position and do activity
        this.position = [...activityPosition];

        this.activityTime --;
        this.beenDoingActivityFor ++;
        this.activityFoley();
        if (this.activityTime <= 0 && !this.isInConversation()) {
          this.finishActivity();
        }

        this.conversationTime --;
        if (this.conversationTime <= 0 && this.canHaveConversation()) {
          this.startConversation();
        }
        
      }
      
    }
    else {
      this.decideCurrentActivity()
    }
  }

  getActivityDuration() {
    if (this.currentActivity === 'guitar') {
      return 2200;
    }

    if (this.currentActivity === 'leave') {
      return 60*4;
    }

    if (this.currentActivity === 'alcohol') {
      return 1600;
    }

    if (this.currentActivity === 'relax') {
      return 1400;
    }

    return 1700;
  }

  activityFoley() {
    if (!this.currentActivity) {
      return;
    }

    if (this.currentActivity === 'leave' && this.beenDoingActivityFor === 10) {
      

      // Make sure we have a comment
      let commentStr = `${this.name}-leave`
      if (this.isDrunkard && this.drunkedness > 0 && game.assets.data.comments[commentStr + '-drunk']) {
        commentStr += '-drunk'
      }
      else if (this.leftInDisgust && game.assets.data.comments[commentStr + '-disgust']) {
        commentStr += '-disgust'
      }
      else if (game.getThing('house').partyTime < (60 * 20) && game.assets.data.comments[commentStr + '-early']) {
        commentStr += '-early'
      }

      if (game.assets.data.comments[commentStr]) {
        // Don't interrupt
        const otherGuests = game.getThings().filter(x => x instanceof Guest);
        let tooClose = false
        for (const otherGuest of otherGuests) {
          if (vec2.distance(this.position, otherGuest.position) < 20 && otherGuest.isInConversation()) {
            tooClose = true
            break
          }
        }

        if (!tooClose) {
          this.startComment(game.assets.data.comments[commentStr])
        }
      }
    }

    if (this.currentActivity === 'guitar') {
      if (this.canPlayGuitar) {
        // Pick up guitar
        if (this.beenDoingActivityFor === 10) {
          soundmanager.playSound('foley_guitar_pick_up', 0.8, 1.0, [...this.getFoleyPosition(), 6]);
        }
        // Play guitar track
        else if (this.beenDoingActivityFor === 60) {
          const r = Math.random();
          let sound;
          if (r < 0.25) {
            sound = 'foley_guitar_1';
          } else if (r < 0.5) {
            sound = 'foley_guitar_2';
          } else if (r < 0.75) {
            sound = 'foley_guitar_3';
          } else {
            sound = 'foley_guitar_4';
          }
          soundmanager.playSound(sound, 0.8, 1.0, [...this.getFoleyPosition(), 14]);
        }
        // Put guitar down
        else if (this.activityTime === 60) {
          soundmanager.playSound('foley_guitar_put_down', 0.8, 1.0, [...this.getFoleyPosition(), 6]);
        }
      }
    }
    if (this.currentActivity === 'alcohol') {
      if (this.beenDoingActivityFor === 60) {
        soundmanager.playSound(['foley_alcohol_1', 'foley_alcohol_2', 'foley_alcohol_3'], 0.4, 1.0, [...this.getFoleyPosition(), 80]);
      }
    }
    if (this.currentActivity === 'relax') {
      if (this.beenDoingActivityFor === 60) {
        soundmanager.playSound(['foley_chair_sit_1', 'foley_chair_sit_2', 'foley_chair_sit_3'], 0.8, 1.0, [...this.getFoleyPosition(), 30]);
      }
      if (this.activityTime === 60) {
        soundmanager.playSound(['foley_chair_stand_1', 'foley_chair_stand_2', 'foley_chair_stand_3'], 0.8, 1.0, [...this.getFoleyPosition(), 30]);
      }
    }
    if (this.currentActivity === 'game') {
      if (this.beenDoingActivityFor > 60 && this.activityTime > 60) {
        // Every few seconds, maybe play a board game sound
        if (this.beenDoingActivityFor % 114 === 0 && Math.random() < 0.4) {
          soundmanager.playSound([
            'foley_game_' + Math.floor(Math.random() * 8 + 1),
            'foley_game_' + Math.floor(Math.random() * 8 + 1),
            'foley_game_' + Math.floor(Math.random() * 8 + 1),
          ], 0.8, 1.0, [...this.getFoleyPosition(), 80]);
        }
      }
    }
    if (this.currentActivity === 'food_platter') {
      if (this.beenDoingActivityFor > 60 && this.activityTime > 60) {
        if (this.beenDoingActivityFor % 43 === 0 && Math.random() < 0.3) {
          soundmanager.playSound([
            'foley_food_platter_' + Math.floor(Math.random() * 6 + 1),
            'foley_food_platter_' + Math.floor(Math.random() * 6 + 1),
            'foley_food_platter_' + Math.floor(Math.random() * 6 + 1),
          ], 0.55, 1.0, [...this.getFoleyPosition(), 80]);
        }
      }
    }
    if (this.currentActivity === 'food_pizza') {
      if (this.beenDoingActivityFor > 60 && this.activityTime > 60) {
        if (this.beenDoingActivityFor % 120 === 0 && Math.random() < 0.3) {
          soundmanager.playSound([
            'foley_food_pizza_' + Math.floor(Math.random() * 3 + 1),
            'foley_food_pizza_' + Math.floor(Math.random() * 3 + 1),
          ], 0.55, 1.0, [...this.getFoleyPosition(), 80]);
        }
      }
    }
    if (this.currentActivity === 'tea') {
      if (this.beenDoingActivityFor > 60 && this.activityTime > 60) {
        if (this.beenDoingActivityFor % 180 === 0 && Math.random() < 0.5) {
          soundmanager.playSound([
            'foley_tea_' + Math.floor(Math.random() * 3 + 1),
            'foley_tea_' + Math.floor(Math.random() * 3 + 1),
            'foley_tea_' + Math.floor(Math.random() * 3 + 1),
          ], 0.55, 1.0, [...this.getFoleyPosition(), 80]);
        }
      }
    }
  }

  getFoleyPosition() {
    if (this.activityFurniture) {
      return this.activityFurniture.position;
    }
    return this.position;
  }

  startComment(comment) {
    game.addThing(new Conversation(comment));
  }

  startConversation() {
    // Find all nearby guests

    const interlocutors = this.getInterlocutors();
    const bestConversation = this.pickBestConversation(interlocutors);
    if (bestConversation) {
      // Create conversation thing
      game.addThing(new Conversation(bestConversation));

      // Set information keys
      for (const participant of this.getParticipantsOfConversation(bestConversation)) {
        const guestObj = game.getThings().find(x => x instanceof Guest && x.name === participant);

        if (!guestObj) {
          continue;
        }
        
        if (bestConversation.infoKeys) {
          for (const infoKey of bestConversation.infoKeys) {
            guestObj.discussedInfoKeys[infoKey] = true;
          }
        }

        
      }
      
    }
  }

  getInterlocutors() {
    // Method: We do a DFS for all other guests that are in a small radius of
    // each other to form a chain. Then, limit this to only guests that are
    // within a larger radius of the the conversation initiator.

    const guestsInChain = this.getGuestChain(this);
    const guestsInRange = guestsInChain.filter(x => vec2.distance(this.position, x.position) < TALK_RADIUS);

    return guestsInRange.map(x => x.name);
  }

  getGuestChain(guest, found = []) {
    found.push(guest)

    const otherGuests = game.getThings().filter(x => x instanceof Guest && x !== guest);

    // DFS
    // Find other guests that are close enough, aren't in the chain already, and are able to talk
    for (const otherGuest of otherGuests) {
      if (!found.includes(otherGuest)) {
        if (vec2.distance(guest.position, otherGuest.position) < CONVERSATION_RADIUS && otherGuest.canHaveConversation()) {
          this.getGuestChain(otherGuest, found)
        }
      }
    }

    return found;
  }

  isInConversation() {
    if (game.getThings().some(x => x instanceof Conversation && x.hasParticipant(this.name))) {
      return true;
    }
    return false;
  }

  decideCurrentActivity() {
    // Only two activities per person.
    if (this.activitiesDone >= 2 || (this.arrivedLate && this.activitiesDone >= 1)) {
      this.startActivity('leave');
      return;
    }

    // Only one person left. No need to prolong this.
    if (game.getThings().filter(x => x instanceof Guest && !x.isDead).length <= 1) {
      this.startActivity('leave');
      return;
    }

    const activityPreferences = [
      'dancing',
      'guitar',
      'relax',
      'food_pizza',
      'food_platter',
      'game',
      'alcohol',
      'tea',
    ].filter(x => this.getActivityScore(x) > 0 && this.isActivityPresent(x)).sort((a, b) => this.getActivityScore(b) - this.getActivityScore(a))

    // There's nothing here I want to do. Let's bounce!
    if (activityPreferences.length === 0) {
        this.startActivity('leave');
        return;
    }

    // Pick highest available activity that we haven't done yet
    for (const activity of activityPreferences) {
      if (this.isActivityAvailable(activity)) {
        this.startActivity(activity);
        return;
      }
    }

    // Wait for an activity to open up
    this.currentActivity = null;
    this.timeToWait --;

    // Waited too long for activities. We're leaving!
    if (this.timeToWait <= 0) {
      this.startActivity('leave');
    }
  }

  startActivity(activity) {
    // console.log(this.name, "started activity", activity)
    this.currentActivity = activity;
    this.activityTime = this.getActivityDuration();
    this.beenDoingActivityFor = 0;
    this.activityFurniture = this.getActivityNearestFurniture(activity)
    this.activitiesDone ++
    this.inTransit = true
  }

  finishActivity() {
    if (this.currentActivity === 'leave') {
      this.isDead = true;
      game.addThing(new WalkingMan(true))
      return;
    }

    if (this.currentActivity.includes('food')) {
      this.hunger --;
    }
    if (this.currentActivity === 'alcohol') {
      this.drunkedness = Math.min(this.maxDrunkedness, this.drunkedness + 1);
    }

    // Show's over, folks!
    if (this.currentActivity === 'guitar' && this.canPlayGuitar) {
      game.getThings().filter(x => x instanceof Guest && x !== this && x.currentActivity === 'guitar').forEach(x => x.finishActivity());
    }

    this.activityCompletions[this.currentActivity] = (this.activityCompletions[this.currentActivity] ?? 0) + 1;
    // console.log(this.name, "FINISHED activity", this.currentActivity)
    this.currentActivity = null;
    this.activityFurniture = null;
    this.beenDoingActivityFor = 0;
    this.activityTime = 0;
  }

  isActivityAvailable(activity) {
    if (activity === 'relax') {
      if (game.getThings().some(x => x instanceof Furniture && ['chair', 'couch'].includes(x.type) && !x.isFull())) {
        return true;
      }
      return false;
    }

    // Guitar activity is only available if can play guitar or if there is someone else playing guitar to listen to
    if (activity === 'guitar') {
      if (this.canPlayGuitar) {
        return true;
      }
      for (const guitar of game.getThings().filter(x => x instanceof Furniture && x.type === 'guitar')) {
        if (game.getThings().filter(y => y instanceof Guest && y.activityFurniture === guitar).length >= 1) {
          return true;
        }
      }
      return false;
    }

    return true;
  }

  isActivityPresent(activity) {
    if (activity === 'relax') {
      return game.getThings().some(x => x instanceof Furniture && (x.type === 'chair' || x.type === 'couch'));
    }

    // Guitar won't be played if there is other music
    if (activity === 'guitar') {
      return game.getThings().some(x => x instanceof Furniture && x.type === 'guitar') &&
        !game.getThings().some(x => x instanceof Furniture && x.type === 'dancing' || x.type === 'jazz');
    }

    return game.getThings().some(x => x instanceof Furniture && x.type === activity);
  }

  checkLeaveInDisgust() {
    if (!this.partyNeeds) {
      return false
    }

    for (const need of this.partyNeeds) {
      if (this.isActivityPresent(need)) {
        return false;
      }
    }

    return true
  }

  getActivityScore(activity) {
    let bonus = 0

    if (this.checkLeaveInDisgust()) {
      this.leftInDisgust = true
      return -1000
    }

    if (activity.includes('food')) {
      if (this.hunger >= 2) {
        bonus += 1000;
      }
      if (this.hunger <= 0) {
        bonus -= 1000;
      }
    }

    if (activity === 'alcohol') {
      if (this.maxDrunkedness - this.drunkedness <= 0) {
        bonus -= 1000;
      }
      if (this.maxDrunkedness - this.drunkedness > 1) {
        bonus += 20;
      }
    }

    // Reduce activity enjoyment if the activity has already been done
    const timesCompletedActivity = this.activityCompletions[activity] ?? 0;

    // Base
    const likesActivity = this["likes_" + activity] ?? 0;

    return (likesActivity + bonus) - timesCompletedActivity * 10;
  }

  getActivityNearestFurniture(activity) {
    if (activity === 'relax') {
      return this.getNearestFurnitureOfType(['chair', 'couch']);
    }

    return this.getNearestFurnitureOfType([activity]);
  }

  getNearestFurnitureOfType(types) {
    let minDist = 99999999999;
    let minObj = null;
    for (const obj of game.getThings().filter(x => x instanceof Furniture && types.includes(x.type) && !x.isFull())) {
      const dist = vec2.distance(obj.position, this.position)
      if (dist < minDist) {
        minDist = dist;
        minObj = obj;
      }
    }
    return minObj;
  }

  isActivityConversable(activity) {
    if (['dancing', 'guitar', 'leave', null, undefined, ''].includes(activity)) {
      return false;
    }
    return true;
  }

  canHaveConversation() {
    if (this.isInConversation()) {
      return false;
    }
    if (this.inTransit) {
      return false;
    }
    if (!this.isActivityConversable(this.currentActivity)) {
      return false;
    }
    
    // Don't talk over other people >:(
    const otherGuests = game.getThings().filter(x => x instanceof Guest && x !== this);
    for (const otherGuest of otherGuests) {
      if (vec2.distance(this.position, otherGuest.position) < CONVERSATION_RADIUS && otherGuest.isInConversation()) {
        return false;
      }
    }

    return true;
  }

  isInfoKeyPresent(infoKey, participants) {
    for (const int of participants) {
      const guestObj = game.getThings().find(x => x.name === int);

      if (!guestObj) {
        continue;
      }

      if (guestObj.discussedInfoKeys[infoKey]) {
        return true;
      }
    }
    return false;
  }

  getParticipantsOfConversation(conversation) {
    return Array.from(new Set(conversation.audio.map(x => x.speaker)));
  }

  isConversationValid(conversation, interlocutors) {
    let participants = this.getParticipantsOfConversation(conversation);

    // Make sure participants is a subset of interlocutors
    for (const participant of participants) {
      if (!interlocutors.includes(participant)) {
        return false;
      }
    }

    // Skip manual conversations
    if (conversation.isManual) {
      return false;
    }

    // Check max time
    if (conversation.maxTime && conversation.maxTime >= 0) {
      if (game.getThing('house').partyTime / 60 < conversation.maxTime) {
        return false;
      }
    }

    // Check min time
    if (conversation.minTime && conversation.minTime >= 0) {
      if (game.getThing('house').partyTime / 60 > conversation.minTime) {
        return false;
      }
    }

    // Check that certain activities are present
    if (conversation.requiredActivitiesPresent) {
      for (const activity of conversation.requiredActivitiesPresent) {
        if (!this.isActivityPresent(activity)) {
          return false;
        }
      }
    }

    // Check that the right people are doing the right activites
    if (conversation.requiredActivities) {
      for (const req of conversation.requiredActivities) {
        const guestObj = game.getThings().find(x => x.name === req.participant);

        if (!guestObj) {
          continue;
        }

        if (!req.activities.includes(guestObj.currentActivity)) {
          return false;
        }
      }
    }

    // Check drunkedness
    for (const participant of participants) {
      const guestObj = game.getThings().find(x => x.name === participant);

      if (!guestObj) {
        continue;
      }

      if (participant.isDrunkard && participant.drunkedness >= 1) {
        if (!conversation.drunkParticipants) {
          return false;
        }
        if (!conversation.drunkParticipants.includes(participant)) {
          return false;
        }
      }
      else {
        if (conversation.drunkParticipants && conversation.drunkParticipants.includes(participant)) {
          return false;
        }
      }
    }

    // Don't do this conversation if all of its infokeys (relevant information) have been heard or said by one of the participants
    if ((conversation?.infoKeys?.length ?? 0) > 0) {
      const infoKeys = conversation.infoKeys;
      let count = 0;
      for (const infoKey of infoKeys) {
        if (this.isInfoKeyPresent(infoKey, participants)) {
          count ++;
        }
      }

      if (count >= infoKeys.length) {
        return false;
      }
    }

    return true;
  }

  pickBestConversation(interlocutors) {
    // First, filter out conversations that are invalid
    const validConversations = game.assets.data.conversations.filter(x => this.isConversationValid(x, interlocutors))

    // Prioritize conversations that use all of the interlocutors
    for (const conv of validConversations) {
      if (this.getParticipantsOfConversation(conv).length === interlocutors.length) {
        return conv;
      }
    }

    // Otherwise, just return the top one
    return validConversations?.[0];
  }

  draw() {
    if (game.keysDown.KeyP) {
      drawSprite({
        color: [1, 1, 1],
        centered: true,
        width: 16,
        height: 16,
        depth: 80,
        position: this.position,
      })
      drawText({
        text: this.name,
        depth: 80,
        position: vec2.add(this.position, [12, -6]),
        scale: 0.5,
      })
    }
  }
}
