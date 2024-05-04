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
const playAganBtn = document.querySelector(".play-again-btn")

/*-------------- Functions -------------*/

function init() {
    playerIdx = 217
    invadersIdxs = [0, 1, 2, 3, 4, 5, 6, 7, 15, 16, 17, 18, 19, 20, 21, 22, 30, 31, 32, 33, 34, 35, 36, 37]
    gameOver = false
    score = 0
    lives = 3
    gameMessage = ""
    invaderMoveCounter = 1
    invaderMoveDirection = 1
    playAganBtn.classList.add("hide")
    render()
}

init()

function startGame() {
    playBtn.classList.add("hide")
    document.addEventListener("keyup", playerAction)
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
        cells[bombIdx].classList.remove("bombs")
        if (bombIdx < 209 && !gameOver) {
            bombIdx += width
            bombHitsPlayer(bombIdx)
            cells[bombIdx].classList.add("bombs")
            
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
        cells[laserIdx].classList.remove("lasers")
        if (laserIdx > 15 && !gameOver) {
            laserIdx -= width
            cells[laserIdx].classList.add("lasers")
            laserHitsInv(laserIdx)

        }
    }, 100)
}

function laserHitsInv(laserIdx) {
    console.log(laserIdx);
    if (invadersIdxs.includes(laserIdx)) {
        let indexHit = invadersIdxs.findIndex((invaderIdx) => {
            return invaderIdx === laserIdx
        })
        invadersIdxs.splice(indexHit, 1)
        score += 10
        clearInterval(laserTimer)
        cells[laserIdx].classList.remove("lasers")
    }
}


function loseGame() {
    if (invaderMoveCounter > 95 || lives === 0) {
        clearInterval(invadersTimer)
        clearInterval(bombsTimer)
        clearInterval(bombMoveTimer)
        clearInterval(laserTimer)

        gameOver = true
        gameMessage = loseMessage
        renderGameOver()
    }
}

function winGame() {
    if (invadersIdxs.length === 0) {
        clearInterval(invadersTimer)
        clearInterval(bombsTimer)
        clearInterval(bombMoveTimer)
        clearInterval(laserTimer)
        gameOver = true
        gameMessage = winMessage
        renderGameOver()
    }
}

function renderGameOver() {
    if (gameOver) {
        messageEl.innerText = gameMessage
        playAganBtn.classList.remove("hide")
    }
}


// function renderBombs(bombIdx) {
//     cells[bombIdx].classList.remove("bombs")

    
//     cells[bombIdx].classList.add("bombs")
// }

// function renderLasers(laserIdx) {
//     cells.forEach((cell, idx) => {

//         cells[idx].classList.remove("lasers")
//     })

//     cells[laserIdx].classList.add("lasers")
// }

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

function restartGame() {
    init()
    setTimers()
}


/*----------- Event Listeners ----------*/
playBtn.addEventListener("click", startGame)


playAganBtn.addEventListener("click", restartGame)