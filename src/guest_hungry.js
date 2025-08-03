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
  likes_dancing = 8
  likes_relax = 18
  likes_food_pizza = 25
  likes_food_platter = 24
  likes_game = 0
  likes_alcohol = 9
  likes_guitar = 0
  shoeType = 'barefoot'
  partyNeeds = ['food_pizza', 'food_platter']
}
