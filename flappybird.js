//board
let board;
// let boardWidth = 360;
// let boardHeight = 640;
let boardWidth = 320;
let boardHeight = 480;
let context;

//bird
let birdWidth = 34; //width/height ratio = 408/228 = 17/12
let birdHeight = 24;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;

let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

//pipes
let pipeArray = [];
let pipeWidth = 64; //width/height ratio = 384/3072 = 1/8
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2; //pipes moving left speed
let velocityY = 2; //bird fall speed was 0 originally 
let gravity = 0.4;

let gameOver = false;
let isJumping = false;
let score = 0;
let userId;

let startButton;
let gameStarted = false;

// Modify the window.onload function to include creating the start button
window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    userId = urlParams.get('user_id');
    if (!userId) {
        alert('User ID is missing');
    }
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board

    // Create start button
    createStartButton();

    // Draw flappy bird
    // context.fillStyle = "green";
    // context.fillRect(bird.x, bird.y, bird.width, bird.height);

    // Load images
    birdImg = new Image();
    birdImg.src = "./flappybird.png";
    birdImg.onload = function() {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    // Wait to start the game until start button is pressed
    // requestAnimationFrame(update);
    // setInterval(placePipes, 1500); //every 1.5 seconds

    // document.addEventListener("keydown", moveBird);
}

// Create start button
function createStartButton() {
    startButton = document.createElement('button');
    startButton.innerText = 'Start Game';
    startButton.style.position = 'absolute';
    startButton.style.left = '50%';
    startButton.style.top = '50%';
    startButton.style.transform = 'translate(-50%, -50%)';

    startButton.style.padding = '15px 30px'; // Larger padding for bigger button
    startButton.style.backgroundColor = '#4CAF50'; // Green background color
    startButton.style.color = 'black'; // White text color
    startButton.style.border = 'none'; // Remove border
    startButton.style.fontWeight = 'bold'; // Make text bold

    startButton.addEventListener('click', function() {
        startGame();
    });

    document.body.appendChild(startButton);
}

// Start game function
function startGame() {
    gameStarted = true;
    document.body.removeChild(startButton);
    requestAnimationFrame(update);
    setInterval(placePipes, 1500); //every 1.5 seconds
}

function update() {
    requestAnimationFrame(update);
    if (gameOver || !gameStarted) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    // bird
    velocityY += gravity;
    // bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY, 0); //apply gravity to current bird.y, limit the bird.y to top of the canvas
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameOver = true;
    }

    // pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5; //0.5 because there are 2 pipes! so 0.5*2 = 1, 1 for each set of pipes
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }

    // clear pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); //removes first element from the array
    }

    // score
    context.fillStyle = "black";
    context.font="bold 45px sans-serif";
    context.fillText(score, 15, 45);

    function createSendScoreButton() {
        const button = document.createElement('button');
        button.innerText = 'Send Score';
        button.id = 'senscoreButton'; // Set id to the button
        button.classList.add('sendscore-button'); // Add a class to the button
        button.style.position = 'absolute';
        button.style.left = '50%';
        button.style.top = '50%';
        button.style.transform = 'translate(-50%, -50%)';

        button.style.padding = '15px 30px'; // Larger padding for bigger button
        button.style.backgroundColor = '#4CAF50'; // Green background color
        button.style.color = 'black'; // White text color
        button.style.border = 'none'; // Remove border
        button.style.fontWeight = 'bold'; // Make text bold

        button.addEventListener('click', function() {
            finishGame();
            // You can add your code here to send the score to the server if needed
        });
        document.body.appendChild(button);
    }

    // Function to create and handle click event for the "Restart Game" button
    function createRestartGameButton() {
    const button = document.createElement('button');
    button.innerText = 'Restart Game';
    button.style.position = 'absolute';
    button.style.left = '50%';
    button.style.top = '60%'; // Adjust the top position to place it below the "Send Score" button
    button.style.transform = 'translate(-50%, -50%)';
    
    // Modify button style
    button.style.padding = '15px 30px'; // Larger padding for bigger button
    button.style.backgroundColor = '#4CAF50'; // Green background color
    button.style.color = 'black'; // White text color
    button.style.border = 'none'; // Remove border
    button.style.fontWeight = 'bold'; // Make text bold

    button.addEventListener('click', function() {
        // resets the game if game over 
        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
            // Remove the button from the DOM after restarting the game
            document.body.removeChild(button);
            const sendscoreButton = document.getElementById('senscoreButton');
            if (sendscoreButton) {
                document.body.removeChild(sendscoreButton);
            }
        }

        // You can add your code here to restart the game if needed
    });
    document.body.appendChild(button);
}


    if (gameOver) {
        context.font = "bold 30px Arial";
        const gameOverText = "GAME OVER";
        const textWidth = context.measureText(gameOverText).width;
        const xPosition = (boardWidth - textWidth) / 2; // Center horizontally
        const yPosition = boardHeight / 3; // Center vertically
        context.fillText(gameOverText, xPosition, yPosition);
        context.font = "bold 20px Arial";
        const gameOverText1 = `Your score: ${score}`;
        const textWidth1 = context.measureText(gameOverText1).width; // Use textWidth1 here
        const xPosition1 = (boardWidth - textWidth1) / 2; // Center horizontally using textWidth1
        const yPosition1 = boardHeight / 2 - 30; // Center vertically
        context.fillText(gameOverText1, xPosition1, yPosition1);
        createSendScoreButton();
        createRestartGameButton();
    }
}

