const botWidth = 100;
const botHeight = 50;
const bulletWidth = 10;
const bulletHeight = 20;
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
  bot.showAim();
  bot.show();
  bot.angle++;

}
