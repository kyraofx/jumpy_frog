// Canvas setup gives the game a drawing surface and a fixed coordinate system.
const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");

// These values control the main feel of the game and are easy to tune together.
const floorHeight = 72;
const floorY = canvas.height - floorHeight;
const gravity = 0.34;
const jumpStrength = -6.4;
const kelpSpeed = 3;
const kelpWidth = 92;
const kelpGap = 180;
const kelpSpacing = 285;

// The game state keeps track of the current screen, score, frog, and obstacles.
let gameState = "start";
let score = 0;
let kelpObstacles = [];

const frog = {
  x: 190,
  y: canvas.height / 2,
  radius: 22,
  velocityY: 0,
};

// Bubbles are decorative only, so a small reusable list is enough for the scene.
const bubbles = Array.from({ length: 18 }, function (_, index) {
  return {
    x: (index * 137) % canvas.width,
    y: (index * 83) % floorY,
    radius: 3 + (index % 4),
    speed: 0.25 + (index % 3) * 0.12,
  };
});

/**
 * Returns a random number between two limits.
 * This helper keeps obstacle placement calculations easy to read.
 */
function randomBetween(minimum, maximum) {
  return Math.random() * (maximum - minimum) + minimum;
}

/**
 * Adds one kelp pair at the requested horizontal position.
 * The randomized gap stays far enough from both boundaries to remain playable.
 */
function createKelp(xPosition) {
  const edgePadding = 85;
  const minimumGapY = edgePadding;
  const maximumGapY = floorY - kelpGap - edgePadding;

  kelpObstacles.push({
    x: xPosition,
    gapY: randomBetween(minimumGapY, maximumGapY),
    scored: false,
  });
}

/**
 * Restores all changing values for a fresh round.
 * Three starting obstacles provide a predictable rhythm without extra setup code.
 */
function restartGame() {
  score = 0;
  frog.y = canvas.height / 2;
  frog.velocityY = 0;
  kelpObstacles = [];

  for (let index = 0; index < 3; index += 1) {
    createKelp(canvas.width + 170 + index * kelpSpacing);
  }

  gameState = "playing";
}

/**
 * Pushes the frog upward by replacing its vertical speed.
 * Gravity will immediately begin pulling it down again on later frames.
 */
function jumpFrog() {
  frog.velocityY = jumpStrength;
}

/**
 * Responds to every supported control based on the current game state.
 * The same action starts, plays, and restarts the game to keep controls simple.
 */
function handleAction() {
  if (gameState === "start" || gameState === "gameover") {
    restartGame();
    jumpFrog();
    return;
  }

  jumpFrog();
}

/**
 * Applies gravity and vertical movement to the frog once per playing frame.
 */
function updateFrog() {
  frog.velocityY += gravity;
  frog.y += frog.velocityY;
}

/**
 * Moves each kelp pair left and recycles obstacles that leave the screen.
 * Recycling keeps the list small and makes the game continue indefinitely.
 */
function moveKelp() {
  for (const obstacle of kelpObstacles) {
    obstacle.x -= kelpSpeed;
  }

  if (kelpObstacles.length > 0 && kelpObstacles[0].x + kelpWidth < 0) {
    kelpObstacles.shift();
    const lastObstacle = kelpObstacles[kelpObstacles.length - 1];
    createKelp(lastObstacle.x + kelpSpacing);
  }
}

/**
 * Awards one point after the frog completely passes an unscored obstacle.
 */
function updateScore() {
  for (const obstacle of kelpObstacles) {
    if (!obstacle.scored && obstacle.x + kelpWidth < frog.x - frog.radius) {
      obstacle.scored = true;
      score += 1;
    }
  }
}

/**
 * Checks whether the frog overlaps the solid top or bottom part of one kelp pair.
 * A circle-sized bounding box keeps collision math approachable for beginners.
 */
function frogTouchesKelp(obstacle) {
  const frogLeft = frog.x - frog.radius;
  const frogRight = frog.x + frog.radius;
  const frogTop = frog.y - frog.radius;
  const frogBottom = frog.y + frog.radius;
  const obstacleRight = obstacle.x + kelpWidth;
  const gapBottom = obstacle.gapY + kelpGap;

  const overlapsHorizontally =
    frogRight > obstacle.x && frogLeft < obstacleRight;
  const touchesSolidKelp = frogTop < obstacle.gapY || frogBottom > gapBottom;

  return overlapsHorizontally && touchesSolidKelp;
}

