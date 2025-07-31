import * as game from 'game'
import * as u from 'utils'
import * as vec2 from 'vector2'
import * as soundmanager from 'soundmanager'
import Guest from './guest.js'

export default class GuestAntonio extends Guest {
  // Config
  name = "antonio"
  hunger = 2
  maxDrunkedness = 1
  arrivalTime = 2000
  speedMultiplier = 1.1
  activityOffset = [-64, 0]
  likes_dancing = 10
  likes_avoid_music = 0
  likes_relax = 15
  likes_food_pizza = 10
  likes_food_platter = 9
  likes_games = 5
  likes_alcohol = 9

}
