function sortOutputs(outputs) {
  let result = new Array();
  for (let i = 0; i < outputs.length; i++) {
    result.push({
      index: i,
      value: outputs[i]
    });
  }
  result.sort(function (a, b) {
    return ((a.value < b.value) ? 1 : ((a.value == b.value) ? 0 : -1));
  });
  // return result.map(a => a.index);
  return result;
}

// The first vector MUST BE unitary.
function angleOfVectors(unitary, b) {
  return Number(acos(unitary.dot(b) / (b.mag())).toFixed(2));
}

function getShotAngle(bullet, target) {
  let unitary = createVector(cos(bullet.angle), sin(bullet.angle));
  let b = createVector(target.position.x - bullet.position.x, target.position.y - bullet.position.y);
  let angle = angleOfVectors(unitary, b);
  return angle;
}

function getAngleFitness(angle) {
  if (angle <= fitnessAngleCut) {
    return - maxAimScore / fitnessAngleCut * (angle - fitnessAngleCut);
  }
  else {
    return - maxAimScore / (180 - fitnessAngleCut) * (angle - fitnessAngleCut)
  }

}

function restartGame() {
  frameCounter = 0;
  blueBullets = new Array();
  redBullets = new Array();

  bestBlueBot = new Array();
  bestRedBot = new Array();
  bestBlueBullets = new Array();
  bestRedBullets = new Array();

  if (showBest.checked()) {
    bestBlueBot.push(new Bot(blueBotX, blueBotY, bestBot.brain, 0));
    bestRedBot.push(new Bot(redBotX, redBotY, bestBot.brain, 180));
  }
}

function calculateSquareDistance(u, v) {
  return pow(u.x - v.x, 2) + pow(u.y - v.y, 2);
}

function initializeDOMElements() {
  canvas = createCanvas(800, 600);
  canvas.parent('canvasContainer');
  slider = select('#slider');
  speedText = select('#speed');
  generationText = select('#generation');
  currentScoreText = select('#currentScore');
  averageScoreText = select('#averageScore');
  highestScoreText = select('#highestScore');
  checkBox = select('#checkBox');
  showBest = select('#showBest');
  //showBest.elt.disabled = true;
}
