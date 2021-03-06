# Robot Futbol League

**Are you ready for some futbol!!!**

Robot Football League is one-on-one football played by autonomous robots. The game is to fork this repo and hack to life a robot to dominate the game!

## The game

The game is simple. Each player-bot has a goal they defend (keep ball out of) and an opposing goal they offend by pushing the ball toward.

For Electric Sky 2021, the playing field will be 8' x 16' with a 2' at either end making up the goals. The bots are about 21cm squared. `game-controller` breaks up the playing field into 24cm sq game units of measure producing a 10 x 20 unit coordinate system. Origin is at exactly mid-field.

![The playing field](https://github.com/littlebee/robot-futbol-league/blob/master/docs/playingField.png)

## The components

### The Ball (src/ball-bot)

The ball is actually a 4wd bot with omni directional wheels called `ball-bot`. It receives player coordinates from `game-controller`. Any time a player-bot enters within a given radius of ball-bot, ball-bot will move at an opposing direction to the nearest player-bot with magnitude to match. So the faster a player-bot approaches ball-bot, the further ball bot will move away from player.

### The Game Controller and Timer (src/game-controller)

The game controller is a websocket server that sends to connected clients:

- positioning information for ball-bot, player-bot-1 and player-bot-2
- game clock
- score

Position coordinates come from a [Marvelmind Indoor Navigation Positioning System (915MHz) v 4.9](https://www.robotshop.com/uk/marvelmind-starter-set-hw-v49-indoor-navigation-positioning-system-915mhz.html?gclid=Cj0KCQjwiqWHBhD2ARIsAPCDzaksKWh8X1BsVWGuckrfdj67qMHQD1eEBH0aTTDmB680hjq7pr7UOV4aAlCwEALw_wcB)
It receives compass heading and inertial information only from player bots and ball-bot over the websocket.

It receives admin controls (game start, stop, reset) from the scoreboard admin app.

### The Scoreboard App (src/scoreboard)

The scoreboard browser app is a React web app that is served from the same PI running the game-controller server. It connects to the game-controller websocket and displays the score, the game clock and the positions of player bots and ball-bot on a graphic UI of the field.

There is also an admin app used to start, pause and reset the game.

### The Player Bots (src/player-bot)

This is the code to hack. The default implementation here is pretty dumb. It simply

- if not between the ball and defending goal
  - calculates a velocity interrupt vector to a point halfway between ball and defending goal
- else
  - move on vector toward ball at full speed

## The network

![the network](https://github.com/littlebee/robot-futbol-league/blob/master/docs/network.png)

## The Positioning System

![the positioning system](https://github.com/littlebee/robot-futbol-league/blob/master/docs/positioningSystem.png)

## Playfield setup (positioning IRL)
- In the marvelmind software, import the PNG of the playfield as a floorplan
- Drag the becons to where they are in real life, relative to the playfield
- Rotate the Z plane to get X and Y parallel to horizontal and vertical (wrt playfield image)
- If chirality of X & Y isn't right, rotate whichever one you need to to get it right
- Translate the origin to the center of the playing field, and now the coordinates should be what you want.
