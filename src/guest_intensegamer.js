import * as game from 'game'
import * as u from 'utils'
import * as vec2 from 'vector2'
import * as soundmanager from 'soundmanager'
import Guest from './guest.js'

export default class GuestIntenseGamer extends Guest {
  // Config
  name = "sam"
  hunger = 1
  maxDrunkedness = 0
  arrivalTime = 2000
  speedMultiplier = 1.1
  activityOffset = [64, 0]
  likes_dancing = 0
  likes_relax = 6
  likes_food_pizza = 22
  likes_food_platter = 23
  likes_game = 25
  likes_alcohol = 0
  likes_guitar = 0
  arrivedLate = true

}
