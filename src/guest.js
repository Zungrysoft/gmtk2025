import * as game from 'game'
import * as u from 'utils'
import * as vec2 from 'vector2'
import * as soundmanager from 'soundmanager'
import Thing from 'thing'
import Furniture from './furniture.js'
import { drawSprite } from './draw.js'
import Conversation from './conversation.js'

export default class Guest extends Thing {
  // Config
  name = "unnamed"
  hunger = 0
  maxDrunkedness = 1
  arrivalTime = 0
  speedMultiplier = 1.0
  activityOffset = [0, 0]
  likes_dance = 10
  likes_relax = 10
  likes_food_pizza = 10
  likes_food_platter = 10
  likes_game = 10
  likes_alcohol = 10

  // Variables
  drunkedness = 0
  currentActivity = null;
  activityTime = 0;
  position = [463, 531];
  activityCompletions = {};
  footstepTime = 1.0;
  timeToWait = 60 * 10;

  constructor() {
    super();
  }

  update() {
    if (this.enteringTime == null) {
      this.enteringTime = this.arrivalTime;
    }
    if (this.enteringTime > 0) {
      this.enteringTime --;
      return;
    }

    if (this.isInConversation()) {
      this.activityTime --;
      return;
    }

    let activityPosition = this.activityFurniture?.position
    if (activityPosition) {
      activityPosition = vec2.add(activityPosition, vec2.scale(this.activityOffset, 0.5));
    }
    else {
      activityPosition = [423, 481];
    }
    if (this.currentActivity) {
      // Walk toward activity
      const dist = vec2.distance(this.position, activityPosition)
      const moveSpeed = 2 * this.speedMultiplier;
      if (dist > moveSpeed * 1.1) {
        const vel = vec2.scale(vec2.normalize(vec2.subtract(activityPosition, this.position)), moveSpeed);
        this.position = vec2.add(this.position, vel);
        this.conversationTime = 120;

        this.footstepTime -= 0.03 * this.speedMultiplier;
        if (this.footstepTime <= 0) {
          this.footstepTime = 1.0;
          soundmanager.playSound(['footstep1', 'footstep2', 'footstep3'], 0.6, 1.0, [...this.position, 0]);
        }
      }
      else {
        // Snap to final position and do activity
        this.position = [...activityPosition];

        this.activityTime --;
        this.beenDoingActivityFor ++;
        this.activityFoley();
        if (this.activityTime <= 0) {
          this.finishActivity();
        }

        this.conversationTime --;
        if (this.conversationTime <= 0) {
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

    return 1200;
  }

  activityFoley() {
    if (this.currentActivity === 'guitar') {
      if (this.canPlayGuitar) {
        // Pick up guitar
        if (this.beenDoingActivityFor === 10) {
          soundmanager.playSound('foley_guitar_pick_up', 0.6, 1.0, [...this.getFoleyPosition(), 6]);
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
          soundmanager.playSound(sound, 0.6, 1.0, [...this.getFoleyPosition(), 14]);
        }
        // Put guitar down
        else if (this.activityTime === 60) {
          soundmanager.playSound('foley_guitar_put_down', 0.6, 1.0, [...this.getFoleyPosition(), 6]);
        }
      }
    }
    if (this.currentActivity === 'alcohol') {
      if (this.beenDoingActivityFor === 60) {
        soundmanager.playSound(['foley_alcohol_1', 'foley_alcohol_2', 'foley_alcohol_3'], 0.3, 1.0, [...this.getFoleyPosition(), 80]);
      }
    }
    if (this.currentActivity === 'relax') {
      if (this.beenDoingActivityFor === 30) {
        soundmanager.playSound(['foley_chair_sit_1', 'foley_chair_sit_2', 'foley_chair_sit_3'], 0.6, 1.0, [...this.getFoleyPosition(), 30]);
      }
      if (this.activityTime === 30) {
        soundmanager.playSound(['foley_chair_stand_1', 'foley_chair_stand_2', 'foley_chair_stand_3'], 0.6, 1.0, [...this.getFoleyPosition(), 30]);
      }
    }
  }

  getFoleyPosition() {
    if (this.activityFurniture) {
      return this.activityFurniture.position;
    }
    return this.position;
  }

  startConversation() {
    game.addThing(new Conversation(game.assets.data.conversations[0]))
  }

  isInConversation() {
    if (game.getThings().some(x => x instanceof Conversation && x.conversation.participants.includes(this.name))) {
      return true;
    }
    return false;
  }

  decideCurrentActivity() {
    const activityPreferences = [
      'dance',
      'guitar',
      'relax',
      'food_pizza',
      'food_platter',
      'game',
      'alcohol',
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
    console.log(this.name, "started activity", activity)
    this.currentActivity = activity;
    this.activityTime = this.getActivityDuration();
    this.beenDoingActivityFor = 0;
    this.activityFurniture = this.getActivityNearestFurniture(activity)
  }

  finishActivity() {
    if (this.currentActivity === 'leave') {
      this.isDead = true;
      return;
    }

    if (this.currentActivity.includes('food')) {
      this.hunger --;
    }
    if (this.currentActivity === 'alcohol') {
      this.drunkedness = Math.min(this.maxDrunkedness, this.drunkedness + 1);
    }

    this.activityCompletions[this.currentActivity] = (this.activityCompletions[this.currentActivity] ?? 0) + 1;
  
    this.currentActivity = null;
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

    // Guitar won't be played if there is loud music
    if (activity === 'guitar') {
      return game.getThings().some(x => x instanceof Furniture && x.type === 'guitar') &&
        !game.getThings().some(x => x instanceof Furniture && x.type === 'dancing');
    }

    return game.getThings().some(x => x instanceof Furniture && x.type === activity);
  }

  getActivityScore(activity) {
    let bonus = 0

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
    if (['dancing', 'guitar'].includes(activity)) {
      return false;
    }
    return true;
  }

  draw() {
    drawSprite({
      color: [1, 1, 1],
      centered: true,
      width: 16,
      height: 16,
      depth: 1000,
      position: this.position,
    })
  }
}