/**
 * Ends the round when the frog touches a boundary or any kelp obstacle.
 */
function checkCollisions() {
  const touchesTop = frog.y - frog.radius <= 0;
  const touchesFloor = frog.y + frog.radius >= floorY;
  const touchesKelp = kelpObstacles.some(frogTouchesKelp);

  if (touchesTop || touchesFloor || touchesKelp) {
    gameState = "gameover";
  }
}

/**
 * Moves decorative bubbles upward and wraps them back to the ocean floor.
 */
function updateBubbles() {
  for (const bubble of bubbles) {
    bubble.y -= bubble.speed;

    if (bubble.y + bubble.radius < 0) {
      bubble.y = floorY;
    }
  }
}

/**
 * Paints the turquoise water and a soft light area near the surface.
 */
function drawWater() {
  const waterGradient = context.createLinearGradient(0, 0, 0, canvas.height);
  waterGradient.addColorStop(0, "#35d5d0");
  waterGradient.addColorStop(0.52, "#118eb1");
  waterGradient.addColorStop(1, "#075877");

  context.fillStyle = waterGradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "rgba(226, 255, 239, 0.12)";
  context.beginPath();
  context.ellipse(180, 20, 260, 100, -0.1, 0, Math.PI * 2);
  context.fill();
}

/**
 * Draws subtle bubble outlines behind the main game objects.
 */
function drawBubbles() {
  context.strokeStyle = "rgba(220, 255, 255, 0.38)";
  context.lineWidth = 2;

  for (const bubble of bubbles) {
    context.beginPath();
    context.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
    context.stroke();
  }
}

/**
 * Draws one solid kelp section with stems and simple side leaves.
 * The growsDown flag flips the leaf direction for top-hanging kelp.
 */
function drawKelpSection(x, y, height, growsDown) {
  const stalkCount = 4;
  const stalkWidth = kelpWidth / stalkCount;

  context.fillStyle = "#188b4f";
  context.fillRect(x, y, kelpWidth, height);

  for (let index = 0; index < stalkCount; index += 1) {
    const stalkX = x + index * stalkWidth + stalkWidth / 2;
    const tipY = growsDown ? y + height : y;

    context.strokeStyle = index % 2 === 0 ? "#39bd65" : "#62d477";
    context.lineWidth = 8;
    context.lineCap = "round";
    context.beginPath();
    context.moveTo(stalkX, growsDown ? y : y + height);
    context.quadraticCurveTo(
      stalkX + (index % 2 === 0 ? 9 : -9),
      y + height / 2,
      stalkX,
      tipY,
    );
    context.stroke();

    context.fillStyle = "#72df80";
    context.beginPath();
    context.ellipse(
      stalkX + (index % 2 === 0 ? -8 : 8),
      growsDown ? tipY - 9 : tipY + 9,
      13,
      7,
      index % 2 === 0 ? -0.6 : 0.6,
      0,
      Math.PI * 2,
    );
    context.fill();
  }
}

/**
 * Draws the top and bottom kelp sections for every active obstacle.
 */
function drawKelp() {
  for (const obstacle of kelpObstacles) {
    const bottomY = obstacle.gapY + kelpGap;
    drawKelpSection(obstacle.x, 0, obstacle.gapY, true);
    drawKelpSection(obstacle.x, bottomY, floorY - bottomY, false);
  }
}

/**
 * Paints sand, pebbles, and a darker lower edge to suggest an ocean floor.
 */
function drawOceanFloor() {
  context.fillStyle = "#e9c77b";
  context.fillRect(0, floorY, canvas.width, floorHeight);

  context.fillStyle = "#d3a95c";
  context.beginPath();
  context.moveTo(0, floorY + 14);
  context.quadraticCurveTo(170, floorY - 8, 330, floorY + 14);
  context.quadraticCurveTo(530, floorY + 36, 700, floorY + 10);
  context.quadraticCurveTo(810, floorY - 3, canvas.width, floorY + 14);
  context.lineTo(canvas.width, canvas.height);
  context.lineTo(0, canvas.height);
  context.closePath();
  context.fill();

  const rocks = [70, 145, 290, 455, 610, 735, 840];
  context.fillStyle = "#71877f";
  for (const rockX of rocks) {
    context.beginPath();
    context.ellipse(rockX, floorY + 42, 12, 8, -0.2, 0, Math.PI * 2);
    context.fill();
  }
}

