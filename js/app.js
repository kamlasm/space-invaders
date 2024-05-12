/*-------------- Constants -------------*/
const width = 15
const losingIndxs = [210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224]
const winMessage = "You win! Hogwarts is safe!"
const loseMessage = "You lose! Voldemort has taken over Hogwarts!"
const winImage = "images/harry-ron-hermione.png"
const loseImage = "images/voldy.png"
const winSound = "sounds/celebrate.mp3"
const loseSound = "sounds/voldemort-laugh.mp3"
const playAgainText = "Play Again"
const playNextLevelText = "Play Next Level"

/*---------- Variables (state) ---------*/
let gameOver
let score = 0
let lives = 3
let playerIdx = 0
let invadersIdxs = []
let invadersTimer
let bombsTimer
let invaderSpeed = 1000
let invaderMoveCounter = 1
let invaderMoveDirection = 1
let gameMessage
let gameImage
let spaceBarTimeOne = Date.now()
let spaceBarTimeTwo
let level = 1
let finalLevel = 4
let voldyLives = 3
let voldyIdx = 7
let voldyTimer
let playAgainBtnText

/*----- Cached Element References  -----*/
const landingPage = document.querySelector("#landing-page")
const gamePage = document.querySelector("#game")

const cells = document.querySelectorAll(".grid > div")

const scoreEl = document.querySelector(".score")
const livesEl = document.querySelector(".lives")
const levelEl = document.querySelector(".level")
const messageEl = document.querySelector(".game-message")
const voldyLivesEl = document.querySelector(".voldy-lives")
const voldyEl = document.querySelector(".voldy")
const gameOverImage = document.querySelector(".game-over-image")

const landingPageBtn = document.querySelector(".landing-page-btn")
const playBtn = document.querySelector(".play-button")
const playAgainBtn = document.querySelector(".play-again-btn")
const soundBtn = document.querySelector(".sound")

const allAudioPlayers = document.querySelectorAll("audio")
const themeAudioPlayer = document.querySelector("#theme")
const harryAudioPlayer = document.querySelector("#harry-sounds")
const enemyAudioPlayer = document.querySelector("#enemy-sounds")
const gameAudioPlayer = document.querySelector("#game-music")
const gameOverAudioPlayer = document.querySelector("#game-over-sounds")

/*-------------- Functions -------------*/
function openGame() {
    themeAudioPlayer.play()
    landingPage.classList.toggle("hide")
    gamePage.classList.toggle("hide")
}

function init() {
    playerIdx = 217
    if (level === finalLevel) {
        invadersIdxs = []
        voldyIdx = 7
        voldyLives = 3
        cells[voldyIdx].classList.add("voldemort")
        voldyEl.classList.remove("hide")
    } else {
        invadersIdxs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 15, 16, 17, 18, 19, 20, 21, 22, 23, 30, 31, 32, 33, 34, 35, 36, 37, 38, 45, 46, 47, 48, 49, 50, 51, 52, 53]
        cells[voldyIdx].classList.remove("voldemort")
        voldyEl.classList.add("hide")
    }
    gameOver = false
    if (level === 1) {
        score = 0
        lives = 3
        invaderSpeed = 1000
    }
    gameMessage = ""
    invaderMoveCounter = 1
    invaderMoveDirection = 1
    messageEl.innerText = gameMessage
    levelEl.innerText = level
    playAgainBtn.classList.add("hide")
    gameOverImage.src = ""
    render()
}

init()

function startGame() {
    themeAudioPlayer.pause()
    playBtn.classList.add("hide")
    document.addEventListener("keyup", playerAction)
    if (level === finalLevel) {
        gameAudioPlayer.src = "sounds/voldy-music.mp3"
    } else {
        gameAudioPlayer.src = "sounds/game-background.mp3"
    }
    gameAudioPlayer.volume = 0.7
    gameAudioPlayer.play()
    gameAudioPlayer.loop = true
    setTimers()
}

function setTimers() {
    if (level === finalLevel) {
        voldyTimer = setInterval(moveVoldemort, 1000)
    } else {
        invadersTimer = setInterval(moveInvaders, invaderSpeed)
        bombsTimer = setInterval(createBombs, 2000)
    }
}

function moveInvaders() {
    let invaderMove = 0
    if (!gameOver) {
        if (invaderMoveCounter % 7 !== 0) {
            invaderMove = invaderMoveDirection
        } else if (invaderMoveCounter % 7 === 0) {
            invaderMove = width
            invaderMoveDirection = invaderMoveDirection * -1
        }
        invaderMoveCounter++

        updateInvaderIdx(invaderMove)
    }
}

function updateInvaderIdx(invaderMove) {
    invadersIdxs.forEach((invaderIdx, idx) => {
        invadersIdxs[idx] = invaderIdx + invaderMove
    })
    render()
    loseGame()
}

function createBombs() {
    randomInvaderIdx = Math.floor(Math.random() * invadersIdxs.length)
    let bombIdx = invadersIdxs[randomInvaderIdx]
    enemyAudioPlayer.src = "sounds/death-eater-spell.mp3"
    enemyAudioPlayer.play()

    let bombMoveTimer = setInterval(() => {
        cells[bombIdx].classList.remove("bombs")
        if (bombIdx < 209 && !gameOver) {
            bombIdx += width
            cells[bombIdx].classList.add("bombs")
            bombHitsPlayer(bombIdx)

        } else if (gameOver) {
            cells[bombIdx].classList.remove("bombs")
            clearInterval(bombMoveTimer)
        }
    }, 400);
}

function bombHitsPlayer(bombIdx) {
    if (bombIdx === playerIdx) {
        lives--
        score = score - 20
        render()
        loseGame()
    }
}

