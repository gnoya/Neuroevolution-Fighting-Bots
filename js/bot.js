class Bot {
  constructor(x, y, index, brain) {
    this.position = createVector(x, y);
    this.width = botWidth;
    this.height = botHeight;
    this.speed = botSpeed;
    this.centerPosition = createVector(this.position.x + this.width / 2, this.position.y + this.height / 2);
    this.angle = 0;
    this.aimRadius = aimRadius;
    this.aimAngle = aimAngle;
    this.shot = false;
    this.alive = true;
    this.score = 1;
    this.fitness = 0;

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
    // Sort to see which output is the highest.
    //outputs = sortOutputs(outputs);
    if (outputs[0] > 0.5) this.forward();
    if (outputs[1] > 0.5) {
      shotBullet = this.shoot();
      //console.log(shotBullet)
    }
    let temporal = sortOutputs(outputs.slice(2, 5)); // 2, 3, 4
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

  forward() {
    this.position.x += this.speed * cos(this.angle);
    this.position.y += this.speed * sin(this.angle);
    this.centerPosition.x += this.speed * cos(this.angle);
    this.centerPosition.y += this.speed * sin(this.angle);
  }

  showAim(color) {
    stroke(color);
    line(this.position.x, this.position.y, this.position.x + this.aimRadius * cos((this.angle + this.aimAngle / 2)),
      this.position.y + this.aimRadius * sin((this.angle + this.aimAngle / 2)));

    line(this.position.x, this.position.y, this.position.x + this.aimRadius * cos((this.angle - this.aimAngle / 2)),
      this.position.y + this.aimRadius * sin((this.angle - this.aimAngle / 2)));
  }

  shoot() {
    if (!this.shot) {
      //this.shot = true;
      //bullets.push(new Bullet(this.position.x, this.position.y, this.angle));
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

  rotate(angle) {
    this.angle += angle;
    if (this.angle > 360) this.angle -= 360;
    if (this.angle < 0) this.angle += 360;
  }

  show(color) {
    push();
    stroke(0);
    fill(color);
    translate(this.position.x, this.position.y);
    rotate(this.angle);
    rectMode(CENTER);
    rect(0, 0, this.width, this.height);
    //imageMode(CENTER);
    //image(this.image, 0, 0);
    pop();
  }
}

function botsAct(blueBots, redBots, blueBullets, redBullets, i) {
  let bullet = undefined;
  if (blueBots[i].alive) {
    // Blue Bot.
    let aimBullet = undefined;
    let aimTarget = undefined;

    // Check if an enemy bullet is in the aim.
    if (blueBots[i].checkAim(redBullets[i])) {
      aimBullet = redBullets[i];
    }

    // Check if an enemy bot is in the aim.
    if (blueBots[i].checkAim(redBots[i])) {
      aimTarget = redBots[i];
    }

    bullet = blueBots[i].act(aimBullet, aimTarget);

    if (!blueBots[i].shot && bullet !== undefined) {
      blueBots[i].score += getAngleFitness(blueBots[i], redBots[i]);
      blueBots[i].shot = true;
      blueBullets[i] = bullet;
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
      aimTarget = blueBots[i];
    }

    bullet = redBots[i].act(aimBullet, aimTarget);

    if (!redBots[i].shot && bullet !== undefined) {
      redBots[i].score += getAngleFitness(redBots[i], blueBots[i]);
      redBots[i].shot = true;
      redBullets[i] = bullet;
    }
  }
}

function showBots(blueBots, redBots) {
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