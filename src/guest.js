import * as game from 'game'
import * as u from 'utils'
import * as vec2 from 'vector2'
import * as soundmanager from 'soundmanager'
import Thing from 'thing'
import Furniture from './furniture.js'
import { drawSprite } from './draw.js'
import Conversation from './conversation.js'

const TIME_TO_COMPLETE_ACTIVITY = 1200;

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
  likes_games = 10
  likes_alcohol = 10

  // Variables
  drunkedness = 0
  currentActivity = null;
  activityTime = 0;
  position = [463, 531];
  activityCompletions = {};
  footstepTime = 1.0;

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

    if (this.currentActivity) {
      // Walk toward activity
      const dist = vec2.distance(this.position, this.activityPosition)
      const moveSpeed = 2 * this.speedMultiplier;
      if (dist > moveSpeed * 1.1) {
        const vel = vec2.scale(vec2.normalize(vec2.subtract(this.activityPosition, this.position)), moveSpeed);
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
        this.position = [...this.activityPosition];

        this.activityTime --;
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
      'relax',
      'food_pizza',
      'food_platter',
      'games',
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
  }

  startActivity(activity) {
    this.currentActivity = activity;
    this.activityTime = TIME_TO_COMPLETE_ACTIVITY;
    this.activityPosition = vec2.add(this.getActivityNearestPosition(activity), this.activityOffset);
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
    return true;
  }

  isActivityPresent(activity) {
    if (activity === 'relax') {
      return game.getThings().some(x => x instanceof Furniture && (x.type === 'chair' || x.type === 'couch'));
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

  getActivityNearestPosition(activity) {
    if (activity === 'relax') {
      return this.getNearestFurnitureOfType(['chair', 'couch']).position;
    }

    return this.getNearestFurnitureOfType([activity])?.position ?? [423, 481];
  }

  getNearestFurnitureOfType(types) {
    let minDist = 99999999999;
    let minObj = null;
    for (const obj of game.getThings().filter(x => x instanceof Furniture && types.includes(x.type))) {
      const dist = vec2.distance(obj.position, this.position)
      if (dist < minDist) {
        minDist = dist;
        minObj = obj;
      }
    }
    return minObj;
  }

  isActivityConversable(activity) {
    if (['dancing'].includes(activity)) {
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
