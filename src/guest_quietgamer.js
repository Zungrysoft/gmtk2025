import * as game from 'game'
import * as u from 'utils'
import * as vec2 from 'vector2'
import * as soundmanager from 'soundmanager'
import Guest from './guest.js'
import Furniture from './furniture.js'

export default class GuestQuietGamer extends Guest {
  // Config
  name = "laura"
  hunger = 1
  maxDrunkedness = 1
  arrivalTime = 650
  speedMultiplier = 1.1
  activityOffset = [45, 45]
  likes_dancing = 0
  likes_relax = 7
  likes_food_pizza = 20
  likes_food_platter = 19
  likes_game = 15
  likes_alcohol = 0
  likes_guitar = 0
  shoeType = 'flipflops'
  partyNeeds = ['game']

  getActivityNearestPosition(activity) {
    if (activity === 'relax') {
      const dancingPosition = this.getNearestFurnitureOfType(['dancing'])?.position;
      if (dancingPosition) {
        let maxDist = 0;
        let maxObj = null;
        for (const obj of game.getThings().filter(x => x instanceof Furniture && ['chair', 'couch'].includes(x.type))) {
          const dist = vec2.distance(obj.position, dancingPosition)
          if (dist >= maxDist) {
            maxDist = dist;
            maxObj = obj;
          }
        }
        return maxObj?.position;
      }
      else {
        return this.getNearestFurnitureOfType(['chair', 'couch']).position;
      }
    }

    // For avoiding the music, go to the furthest corner of the room from the music
    if (activity === 'avoid_music') {
      const musicPos = this.getNearestFurnitureOfType(['dancing']).position;
      let maxDist = 0;
      let maxPos = [0, 0];
      for (const pos of [[321, 207], [295, 433], [984, 541], [987, 131]]) {
        const dist = vec2.distance(pos, musicPos);
        if (dist > maxDist) {
          maxDist = dist;
          maxPos = pos;
        }
      }
      return maxPos;
    }

    return this.getNearestFurnitureOfType([activity])?.position ?? [423, 481];
  }

  isActivityPresent(activity) {
    if (activity === 'relax') {
      const dancingPosition = this.getNearestFurnitureOfType(['dancing'])?.position ?? [10000, 10000];

      return game.getThings().some(x => x instanceof Furniture && (x.type === 'chair' || x.type === 'couch') && vec2.distance(x.position, dancingPosition) > 480);
    }

    return game.getThings().some(x => x instanceof Furniture && x.type === activity);
  }

}