/**
 * Draws the frog from simple circles and ellipses, rotated slightly by its speed.
 */
function drawFrog() {
  const tilt = Math.max(-0.35, Math.min(0.45, frog.velocityY * 0.045));

  context.save();
  context.translate(frog.x, frog.y);
  context.rotate(tilt);

  // Legs sit behind the body so the frog reads clearly at a small size.
  context.fillStyle = "#67dc58";
  context.beginPath();
  context.ellipse(-21, 13, 15, 7, -0.5, 0, Math.PI * 2);
  context.ellipse(21, 13, 15, 7, 0.5, 0, Math.PI * 2);
  context.fill();

  // The bright body and lighter belly create the frog's simple silhouette.
  context.fillStyle = "#5fe253";
  context.beginPath();
  context.ellipse(0, 2, 26, 22, 0, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = "#c8f27c";
  context.beginPath();
  context.ellipse(0, 9, 15, 10, 0, 0, Math.PI * 2);
  context.fill();

  // Large eyes and a tiny smile give the character a friendly expression.
  context.fillStyle = "#76eb62";
  context.beginPath();
  context.arc(-12, -16, 10, 0, Math.PI * 2);
  context.arc(12, -16, 10, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = "#173d42";
  context.beginPath();
  context.arc(-10, -17, 4, 0, Math.PI * 2);
  context.arc(10, -17, 4, 0, Math.PI * 2);
  context.fill();

  context.strokeStyle = "#26723b";
  context.lineWidth = 2;
  context.beginPath();
  context.arc(0, 0, 8, 0.2, Math.PI - 0.2);
  context.stroke();

  context.restore();
}

/**
 * Displays the current score during play in a high-contrast rounded panel.
 */
function drawScore() {
  context.fillStyle = "rgba(2, 52, 73, 0.62)";
  context.beginPath();
  context.roundRect(canvas.width / 2 - 47, 22, 94, 58, 18);
  context.fill();

  context.fillStyle = "#ffffff";
  context.font = "bold 34px Trebuchet MS";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(String(score), canvas.width / 2, 51);
}

/**
 * Draws a reusable centered panel for the start and game-over messages.
 */
function drawMessagePanel(title, lines) {
  const panelWidth = 490;
  const panelHeight = 220;
  const panelX = (canvas.width - panelWidth) / 2;
  const panelY = 155;

  context.fillStyle = "rgba(3, 52, 75, 0.84)";
  context.beginPath();
  context.roundRect(panelX, panelY, panelWidth, panelHeight, 28);
  context.fill();

  context.strokeStyle = "rgba(191, 255, 230, 0.7)";
  context.lineWidth = 3;
  context.stroke();

  context.fillStyle = "#fff6b7";
  context.font = "bold 44px Trebuchet MS";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(title, canvas.width / 2, panelY + 62);

  context.fillStyle = "#e7ffff";
  context.font = "22px Trebuchet MS";
  lines.forEach(function (line, index) {
    context.fillText(line, canvas.width / 2, panelY + 120 + index * 38);
  });
}

/**
 * Draws every layer in back-to-front order for the current frame.
 */
function drawScene() {
  drawWater();
  drawBubbles();
  drawKelp();
  drawOceanFloor();
  drawFrog();

  if (gameState === "playing") {
    drawScore();
  } else if (gameState === "start") {
    drawMessagePanel("Jumpy Frog", ["Swim through the kelp!", "Press Space, click, or tap"]);
  } else {
    drawMessagePanel("Splash!", [
      "Final score: " + score,
      "Press Space, click, or tap to restart",
    ]);
  }
}

/**
 * Advances game state, redraws the scene, and schedules the next animation frame.
 */
function gameLoop() {
  updateBubbles();

  if (gameState === "playing") {
    updateFrog();
    moveKelp();
    updateScore();
    checkCollisions();
  }

  drawScene();
  window.requestAnimationFrame(gameLoop);
}

// Keyboard and pointer events share one action so every control behaves consistently.
window.addEventListener("keydown", function (event) {
  if (event.code === "Space") {
    event.preventDefault();
    handleAction();
  }
});

canvas.addEventListener("pointerdown", function (event) {
  event.preventDefault();
  canvas.focus();
  handleAction();
});

// Initial obstacles make the start screen look like the game before movement begins.
for (let index = 0; index < 3; index += 1) {
  createKelp(canvas.width + 170 + index * kelpSpacing);
}

gameLoop();
