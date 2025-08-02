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
  likes_dancing = 17
  likes_relax = 14
  likes_food_pizza = 24
  likes_food_platter = 23
  likes_game = 9
  likes_alcohol = 21
  likes_guitar = 5

}
