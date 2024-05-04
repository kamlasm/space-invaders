/*-------------- Constants -------------*/
const width = 15
const winMessage = "You win!"
const loseMessage = "You lose!"

/*---------- Variables (state) ---------*/
let score = 0
let lives = 3
let gameOver
let playerIdx = 0
let invadersIdxs = []
let invadersTimer
let bombsTimer
let gameMessage
let invaderMoveCounter = 1
let invaderMoveDirection = 1

/*----- Cached Element References  -----*/
const scoreEl = document.querySelector(".score")
const livesEl = document.querySelector(".lives")
const messageEl = document.querySelector(".game-message")
const cells = document.querySelectorAll(".grid > div")
const playBtn = document.querySelector(".play-button")

/*-------------- Functions -------------*/

function init() {
    playerIdx = 217
    invadersIdxs = [0, 1, 2, 3, 4, 5, 6, 7, 15, 16, 17, 18, 19, 20, 21, 22, 30, 31, 32, 33, 34, 35, 36, 37]
    gameOver = false
    score = 0
    lives = 3
    render()
}

init()

function startGame() {
    setTimers()
}

function setTimers() {
    invadersTimer = setInterval(moveInvaders, 1000)
    bombsTimer = setInterval(createBombs, 5000)
}

function moveInvaders() {
    let invaderMove = 0
    loseGame()
    winGame()
    if (invaderMoveCounter % 8 !== 0) {
        invaderMove = invaderMoveDirection
    } else if (invaderMoveCounter % 8 === 0) {
        invaderMove = width
        invaderMoveDirection = invaderMoveDirection * -1
    }
    invaderMoveCounter++
    updateInvaderIdx(invaderMove)
}

function updateInvaderIdx(invaderMove) {
    invadersIdxs.forEach((invaderIdx, idx) => {
        invadersIdxs[idx] = invaderIdx + invaderMove
    })
    render()
}
let bombMoveTimer
function createBombs() {
    randomInvaderIdx = Math.floor(Math.random() * invadersIdxs.length)
    let bombIdx = invadersIdxs[randomInvaderIdx]

    bombMoveTimer = setInterval(() => {
        if (bombIdx < 209 && !gameOver) {
            bombIdx += width
            bombHitsPlayer(bombIdx)
            renderBombs(bombIdx)
        }
    }, 500);
}

function bombHitsPlayer(bombIdx) {
    if (bombIdx === playerIdx) {
        lives--
    }
}

function playerAction(event) {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        playerMoves(event)
    } else if (event.key === " ") {
        event.preventDefault()
        playerShoots()
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

let laserTimer
function playerShoots() {
    let laserIdx = playerIdx - width
    laserTimer = setInterval(() => {
        if (laserIdx > 15 && !gameOver) {
            laserIdx -= width
            laserHitsInv(laserIdx)
            renderLasers(laserIdx)
        }
    }, 100)
}

function laserHitsInv(laserIdx) {
    if (invadersIdxs.includes(laserIdx)) {
        let indexHit = invadersIdxs.findIndex((invaderIdx) => {
            return invaderIdx === laserIdx
        })
        invadersIdxs.splice(indexHit, 1)
       score += 10
    }
}


function loseGame() {
    if (invaderMoveCounter > 95 || lives === 0) {
        clearInterval(invadersTimer)
        clearInterval(bombsTimer)

        gameOver = true
        gameMessage = loseMessage
        renderGameOver()
    }
}

function winGame() {
    if (invadersIdxs.length === 0) {
        gameOver = true
        gameMessage = winMessage
        renderGameOver()
    }
}

function renderGameOver() {
    if (gameOver) {
        messageEl.innerText = gameMessage
    }
}


function renderBombs(bombIdx) {
    cells.forEach((cell, idx) => {
        cells[idx].classList.remove("bombs")

    })
    cells[bombIdx].classList.add("bombs")
}

function renderLasers(laserIdx) {
    cells.forEach((cell, idx) => {

        cells[idx].classList.remove("lasers")
    })

    cells[laserIdx].classList.add("lasers")
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
}



/*----------- Event Listeners ----------*/
playBtn.addEventListener("click", startGame)
document.addEventListener("keydown", playerAction)