class Bot {
  constructor(x, y, brain, angle) {
    this.position = createVector(x, y);
    this.width = botWidth;
    this.height = botHeight;
    this.speed = botSpeed;
    this.centerPosition = createVector(this.position.x + this.width / 2, this.position.y + this.height / 2);
    this.angle = angle;
    this.aimRadius = aimRadius;
    this.aimAngle = aimAngle;
    this.shot = false;
    this.alive = true;
    this.score = 10;
    this.fitness = 0;
    this.frameShotted = -Infinity;

    if (brain instanceof NeuralNetwork) {
      this.brain = brain.copy();
    } else {
      this.brain = new NeuralNetwork(inputNodes, hiddenNodes, outputNodes);
    }
  }

  act(bullet, bot) {
    let inputs = new Array();
    let shotBullet = undefined;

    inputs[0] = this.position.x / width;
    inputs[1] = this.position.y / height;
    inputs[2] = this.angle / 360;
    if (bullet instanceof Bullet) {
      inputs[3] = bullet.position.x / width;
      inputs[4] = bullet.position.y / height;
    } else {
      inputs[3] = 0;
      inputs[4] = 0;
    }

    if (bot instanceof Bot) {
      inputs[5] = bot.position.x / width;
      inputs[6] = bot.position.y / height;
    } else {
      inputs[5] = 0;
      inputs[6] = 0;
    }

    let outputs = this.brain.predict(inputs);

    let temporal = sortOutputs(outputs.slice(2));
    switch (temporal[0].index) {
      case 0:
        this.forward(temporal[0].value);
        break;
      case 1:
        this.backwards(temporal[0].value);
        break;
      default:
        break;
    }

    // Shoot output
    if (outputs[2] >= 0.7) {
      shotBullet = this.shoot();
    }

    // Rotate outputs
    temporal = sortOutputs(outputs.slice(3, 5));
    switch (temporal[0].index) {
      case 0:
        this.rotate(angleFactor * temporal[0].value);
        break;
      case 1:
        this.rotate(-angleFactor * temporal[0].value);
        break;
      default:
        break;
    }

    return shotBullet;
  }

  forward(speedMultiplier = 1) {
    this.position.x += speedMultiplier * this.speed * cos(this.angle);
    this.position.y += speedMultiplier * this.speed * sin(this.angle);
    this.centerPosition.x += speedMultiplier * this.speed * cos(this.angle);
    this.centerPosition.y += speedMultiplier * this.speed * sin(this.angle);
  }

  backwards(speedMultiplier = 1) {
    this.position.x -= speedMultiplier * this.speed * cos(this.angle);
    this.position.y -= speedMultiplier * this.speed * sin(this.angle);
    this.centerPosition.x -= speedMultiplier * this.speed * cos(this.angle);
    this.centerPosition.y -= speedMultiplier * this.speed * sin(this.angle);
  }

  showAim(color) {
    stroke(color);
    line(this.position.x, this.position.y, this.position.x + this.aimRadius * cos((this.angle + this.aimAngle / 2)),
      this.position.y + this.aimRadius * sin((this.angle + this.aimAngle / 2)));

    line(this.position.x, this.position.y, this.position.x + this.aimRadius * cos((this.angle - this.aimAngle / 2)),
      this.position.y + this.aimRadius * sin((this.angle - this.aimAngle / 2)));
  }

  shoot() {
    if (!this.shot && frameCounter - this.frameShotted >= framesToShoot) {
      this.frameShotted = frameCounter;
      return new Bullet(this.position.x, this.position.y, this.angle);
    }
  }

  checkAim(target) {
    if (target === undefined) return false;

    let d = calculateSquareDistance(this.position, target.position);
    let unitary = createVector(cos(this.angle), sin(this.angle));
    let b = createVector(target.position.x - this.position.x, target.position.y - this.position.y);
    let angle = angleOfVectors(unitary, b);

    if (d < pow(this.aimRadius, 2) && angle <= aimAngle / 2) {
      return true;
    }
    else {
      return false;
    }
  }

