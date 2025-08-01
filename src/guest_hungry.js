import * as game from 'game'
import * as u from 'utils'
import * as vec2 from 'vector2'
import * as soundmanager from 'soundmanager'
import Guest from './guest.js'

export default class GuestHungry extends Guest {
  // Config
  name = "jimmy"
  hunger = 2
  maxDrunkedness = 1
  arrivalTime = 300
  speedMultiplier = 1.1
  activityOffset = [-64, 0]
  likes_dancing = 10
  likes_relax = 23
  likes_food_pizza = 25
  likes_food_platter = 17
  likes_game = 0
  likes_alcohol = 20
  likes_guitar = 10
  shoeType = 'barefoot'

}
