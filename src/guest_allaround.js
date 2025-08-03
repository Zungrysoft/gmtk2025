import * as game from 'game'
import * as u from 'utils'
import * as vec2 from 'vector2'
import * as soundmanager from 'soundmanager'
import Guest from './guest.js'

export default class GuestAllAround extends Guest {
  // Config
  name = "taylor"
  hunger = 1
  maxDrunkedness = 1
  arrivalTime = 100
  speedMultiplier = 1.1
  activityOffset = [-45, -45]
  likes_dancing = 7
  likes_relax = 4
  likes_food_pizza = 14
  likes_food_platter = 13
  likes_game = 2
  likes_alcohol = 9
  likes_guitar = 5

}
