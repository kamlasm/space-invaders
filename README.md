# Project 1 - The Battle of Hogwarts

## Overview

For the first project of the General Assembly Software Engineering Course, I created a game called "The Battle of Hogwarts" which is based on "Space Invaders" but with a Harry Potter theme.

## Description of the Game

The player is Harry Potter and he has to cast spells ("lasers") at the death eaters ("space invaders") before they reach the end of the grid. The death eaters move across and down the screen. A random death eater periodically cast spells ("bombs") down the grid. The player loses a life if hit by a spell. 

There are three main levels of the game, and in each level the death eaters' speed increases.

In the fourth and final level, Voldemort appears. Each second, he moves randomly in the grid and casts a spell.

## Deployed Game

[Play the deployed version of the game here](https://kamlasm.github.io/space-invaders/) 

## Game Setup 

The game display is setup as a grid using CSS Flexbox.  

The movement of the characters and spells is achieved by adding and removing classes to the relevant cells within the grid using Javascript and CSS.

The trickiest part of the game setup was the player's spells. I created a function in Javascript so that each time the player presses the space bar to shoot a spell, a new interval timer is created to enable each spell to move up the grid. Within this function, I also needed to check whether the spell has hit one of the death eaters and if so to remove both the death eater and that spell.

```JS
function playerShoots() {
    let laserIdx = playerIdx - width
    let hit = false
    harryAudioPlayer.play()

    let laserTimer = setInterval(() => {
        cells[laserIdx].classList.remove("lasers")

        if (laserIdx > 15 && !gameOver) {
            laserIdx -= width
            cells[laserIdx].classList.add("lasers")

            if (level === finalLevel) {
                playerHitsVoldy(laserIdx)
            } else {
                if (!hit) {

                    if (invadersIdxs.includes(laserIdx)) {
                        let indexHit = invadersIdxs.findLastIndex((invaderIdx) => {
                            return invaderIdx === laserIdx
                        })

                        invadersIdxs.splice(indexHit, 1)
                        score += 10
                        cells[indexHit].classList.remove("invaders")
                        cells[laserIdx].classList.remove("lasers")
                        render()
                        clearInterval(laserTimer)
                        hit = true
                    }
                }

            }

        } else if (gameOver) {
            cells[laserIdx].classList.remove("lasers")
            clearInterval(laserTimer)
        }
    }, 200)
}
```
## Additional Features

Once I had the initial gameplay setup, I added audio including sound effects for the spells, background game music and sound effects on winning or losing the game.

I also added a landing page, which I styled as the "Marauders' Map" from Harry Potter with the player having to click on a button to open up the game.

I added a final level of the game with Voldemort appearing as I thought this would be a fun and surprising challenge after completing the other "normal" levels of the game. 

## Displays from the Game

Landing page

![](./images/README-images/landing-page.png)

Initial game display

![](./images/README-images/initial-game-page.png)

The game in action

![](./images/README-images/game-in-action.png)

The last level of the game

![](./images/README-images/voldemort-level.png)

Win display

![](./images/README-images/win-screen.png)

## Technologies Used

- Javascript
- HTML
- CSS

## Attributions

[Wallpaper by grand from Wallpapers.com]("https://wallpapers.com/wallpapers/hogwarts-house-logos-harry-potter-desktop-dyqtgu9zpr30a5eb.html")

## Future Improvements

 - Store high scores using localStorage. 