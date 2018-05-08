const botWidth = 100;
const botHeight = 50;
const botSpeed = 2;
const bulletWidth = 10;
const bulletHeight = 20;
const bulletSpeed = 10;
const aimAngle = 40;
const aimRadius = 400;

let bot;

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
  bot.forward();
  bot.showAim();
  bot.show();
  bot.rotate(0.5);
}