  reduceScore(score) {
    this.score -= score;
    if (this.score < 1) this.score = 1;
  }

  rotate(angle) {
    this.angle += angle;
    if (this.angle > 360) this.angle -= 360;
    if (this.angle < 0) this.angle += 360;
  }

  offScreen() {
    if (this.position.x + this.width / 2 < 0 || this.position.x - this.width / 2 > width || this.position.y + this.height / 2 > height || this.position.y + this.height / 2 < 0) {
      return true;
    }
    return false;
  }

  show(color) {
    push();
    stroke(0);
    fill(color);
    translate(this.position.x, this.position.y);
    rotate(this.angle);
    rectMode(CENTER);
    rect(0, 0, this.width, this.height);
    pop();
  }
}

function botsAct(blueBots, redBots, blueBullets, redBullets, i) {
  let bullet = undefined;
  if (blueBots[i].alive && redBots[i].alive) {
    // Blue Bot.
    let aimBullet = undefined;
    let aimTarget = undefined;

    // Check if an enemy bullet is in the aim.
    if (blueBots[i].checkAim(redBullets[i])) {
      aimBullet = redBullets[i];
    }

    // Check if an enemy bot is in the aim.
    if (blueBots[i].checkAim(redBots[i])) {
      blueBots[i].score += scoreWhileAiming;
      aimTarget = redBots[i];
    }

    bullet = blueBots[i].act(aimBullet, aimTarget);

    if (!blueBots[i].shot && bullet !== undefined) {
      let bulletAngle = getShotAngle(blueBots[i], redBots[i]);

      blueBots[i].shot = true;
      /*
      if (bulletAngle < hitAngleRange) {
        bullet.gonnaHit = true;
        blueBots[i].score += getAngleFitness(bulletAngle);
      }
      else {
        blueBots[i].reduceScore(missingShotScore)
      }
      */
      if (bulletAngle < hitAngleRange) {
        bullet.gonnaHit = true;
      }
      blueBots[i].score += getAngleFitness(bulletAngle);
      blueBullets[i] = bullet;
    }

    if (blueBots[i].offScreen()) {
      blueBots[i].reduceScore(offScreenScore);
      blueBots[i].alive = false;
    }


    // Red Bot.
    aimBullet = undefined;
    aimTarget = undefined;

    // Check if an enemy bullet is in the aim.
    if (redBots[i].checkAim(blueBullets[i])) {
      aimBullet = blueBullets[i];
    }

    // Check if an enemy bot is in the aim.
    if (redBots[i].checkAim(blueBots[i])) {
      redBots[i].score += scoreWhileAiming;
      aimTarget = blueBots[i];
    }

    bullet = redBots[i].act(aimBullet, aimTarget);

    if (!redBots[i].shot && bullet !== undefined) {
      let bulletAngle = getShotAngle(redBots[i], blueBots[i]);
      redBots[i].shot = true;
      // if (bulletAngle < hitAngleRange) {
      //   bullet.gonnaHit = true;
      //   redBots[i].score += getAngleFitness(bulletAngle);
      // }
      // else {
      //   redBots[i].reduceScore(missingShotScore)
      // }
      if (bulletAngle < hitAngleRange) {
        bullet.gonnaHit = true;
      }
      redBots[i].score += getAngleFitness(bulletAngle);
      redBullets[i] = bullet;
    }

    if (redBots[i].offScreen()) {
      redBots[i].reduceScore(offScreenScore);
      redBots[i].alive = false;
    }
  }
}

function showBots(blueBots, redBots, blueBullets, redBullets) {
  for (let i = 0; i < blueBots.length; i++) {
    if (blueBullets[i] !== undefined) {
      blueBullets[i].show(blue);
    }

    if (redBullets[i] !== undefined) {
      redBullets[i].show(red);
    }

    if (blueBots[i].alive && redBots[i].alive) {
      blueBots[i].showAim(blue);
      blueBots[i].show(blue);
      redBots[i].showAim(red);
      redBots[i].show(red);
    }
  }
}