function placePipes() {
    if (gameOver) {
        return;
    }

    //(0-1) * pipeHeight/2.
    // 0 -> -128 (pipeHeight/4)
    // 1 -> -128 - 256 (pipeHeight/4 - pipeHeight/2) = -3/4 pipeHeight
    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight - pipeHeight /2);// was math.random()*(pipeheight /2) 
    let openingSpace = board.height/4;

    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(bottomPipe);
}

// function moveBird(e) {
//     if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX" ) {
//         //jump
//         velocityY = -6;
//         isJumping = true; 

//         //reset game
//         if (gameOver) {
//             bird.y = birdY;
//             pipeArray = [];
//             score = 0;
//             gameOver = false;
//         }
//     }
// }
document.addEventListener('keydown', function(e) {
    if ((e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX")&& !isJumping) {
        velocityY = -6;
        isJumping = true;

        // // reset game if game over 
        // if (gameOver) {
        //     bird.y = birdY;
        //     pipeArray = [];
        //     score = 0;
        //     gameOver = false;
        // }
    }
});
document.addEventListener('keyup', function(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        isJumping = false;
    }
});



document.addEventListener('click', function() {
    // Trigger the same logic as when the space key is pressed
    if (!isJumping) { // Check if bird is not currently jumping
        velocityY = -6;
        isJumping = true;
    }
});
document.addEventListener('mouseup', () => {
    isJumping = false; // Reset isJumping to false when mouse click is released
});

document.addEventListener('touchstart', function() {
    if (!isJumping) {
        velocityY = -6;
        isJumping = true;
        // Perform action
    }
});

document.addEventListener('touchend', function() {
    isJumping = false;
});


// Optional: Handle touchmove to prevent unintended actions while touching
document.addEventListener('touchmove', function(event) {
    event.preventDefault();
}, { passive: false });




function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}


async function finishGame() {
    if (!userId) {
        alert('User ID is missing');
        return;
    }
    try {
        console.log(score) 
        const response = await fetch(`https://api.telegram.org/bot6994408856:AAHK3A-zUeCEN9mhk7cm-EKa5ZGYR-raUGg/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: userId,
                text: `Game log: ${score} scores achieved by user ${userId}.`
            })
        });

        const result = await response.json();
        if (result.ok) {
            alert('Score sent successfully!');
        } else {
            alert('Failed to send score.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while sending the score');
    }
}