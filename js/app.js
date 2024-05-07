/*-------------- Constants -------------*/
const width = 15
const winMessage = "You win!"
const loseMessage = "You lose!"
const losingIndxs = [210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224]
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
// let bombMoveTimer
// let laserTimer

/*----- Cached Element References  -----*/
const scoreEl = document.querySelector(".score")
const livesEl = document.querySelector(".lives")
const messageEl = document.querySelector(".game-message")
const cells = document.querySelectorAll(".grid > div")
const playBtn = document.querySelector(".play-button")
const playAganBtn = document.querySelector(".play-again-btn")
const loseImage = document.querySelector(".lose-image")


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

function playerShoots() {
    let laserIdx = playerIdx - width

    let hit = false

    let laserTimer = setInterval(() => {
        cells[laserIdx].classList.remove("lasers")
        if (laserIdx > 15 && !gameOver) {
            laserIdx -= width
            cells[laserIdx].classList.add("lasers")
            // laserHitsInv(laserIdx)
            // console.log("laser index ", laserIdx);
            // console.log("invaders indexes: ", invadersIdxs);
            // console.log(cells);
            if (!hit) {
                
                if (invadersIdxs.includes(laserIdx)) {
                    let indexHit = invadersIdxs.findLastIndex((invaderIdx) => {
                        return invaderIdx === laserIdx
                    })
                    // console.log("invader index hit: ", invadersIdxs[indexHit])
                    // console.log("laser index hit: ", laserIdx);
                    invadersIdxs.splice(indexHit, 1)
                    // console.log("Invaders indexes post hit: ", invadersIdxs);
                    score += 10

                    cells[indexHit].classList.remove("invaders")
                    cells[laserIdx].classList.remove("lasers")
                    render()
                    clearInterval(laserTimer)
                    hit = true
                    //console.log(laserIdx);
                }
            }

        } else if (gameOver) {
            cells[laserIdx].classList.remove("lasers")
            clearInterval(laserTimer)
        }
    }, 200)
}

// function laserHitsInv(laserIdx) {
//     // console.log(laserIdx)
//     if (invadersIdxs.includes(laserIdx)) {
//         let indexHit = invadersIdxs.findIndex((invaderIdx) => {
//             return invaderIdx === laserIdx
//         })
//         invadersIdxs.splice(indexHit, 1)
//         score += 10
//         clearInterval(laserTimer)
//         cells[laserIdx].classList.remove("lasers")

//         //console.log(laserIdx);
//     }
// }

function loseGame() {

    if (invadersIdxs.some((invaderIdx) => {
        return losingIndxs.includes(invaderIdx)
    }) || lives === 0) {
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
        clearInterval(invadersTimer)
        clearInterval(bombsTimer)
        // clearInterval(bombMoveTimer)
        // clearInterval(laserTimer)
        messageEl.innerText = gameMessage
        playAganBtn.classList.remove("hide")
        loseImage.classList.remove("hide")
        cells.forEach((cell, idx) => {
            cells[idx].classList.remove("bombs")
            cells[idx].classList.remove("lasers")
        })
        document.removeEventListener("keyup", playerAction)
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
    startGame()
}


/*----------- Event Listeners ----------*/
playBtn.addEventListener("click", startGame)

playAganBtn.addEventListener("click", restartGame)
