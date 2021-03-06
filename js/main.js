// Gameplay
const blueBotX = 200;
const blueBotY = 300;
const redBotX = 600;
const redBotY = 300;

const botWidth = 35;
const botHeight = 14;
const botSpeed = 1.5;
const bulletWidth = 12;
const bulletHeight = 4;
const bulletSpeed = 6;
const aimAngle = 40;
const aimRadius = 1000;

const red = [255, 0, 0, 100];
const blue = [0, 0, 255, 100];

// Neural Network
const inputNodes = 7;
const hiddenNodes = 6;
const outputNodes = 5;
const angleFactor = 10;

// Genetic Algorithms
let blueBots = new Array();
let redBots = new Array();
let bestBlueBot = new Array();
let bestRedBot = new Array();

const mutationRate = 0.075;

let frameCounter = 0;
let framesPerGeneration = 650;
const framesToShoot = 50;

let deadBots = 0;
let generation = 0;
let highestScore = 0;
let bestBot;

let blueBullets = new Array();
let redBullets = new Array();
let bestBlueBullets = new Array();
let bestRedBullets = new Array();

const totalPopulation = 150;
const maxAimScore = 8; // Score to add when the bot aimed correctly.
const maxAddHitScore = 2; // Score to add when the bot hit the target.
const maxSubstractHitScore = 7; // Score to substract when a bullet hits the bot.
const maxAddDodgeScore = 10; // Score to add when the bot dodges a bullet (this condition is defined when the enemy bot shoots).
const hitAngleRange = 5;
const scoreWhileAiming = 0.02; // Score to add when the enemy bot is on bot's aim.
const offScreenScore = 5000;


// DOM variables.
let canvas;
let slider;
let speed;
let generationText;
let currentScoreText;
let averageScoreText;
let highestScoreText;
let checkBox;
let showBest;
let saveButton;

function setup() {
  frameRate(500);
  pixelDensity(1);
  angleMode(DEGREES);

  // DOM elements.
  initializeDOMElements();

  for (let i = 0; i < totalPopulation; i++) {
    blueBots.push(new Bot(blueBotX, blueBotY, 0, 0));
    redBots.push(new Bot(redBotX, redBotY, 0, 180));
  }
}

function draw() {
  speedText.html(slider.value());
  if (!showBest.checked()) {
    for (let i = 0; i < slider.value(); i++) {
      if (frameCounter++ != framesPerGeneration && !(deadBots >= totalPopulation)) {
        for (let i = 0; i < totalPopulation; i++) {
          bulletMovement(blueBullets, blueBots, redBots, i, true);
          bulletMovement(redBullets, redBots, blueBots, i, true);
          botsAct(blueBots, redBots, blueBullets, redBullets, i);
        }
      }
      else {
        deadBots = 0;
        nextGeneration(blueBots, redBots);
        generationText.html(++generation);
      }
    }
    // Visuals.
    if (!checkBox.checked()) {
      background(220);
      showBots(blueBots, redBots, blueBullets, redBullets);
    }
  }
  else {
    bulletMovement(bestBlueBullets, bestBlueBot, bestRedBot, 0, false);
    bulletMovement(bestRedBullets, bestRedBot, bestBlueBot, 0, false);
    botsAct(bestBlueBot, bestRedBot, bestBlueBullets, bestRedBullets, 0);
    // Visuals.
    background(220);
    showBots(bestBlueBot, bestRedBot, bestBlueBullets, bestRedBullets);
    frameCounter++;
  }
}