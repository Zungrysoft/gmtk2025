import * as game from 'game'
import * as u from 'utils'
import * as vec2 from 'vector2'
import * as soundmanager from 'soundmanager'
import Guest from './guest.js'

export default class GuestDrinker extends Guest {
  // Config
  name = "drinker"
  hunger = 0
  maxDrunkedness = 2
  arrivalTime = 500
  speedMultiplier = 1.1
  activityOffset = [-45, 45]
  likes_dancing = 12
  likes_relax = 0
  likes_food_pizza = 24
  likes_food_platter = 23
  likes_games = 0
  likes_alcohol = 25

}
