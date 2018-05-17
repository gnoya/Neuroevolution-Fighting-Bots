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
const mutationRate = 0.05;

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
  for (let i = 0; i < totalPopulation; i++) {
    bulletMovement(blueBullets, blueBots, i);
    bulletMovement(redBullets, redBots, i);
    botsShooting(blueBots, redBots, i); 
  }

  // Visuals.
  background(220);
  showBots(blueBots, redBots);
}

//setInterval(nextGeneration(), 10000);