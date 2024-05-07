/*-------------- Constants -------------*/
const width = 15
const losingIndxs = [210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224]
const winMessage = "You win! Hogwarts is safe!"
const loseMessage = "You lose! Voldemort has taken over Hogwarts!"
const winImage = "images/harry-ron-hermione.png"
const loseImage = "images/voldy.png"

/*---------- Variables (state) ---------*/
let gameOver
let score = 0
let lives = 3
let playerIdx = 0
let invadersIdxs = []
let invadersTimer
let bombsTimer
let invaderMoveCounter = 1
let invaderMoveDirection = 1
let gameMessage
let gameImage
let spaceBarTimeOne = Date.now()
let spaceBarTimeTwo

/*----- Cached Element References  -----*/
const scoreEl = document.querySelector(".score")
const livesEl = document.querySelector(".lives")
const messageEl = document.querySelector(".game-message")
const cells = document.querySelectorAll(".grid > div")
const playBtn = document.querySelector(".play-button")
const playAganBtn = document.querySelector(".play-again-btn")
const gameOverImage = document.querySelector(".game-over-image")

/*-------------- Functions -------------*/

function init() {
    playerIdx = 217
    invadersIdxs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 15, 16, 17, 18, 19, 20, 21, 22, 23, 30, 31, 32, 33, 34, 35, 36, 37, 38, 45, 46, 47, 48, 49, 50, 51, 52, 53]
    gameOver = false
    score = 0
    lives = 3
    gameMessage = ""
    invaderMoveCounter = 1
    invaderMoveDirection = 1
    playAganBtn.classList.add("hide")
    gameOverImage.src = ""
    render()
}

init()

function startGame() {
    playBtn.classList.add("hide")
    document.addEventListener("keyup", playerAction)
    setTimers()
}

function setTimers() {
    invadersTimer = setInterval(moveInvaders, 700)
    bombsTimer = setInterval(createBombs, 2000)
}

function moveInvaders() {
    loseGame()
    winGame()

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
}

function createBombs() {
    randomInvaderIdx = Math.floor(Math.random() * invadersIdxs.length)
    let bombIdx = invadersIdxs[randomInvaderIdx]
    let bombMoveTimer = setInterval(() => {
        cells[bombIdx].classList.remove("bombs")
        if (bombIdx < 209 && !gameOver) {
            bombIdx += width
            bombHitsPlayer(bombIdx)
            cells[bombIdx].classList.add("bombs")

        } else if (gameOver) {
            cells[bombIdx].classList.remove("bombs")
            clearInterval(bombMoveTimer)
        }
    }, 400);
}

function bombHitsPlayer(bombIdx) {
    if (bombIdx === playerIdx) {
        lives--
        render()
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

    let laserTimer = setInterval(() => {
        cells[laserIdx].classList.remove("lasers")
        
        if (laserIdx > 15 && !gameOver) {
            laserIdx -= width
            cells[laserIdx].classList.add("lasers")

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

        } else if (gameOver) {
            cells[laserIdx].classList.remove("lasers")
            clearInterval(laserTimer)
        }
    }, 200)
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
    messageEl.innerText = gameMessage
}

function loseGame() {
    if (invadersIdxs.some((invaderIdx) => {
        return losingIndxs.includes(invaderIdx)
    }) || lives === 0) {
        gameOver = true
        gameMessage = loseMessage
        gameImage = loseImage
        renderGameOver()
    }
}

function winGame() {
    if (invadersIdxs.length === 0) {
        gameOver = true
        gameMessage = winMessage
        gameImage = winImage
        renderGameOver()
    }
}

function renderGameOver() {
    if (gameOver) {
        clearInterval(invadersTimer)
        clearInterval(bombsTimer)
        messageEl.innerText = gameMessage
        playAganBtn.classList.remove("hide")
        gameOverImage.src = gameImage
        cells.forEach((cell, idx) => {
            cells[idx].classList.remove("bombs")
            cells[idx].classList.remove("lasers")
        })
        document.removeEventListener("keyup", playerAction)
    }
}

function restartGame() {
    init()
    startGame()
}

/*----------- Event Listeners ----------*/
playBtn.addEventListener("click", startGame)
playAganBtn.addEventListener("click", restartGame)