function nextGeneration(players) {
  calculateFitness(players);
  naturalSelection(players);
  restartGame();
}

function calculateFitness(players) {
  let totalScore = 0;
  // Calculate total score.
  for (let player of players) {
    totalScore += player.score;
  }
  // Normalize fitness between 0 and 1.
  for (let player of players) {
    player.fitness = player.score / totalScore;
  }
}

function naturalSelection(players) {
  for (let player of players) {
    // For every player, make a child from two parents.
    let parentA = poolSelection(players);
    let parentB = poolSelection(players);

    let child = crossover(parentA, parentB);
    child.brain.mutate(mutate);
    alivePlayers.push(child);
  }
}

function poolSelection(players) {
  let index = 0;
  let r = random(1);
  // Keep subtracting probabilities until you get less than zero
  // Higher probabilities will be more likely to be fixed since they will
  // subtract a larger number towards zero
  while (r > 0) {
    r -= players[index].fitness;
    index += 1;
  }
  index -= 1;
  return players[index];
}

function crossover(parentA, parentB) {
  let brainA = parentA.brain.copy();
  let brainB = parentB.brain.copy();
  // We take weights from both parents and crossover them in child's brain.
  brainA.weights_ho = brainB.weights_ho.copy();
  brainA.bias_o = brainB.bias_o.copy();
  // Returning child.
  return brainA;
}

function mutate(x) {
  if (random(1) < mutationRate) {
    let offset = randomGaussian() * 0.5;
    let newx = x + offset;
    return newx;
  } else {
    return x;
  }
}