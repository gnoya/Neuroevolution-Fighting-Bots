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

function getAngleFitness(bullet, target) {
  let unitary = createVector(cos(bullet.angle), sin(bullet.angle));
  let b = createVector(target.position.x - bullet.position.x, target.position.y - bullet.position.y);
  let angle = angleOfVectors(unitary, b);
  return 50 * exp(-(angle) / 5);
}

function restartGame() {
  blocks = new Array();
  frameCounter = 0;
  deadPlayers = new Array();
}