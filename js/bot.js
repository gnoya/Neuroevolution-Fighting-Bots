class Bot {
  constructor(brain) {
    this.position = createVector(botX, botY);
    this.width = botWidth;
    this.height = botHeight;
    this.speed = botSpeed;
    this.centerPosition = createVector(this.position.x + this.width / 2, this.position.y + this.height / 2);
    this.angle = -30;
    this.aimRadius = aimRadius;
    this.aimAngle = aimAngle;
    this.shot = false;

    if (brain instanceof NeuralNetwork) {
      this.brain = brain.copy();
    } else {
      this.brain = new NeuralNetwork(inputNodes, hiddenNodes, outputNodes);
    }
  }

  act(bullet, bot) {
    let inputs = new Array();
    inputs[0] = this.position.x / width;
    inputs[1] = this.position.y / height;
    inputs[2] = this.angle / 360;
    if(bullet instanceof Bullet){
      inputs[3] = bullet.position.x / width;
      inputs[4] = bullet.position.y / height;
    } else {
      inputs[3] = 100;
      inputs[4] = 100;
    }

    if(bot instanceof Bot){
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
    if (outputs[1] > 0.5) this.shoot();
    if (outputs[2] > 0.5) {
      this.rotate(angleFactor * outputs[1]);
    }
    else {
      this.rotate(angleFactor * (outputs[1] + 0.5));
    }
  }

  forward() {
    this.position.x += this.speed * cos(-this.angle);
    this.position.y += this.speed * sin(-this.angle);
    this.centerPosition.x += this.speed * cos(-this.angle);
    this.centerPosition.y += this.speed * sin(-this.angle);
  }

  showAim() {
    //stroke(255, 0, 0);
    line(this.position.x, this.position.y, this.position.x + this.aimRadius * cos(-(this.angle + this.aimAngle / 2)),
      this.position.y + this.aimRadius * sin(-(this.angle + this.aimAngle / 2)));

    line(this.position.x, this.position.y, this.position.x + this.aimRadius * cos(-(this.angle - this.aimAngle / 2)),
      this.position.y + this.aimRadius * sin(-(this.angle - this.aimAngle / 2)));
  }

  shoot() {
    if (!this.shot) {
      this.shot = true;
      return new Bullet(this.position.x, this.position.y, this.angle);
    }
  }

  rotate(angle) {
    this.angle += angle;
    if (this.angle > 360) this.angle -= 360;
    if (this.angle < 0) this.angle += 360;
  }

  show() {
    push();
    stroke(0);
    fill(255);
    translate(this.position.x, this.position.y);
    rotate(-this.angle);
    rectMode(CENTER);
    rect(0, 0, this.width, this.height);
    //imageMode(CENTER);
    //image(this.image, 0, 0);
    pop();
  }
}