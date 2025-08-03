import * as game from 'game'
import * as u from 'utils'
import * as vec2 from 'vector2'
import * as soundmanager from 'soundmanager'
import Guest from './guest.js'

export default class GuestHungry extends Guest {
  // Config
  name = "jimmy"
  hunger = 1
  maxDrunkedness = 1
  arrivalTime = 500
  speedMultiplier = 1.1
  activityOffset = [-64, 0]
  likes_dancing = 7
  likes_relax = 18
  likes_food_pizza = 25
  likes_food_platter = 24
  likes_game = 0
  likes_alcohol = 8
  likes_guitar = 0
  likes_tea = 9999
  shoeType = 'barefoot'
  partyNeeds = ['food_pizza', 'food_platter']
}
