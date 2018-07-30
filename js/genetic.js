function nextGeneration(bots1, bots2) {
  let players = bots1.concat(bots2);
  calculateFitness(players);
  players = naturalSelection(players);
  blueBots = players.slice(0, totalPopulation);
  redBots = players.slice(totalPopulation, players.length);
  for (let i = 0; i < totalPopulation; i++) {
    blueBots[i].position.x = blueBotX;
    blueBots[i].position.y = blueBotY;
    blueBots[i].angle = 0;
    redBots[i].position.x = redBotX;
    redBots[i].position.y = redBotY;
    redBots[i].angle = 180;
  }
  restartGame();
}

function calculateFitness(players) {
  let totalScore = 0;
  // Calculate total score.
  for (let player of players) {
    totalScore += player.score;
    if (player.score > highestScore) {
      highestScore = player.score;
      highestScoreText.html(player.score.toFixed(0));
      bestBot = new Bot(0, 0, player.brain, 0);
      //bestPlayer = new Player(player.brain);
    }
  }
  // Normalize fitness between 0 and 1.
  for (let player of players) {
    player.fitness = player.score / totalScore;
  }
}


function naturalSelection(players) {
  let newGeneration = new Array();
  for (let player of players) {
    // For every player, make a child from two parents.
    let parentA = poolSelection(players);
    let parentB = poolSelection(players);
    let child = crossover(parentA, parentB);
    child.brain.mutate(mutate);
    newGeneration.push(child);
  }
  return newGeneration;
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
  return new Bot(0, 0, brainA);
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