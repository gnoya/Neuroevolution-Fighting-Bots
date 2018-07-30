/*
Probar scores +1 y -1 solo con hits y esquivadas
Precision de tiro y disparo. Revisar distancia con linea perpendicular al angulo de disparo.
Evitar sumar score a esquviadas de disparo muy lejanas.
Agregar puntuacion por estar en la mira: cantidad de frames en mira / frames totales.
*/


// Gameplay
const blueBotX = 200;
const blueBotY = 300;
const redBotX = 600;
const redBotY = 300;

const botWidth = 50;
const botHeight = 25;
const botSpeed = 2.5;
const bulletWidth = 20;
const bulletHeight = 6;
const bulletSpeed = 8;
const aimAngle = 27;
const aimRadius = 600;

const red = [255, 0, 0, 100];
const blue = [0, 0, 255, 100];

// Neural Network
const inputNodes = 7;
const hiddenNodes = 6;
const outputNodes = 5;
const angleFactor = 8;

// Genetic Algorithms
let blueBots = new Array();
let redBots = new Array();
let bestBlueBot = new Array();
let bestRedBot = new Array();

const mutationRate = 0.08;
let frameCounter = 0;
let framesPerGeneration = 700;
let deadBots = 0;
let generation = 0;
let highestScore = 0;
let bestBot;

let blueBullets = new Array();
let redBullets = new Array();
let bestBlueBullets = new Array();
let bestRedBullets = new Array();

const totalPopulation = 150;
const maxAimScore = 8000; // Add score when the bot aimed correctly.
const maxSubstractHitScore = 12000; // Substract score when a bullet hits the current bot.
const scoreWhileAiming = 20; // Suma cuando el bot enemigo esta en la mira.
const scoreWhileDistanced = 0;
const offScreenScore = 5000;

const minDistanceAllowed = 50000;
const maxDistanceAllowed = 320000;


// DOM variables.
let canvas;
let slider;
let generationText;
let currentScoreText;
let averageScoreText;
let highestScoreText;
let checkBox;
let showBest;
let saveButton;

function setup() {
  frameRate(60);
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
  }
}