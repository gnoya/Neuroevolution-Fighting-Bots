// Gameplay
const blueBotX = 200;
const blueBotY = 300;
const redBotX = 600;
const redBotY = 300;

const botWidth = 50;
const botHeight = 25;
const botSpeed = 2;
const bulletWidth = 20;
const bulletHeight = 6;
const bulletSpeed = 10;
const aimAngle = 30;
const aimRadius = 600;

const red = [255, 0, 0, 100];
const blue = [0, 0, 255, 100]
// Neural Network
const inputNodes = 7;
const hiddenNodes = 6;
const outputNodes = 5;
const angleFactor = 3;

// Genetic Algorithms
let blueBots = new Array();
let redBots = new Array();

let blueBullets = new Array();
let redBullets = new Array();

let blueBot;
let redBot;

const totalPopulation = 1;

function setup() {
  frameRate(60);
  pixelDensity(1);
  angleMode(DEGREES);
  let canvas = createCanvas(800, 600);
  canvas.parent('canvasContainer');
  for (let i = 0; i < totalPopulation; i++) {
    blueBots.push(new Bot(blueBotX, blueBotY));
    redBots.push(new Bot(redBotX, redBotY));
  }
  blueBot = new Bot(100, 100);
  redBot = new Bot(200, 0);

}

function draw() {
  let bullet = undefined;

  for (let i = 0; i < totalPopulation; i++) {
    if (blueBullets[i] !== undefined) {
      blueBullets[i].move();
      if (blueBullets[i].offscreen()) {
        blueBullets[i] = undefined;
        blueBots[i].shot = false;
      }
    }

    if (redBullets[i] !== undefined) {
      redBullets[i].move();
      if (redBullets[i].offscreen()) {
        redBullets[i] = undefined;
        redBots[i].shot = false;
      }
    }

    /*
    if (blueBots[i].alive) {
      bullet = blueBots[i].act(undefined, undefined);
      if (!blueBots[i].shot && bullet !== undefined) {
        if (bulletHit(bullet, blueBots[i], redBots[i])) {
          blueBots[i].score += 50;
        }
        blueBots[i].shot = true;
        blueBullets[i] = bullet;
      }

      bullet = redBots[i].act(undefined, undefined);
      if (!redBots[i].shot && bullet !== undefined) {
        if (bulletHit(bullet, redBots[i], blueBots[i])) {
          blueBots[i].score += 50;
        }
        redBots[i].shot = true;
        redBullets[i] = bullet;
      }
    }
    */
  }

  // Visuals.
  background(220);

  /*
  for (let i = 0; i < totalPopulation; i++) {
    if (blueBullets[i] !== undefined) {
      blueBullets[i].show(blue);
    }

    if (redBullets[i] !== undefined) {
      redBullets[i].show(red);
    }

    if (blueBots[i].alive) {
      blueBots[i].showAim(blue);
      blueBots[i].show(blue);
    }

    if (redBots[i].alive) {
      redBots[i].showAim(red);
      redBots[i].show(red);
    }
  }*/

  blueBot.showAim(blue);
  blueBot.show(blue);
  redBot.showAim(red);
  redBot.show(red);


}

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
  let b = createVector(bullet.position.x - target.position.x, bullet.position.y - target.position.y);
  let angle = angleOfVectors(unitary, b);
  return 50 * exp(-(angle) / 50);
}