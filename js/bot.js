class Bot {
  constructor(x, y, index, brain) {
    this.position = createVector(x, y);
    this.width = botWidth;
    this.height = botHeight;
    this.speed = botSpeed;
    this.centerPosition = createVector(this.position.x + this.width / 2, this.position.y + this.height / 2);
    this.angle = -30;
    this.aimRadius = aimRadius;
    this.aimAngle = aimAngle;
    this.shot = false;
    this.alive = true;

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
      inputs[3] = 100;
      inputs[4] = 100;
    }

    if (bot instanceof Bot) {
      inputs[5] = bot.position.x / width;
      inputs[6] = bot.position.y / height;
    } else {
      inputs[5] = 100;
      inputs[6] = 100;
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
    this.position.x += this.speed * cos(-this.angle);
    this.position.y += this.speed * sin(-this.angle);
    this.centerPosition.x += this.speed * cos(-this.angle);
    this.centerPosition.y += this.speed * sin(-this.angle);
  }

  showAim(color) {
    stroke(color);
    line(this.position.x, this.position.y, this.position.x + this.aimRadius * cos(-(this.angle + this.aimAngle / 2)),
      this.position.y + this.aimRadius * sin(-(this.angle + this.aimAngle / 2)));

    line(this.position.x, this.position.y, this.position.x + this.aimRadius * cos(-(this.angle - this.aimAngle / 2)),
      this.position.y + this.aimRadius * sin(-(this.angle - this.aimAngle / 2)));
  }

  shoot() {
    if (!this.shot) {
      //this.shot = true;
      //bullets.push(new Bullet(this.position.x, this.position.y, this.angle));
      return new Bullet(this.position.x, this.position.y, this.angle);
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
    rotate(-this.angle);
    rectMode(CENTER);
    rect(0, 0, this.width, this.height);
    //imageMode(CENTER);
    //image(this.image, 0, 0);
    pop();
  }
}