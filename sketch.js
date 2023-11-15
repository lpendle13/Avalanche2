let outOfBounds = false;
let gameStart = false;
let score = 0;
let finalScore = 0;
let highScores = [400, 100, 3000, 1000, 5000];
let storedScores = [];

function setup() {
  createCanvas(1000, 800);
  world.gravity.y = 20;
  
  storedScores = getItem('storedScores');
  if (storedScores) { // If there are stored scores, use them instead of the default high scores
    highScores = storedScores;
  }
  highScores.sort(function (a, b) { return b - a });

  platforms = new Group(); // set up platform details
  platforms.collider = 'kinematic'; // platforms move by programming, not by collision
  platforms.x = () => random(0, canvas.w); // randomize horizontal placement of platforms
  platforms.y = (i) => canvas.h + i * 125; // control vertical spacing of platforms
  platforms.w = 200;
  platforms.h = 15;
  platforms.velocity.y = 0; // control speed of platforms; larger = faster

  platformStart = new Group(); // create first platform in center position
  platformStart.collider = 'kinematic';
  platformStart.x = canvas.w / 2; // sets first platform at center horizontally
  platformStart.y = canvas.h - 125; // sets first platform vertically with same spacing
  platformStart.w = 200;
  platformStart.h = 15;
  platformStart.velocity.y = 0;

  ball = new Sprite(canvas.w / 2, canvas.h - 200, 50); // create ball above first platform
  ball.collider = 'static';
  ball.bounciness = 0.3;
}

function draw() {
  background(100);
  startGame(); // switch to button later
  if (mouse.presses()) { // starts game movement
    ball.collider = 'dynamic';
    platformStart.velocity.y = -1; platforms.velocity.y = -1;
  }
  if (outOfBounds == true && mouse.presses()) { // only works if ball is off screen
    restartGame();
  }
  if (gameStart === true) { // while the game is ongoing, count the score
    countScore();
  }
  gameEnd(); // repeatedly check if the ball is out of bounds
}

function drawPlatforms() { // separate function, can be used with start button later
  new platforms.Sprite(); // draw platforms to canvas
  new platformStart.Sprite(); // draw first platform to canvas
  platformStart.amount = 1; // only draw one starting platform
  if (kb.pressing('left')) {
    platformStart.rotation = -15; platforms.rotation = -15;
  } else if (kb.pressing('right')) {
    platformStart.rotation = 15; platforms.rotation = 15;
  } else {
    platformStart.rotation = 0; platforms.rotation = 0;
  }
}

function boundaryCheck() {
  if (ball.x > canvas.w || ball.x < 0 || ball.y > canvas.h || ball.y < 0) { // check position of ball relative to canvas dimensions
    platformStart.velocity.y = 0; platforms.velocity.y = 0; // stops platform movement
    ball.remove(); // remove out of bounds ball
    outOfBounds = true;
    gameStart = false;
    score = 0;
  }
}

function startGame() { // control when game starts running
  drawPlatforms(); // can be relocated for use with start button later
  boundaryCheck(); // check if ball is out of canvas and end game
}

function restartGame() { // restart game after losing
  allSprites.remove(); // clear previous platforms
  ball = new Sprite(canvas.w / 2, canvas.h - 200, 50); // redraw ball to starting position
  platformStart.velocity.y = -1; platforms.velocity.y = -1; // start platform movement
  outOfBounds = false;
  startGame();
}

function onOpen() { // hide try again button on open
  document.getElementById("endScreen").style.display = "none";
}

function startButton() { // allow button to control game start
  canvas.style.display = "block";
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("endScreen").style.display = "none";
  document.getElementById("gameScreen").style.display = "block";
  gameStart = true;
  finalScore = 0;
}

function homeButton() { // allow button to navigate to main menu
  canvas.style.display = "none";
  document.getElementById("startScreen").style.display = "block";
  document.getElementById("endScreen").style.display = "none";
  document.getElementById("ruleScreen").style.display = "none";
  ball.collider = 'static';
  platformStart.velocity.y = 0; platforms.velocity.y = 0;
}

function gameEnd() { // gameEnd runs repeatedly in the draw function
  if (outOfBounds == true) { // when the ball goes out of bounds, stop the gameplay and display the end screen
    canvas.style.display = "none";
    document.getElementById("startScreen").style.display = "none";
    document.getElementById("endScreen").style.display = "block";
    document.getElementById("gameScreen").style.display = "none";
    document.getElementsByClassName('finalScore')[0].innerHTML = 'Congratulations! Score: ' + finalScore.toString();
    doHighScores(); // update the high score list
  }
}

function rulesButton() { // when the rule button is clicked, display the rule screen
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("ruleScreen").style.display = "block";
  ball.collider = 'static'; // these are needed, otherwise the game runs behind the rule screen
  platformStart.velocity.y = 0; platforms.velocity.y = 0;
}

function countScore() { // function that counts the score, runs while the gameplay is ongoing
  finalScore += 1; // score and final score are two different variables to make printing the final score easier
  score += 1;
  document.getElementsByClassName('score')[0].innerHTML = 'Score: ' + score.toString();
}

function doHighScores() {
  if (finalScore > highScores[4]) { // Check if the final score is higher than the lowest score in the top five
    highScores.push(finalScore);  // Add the new score to the list
    highScores.sort(function (a, b) { return b - a }); // Sort the scores in descending order
    highScores = Array.from(new Set(highScores)).slice(0, 5); // Remove duplicates and keep only the top five scores
    document.getElementsByClassName('highScores')[0].innerHTML = 'High Scores:' + highScores.join(' '); // Display the updated high scores
    storedScores = highScores; // Update storedScores for future use
    storeItem('storedScores', storedScores);
  } else {
    document.getElementsByClassName('highScores')[0].innerHTML = 'High Scores:<br>' + highScores.join('<br>');// If the score is not in the top five, display the existing high scores
  }
}

// to do
// score
// visuals
// test platform spacing, gravity, velocity, etc
// whatever else we want