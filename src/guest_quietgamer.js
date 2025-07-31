import * as game from 'game'
import * as u from 'utils'
import * as vec2 from 'vector2'
import * as soundmanager from 'soundmanager'
import Guest from './guest.js'

export default class GuestQuietGamer extends Guest {
  // Config
  name = "quiet gamer"
  hunger = 1
  maxDrunkedness = 1
  arrivalTime = 2000
  speedMultiplier = 1.1
  activityOffset = [-64, 0]
  likes_dancing = 0
  likes_avoid_music = 25
  likes_relax = 17
  likes_food_pizza = 20
  likes_food_platter = 19
  likes_games = 18
  likes_alcohol = 0

}
