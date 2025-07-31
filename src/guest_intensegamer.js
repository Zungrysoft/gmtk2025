import * as game from 'game'
import * as u from 'utils'
import * as vec2 from 'vector2'
import * as soundmanager from 'soundmanager'
import Guest from './guest.js'

export default class GuestIntenseGamer extends Guest {
  // Config
  name = "intense gamer"
  hunger = 1
  maxDrunkedness = 1
  arrivalTime = 2000
  speedMultiplier = 1.1
  activityOffset = [64, 0]
  likes_dancing = 0
  likes_relax = 10
  likes_food_pizza = 23
  likes_food_platter = 22
  likes_games = 25
  likes_alcohol = 11

}
