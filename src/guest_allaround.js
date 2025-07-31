import * as game from 'game'
import * as u from 'utils'
import * as vec2 from 'vector2'
import * as soundmanager from 'soundmanager'
import Guest from './guest.js'

export default class GuestAllAround extends Guest {
  // Config
  name = "allaround"
  hunger = 1
  maxDrunkedness = 2
  arrivalTime = 100
  speedMultiplier = 1.1
  activityOffset = [-45, -45]
  likes_dancing = 21
  likes_relax = 20
  likes_food_pizza = 24
  likes_food_platter = 23
  likes_game = 19
  likes_alcohol = 22

}
