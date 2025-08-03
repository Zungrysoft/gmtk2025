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
  likes_dancing = 20
  likes_relax = 6
  likes_food_pizza = 0
  likes_food_platter = 18
  likes_game = 0
  likes_alcohol = 8
  likes_guitar = 0
  likes_tea = 9999
  shoeType = 'barefoot'
  partyNeeds = ['dancing', 'food_platter', 'jazz', 'tea']

}
