const botWidth = 100;
const botHeight = 50;
const botSpeed = 2;
const bulletWidth = 20;
const bulletHeight = 7;
const bulletSpeed = 10;
const aimAngle = 40;
const aimRadius = 400;

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

  //bot.forward();
  bot.showAim();
  bot.show();
}
