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
  }

  //bot.rotate(2);
  //bot.forward();


  // Visuals.
  background(220);

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
  }


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

function bulletHit(bullet, originBot, targetBot) {
  let deltaY = originBot.position.y - targetBot.position.y;
  let deltaX = originBot.position.x - targetBot.position.x;
  let tangent = tan(bullet.angle);
  console.log('tangent: ' + tangent)
  console.log('delta : ' + deltaY / deltaX);
  if (tangent == deltaY / deltaX) {
    return true;
  }
  else {
    return false;
  }
}