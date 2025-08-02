import * as game from 'game'
import * as u from 'utils'
import * as vec2 from 'vector2'
import * as soundmanager from 'soundmanager'
import Guest from './guest.js'

export default class GuestDancer extends Guest {
  // Config
  name = "zoe"
  hunger = 1
  maxDrunkedness = 1
  arrivalTime = 200
  speedMultiplier = 1.1
  activityOffset = [0, -64]
  likes_dancing = 25
  likes_relax = 10
  likes_food_pizza = 21
  likes_food_platter = 22
  likes_game = 0
  likes_alcohol = 19
  likes_guitar = 30
  shoeType = 'barefoot'

}
