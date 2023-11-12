function setup() {
  createCanvas(600, 800);
	world.gravity.y = 20;

  platforms = new Group(); // set up platform details
  platforms.collider = 'kinematic'; // platforms move by programming, not by collision
  platforms.x = () => random(0, canvas.w); // randomize horizontal placement of platforms
  platforms.y = (i) => canvas.h + i * 100; // control vertical spacing of platforms
  platforms.w = 200;
  platforms.h = 15;
  platforms.velocity.y = -1; // control speed of platforms; larger = faster

  platformStart = new Group(); // create first platform in center position
  platformStart.collider = 'kinematic';
  platformStart.w = 200;
  platformStart.h = 15;
  platformStart.x = canvas.w/2; // sets first platform at center horizontally
  platformStart.y = canvas.h-100; // sets first platform vertically with same spacing
  platformStart.velocity.y = -1; 
  
  ball = new Sprite(canvas.w/2,canvas.h-200,50); // create ball above first platform
  ball.bounciness = 0.3;
 // ball.rotationDrag = 0;
  ball.debug = true; // remove later; shows that ball is rotating - only shows on first run
}

function draw() {
  background(100); 
  startGame(); // switch to button later

  if (mouse.presses()) { // switch to button later
    restartGame();
  }
  renderStats(); // info only; checking how many platforms are spawned at any time
    // remove once physics are done
  
}
  
function drawPlatforms() { // separate function, can be used with start button later
  new platforms.Sprite(); // draw platforms to canvas
  new platformStart.Sprite(); // draw first platform to canvas
  platformStart.amount = 1; // only draw one starting platform
}

function tiltPlatforms() { // control keyboard input for platform tilts
  if (kb.pressing('left')) {
    platformStart.rotation = -15; platforms.rotation = -15;
	} else if (kb.pressing('right')) {
    platformStart.rotation = 15; platforms.rotation = 15;
	} else {
    platformStart.rotation = 0; platforms.rotation = 0;
  }
}

function boundaryCheck() { // check position of ball relative to canvas dimensions
  if (ball.x > canvas.w || ball.x < 0 || ball.y > canvas.h || ball.y < 0) {
    platformStart.velocity.y = 0; platforms.velocity.y = 0; // stops platform movement
    ball.remove(); // remove out of bounds ball
  }
}

function startGame() { // control when game starts running
  drawPlatforms(); // can be relocated for use with start button later
  tiltPlatforms(); // control keyboard input for platform tilts
  boundaryCheck(); // check if ball is out of canvas and end game
}

function restartGame() { // restart game after losing
  allSprites.remove(); // clear previous platforms
  ball = new Sprite(canvas.w/2,canvas.h-200,50); // redraw ball to starting position
  drawPlatforms();
  tiltPlatforms();
  platformStart.velocity.y = -1; platforms.velocity.y = -1; // start platform movement
}

// to do
// score
// start screen and buttons
// visuals
// test platform spacing, gravity, velocity, etc
// whatever else we want