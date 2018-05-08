// Gameplay
const botX = 300;
const botY = 300;
const botWidth = 100;
const botHeight = 50;
const botSpeed = 2;
const bulletWidth = 20;
const bulletHeight = 7;
const bulletSpeed = 10;
const aimAngle = 40;
const aimRadius = 400;

// Neural Network
const inputNodes = 7;
const hiddenNodes = 5;
const outputNodes = 4;
const angleFactor = 3;

let bot;
let bullets = new Array();

function setup() {
  frameRate(60);
  pixelDensity(1);
  angleMode(DEGREES);
  let canvas = createCanvas(800, 600);
  canvas.parent('canvasContainer');
  bot = new Bot();
}

function draw() {
  background(220);
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].move();
    bullets[i].show();
    if (bullets[i].offscreen()) {
      bullets.splice(i, 1);
      bot.shot = false;
    }
  }
  bot.rotate(2);
  bot.forward();

  //bot.act();

  bot.showAim();
  bot.show();
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
  return result.map(a => a.index);
}