function moveVoldemort() {
    cells[voldyIdx].classList.remove("voldemort")
    randomVoldyIdx = Math.floor(Math.random() * cells.length)
    voldyIdx = randomVoldyIdx
    cells[voldyIdx].classList.add("voldemort")

    voldemortShoots()
}

function voldemortShoots() {
    if (voldyIdx < 209) {
        let voldyBombIdx = voldyIdx + width
        cells[voldyBombIdx].classList.add("voldemort-bombs")
        enemyAudioPlayer.src = "sounds/voldy-spell.mp3"
        enemyAudioPlayer.play()

        let voldyBombTimer = setInterval(() => {
            cells[voldyBombIdx].classList.remove("voldemort-bombs")

            if (voldyBombIdx < 209 && !gameOver) {
                voldyBombIdx = voldyBombIdx + width
                cells[voldyBombIdx].classList.add("voldemort-bombs")
                voldyBombHitsPlayer(voldyBombIdx)

            } else if (gameOver) {
                cells[voldyBombIdx].classList.remove("voldemort-bombs")
                clearInterval(voldyBombTimer)
            }
        }, 200);
    }
}

function voldyBombHitsPlayer(voldyBombIdx) {
    if (voldyBombIdx === playerIdx) {
        lives--
        score = score - 50
        render()
        loseGame()
    }
}

function playerAction(event) {
    event.preventDefault()

    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        playerMoves(event)

    } else if (event.key === " ") {
        spaceBarTimeTwo = Date.now()
        if (spaceBarTimeTwo - spaceBarTimeOne > 500) {
            spaceBarTimeOne = spaceBarTimeTwo
            playerShoots()
        }
    }
    render()
}

function playerMoves(event) {
    if (event.key === "ArrowLeft") {
        if (playerIdx < 211) {
            return
        } else {
            playerIdx -= 1
        }

    } else if (event.key === "ArrowRight") {
        if (playerIdx > 223) {
            return
        } else {
            playerIdx += 1
        }
    }
}

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
                playerHitsVoldy(laserIdx, laserTimer)
            } else {
                playerHitsInvaders(laserIdx, laserTimer, hit)
              }

        } else if (gameOver) {
            cells[laserIdx].classList.remove("lasers")
            clearInterval(laserTimer)
        }
    }, 200)
}

function playerHitsInvaders(laserIdx, laserTimer, hit) {
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
            winLevel()
            clearInterval(laserTimer)
            hit = true
        }
    }
}

function playerHitsVoldy(laserIdx, laserTimer) {
    if (laserIdx === voldyIdx) {
        voldyLives--
        score = score + 30
        cells[laserIdx].classList.remove("lasers")
        clearInterval(laserTimer)
        render()

        if (voldyLives === 0) {
            cells[voldyIdx].classList.remove("voldemort")
            winGame()
        }
    }
}

function render() {
    cells.forEach((cell, idx) => {
        cells[idx].classList.remove("player")
        cells[idx].classList.remove("invaders")
    })

    cells[playerIdx].classList.add("player")
    invadersIdxs.forEach((invaderIdx) => {
        cells[invaderIdx].classList.add("invaders")
    })

    livesEl.innerText = lives
    scoreEl.innerText = score
    voldyLivesEl.innerText = voldyLives
}

function loseGame() {
    if (invadersIdxs.some((invaderIdx) => {
        return losingIndxs.includes(invaderIdx)
    }) || lives === 0) {
        gameOver = true
        gameMessage = loseMessage
        gameImage = loseImage
        level = 1
        playAgainBtnText = playAgainText
        gameOverAudioPlayer.src = loseSound
        renderGameOver()
    }
}

function winLevel() {
    if (invadersIdxs.length === 0) {
        gameOver = true
        level++
        invaderSpeed = invaderSpeed - 200
        playAgainBtnText = playNextLevelText
        gameImage = ""
        gameOverAudioPlayer.src = winSound
        renderGameOver()
    }
}

function winGame() {
    gameOver = true
    gameMessage = winMessage
    gameImage = winImage
    level = 1
    playAgainBtnText = playAgainText
    gameOverAudioPlayer.src = winSound
    renderGameOver()
}

function renderGameOver() {
    if (gameOver) {
        clearInterval(invadersTimer)
        clearInterval(bombsTimer)
        clearInterval(voldyTimer)
        messageEl.innerText = gameMessage
        gameOverImage.src = gameImage
        playAgainBtn.innerText = playAgainBtnText
        playAgainBtn.classList.remove("hide")
        gameAudioPlayer.pause()
        gameOverAudioPlayer.play()
        cells.forEach((cell, idx) => {
            cells[idx].classList.remove("bombs")
            cells[idx].classList.remove("lasers")
            cells[idx].classList.remove("voldemort-bombs")
        })
        document.removeEventListener("keyup", playerAction)
    }
}

function restartGame() {
    init()
    startGame()
}

allAudioPlayers.forEach((audioPlayer) => {
    audioPlayer.muted = false
})

function toggleSound() {
    if (!allAudioPlayers[0].muted) {
        allAudioPlayers.forEach((audioPlayer) => {
            audioPlayer.muted = true
        })
        soundBtn.src = "images/mute.png"
    } else {
        allAudioPlayers.forEach((audioPlayer) => {
            audioPlayer.muted = false
        })
        soundBtn.src = "images/sound.png"
    }
}

/*----------- Event Listeners ----------*/
landingPageBtn.addEventListener("click", openGame)
playBtn.addEventListener("click", startGame)
playAgainBtn.addEventListener("click", restartGame)
soundBtn.addEventListener("click", toggleSound)