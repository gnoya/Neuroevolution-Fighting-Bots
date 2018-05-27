class Bullet {
  constructor(x, y, angle) {
    this.position = createVector(x, y);
    this.angle = angle;
    this.width = bulletWidth;
    this.height = bulletHeight;
    this.speed = bulletSpeed;
    this.hit = false;
    this.centerPosition = createVector(this.position.x + this.width / 2, this.position.y + this.height / 2);
  }

  move() {
    this.position.x += this.speed * cos(this.angle);
    this.position.y += this.speed * sin(this.angle);
    this.centerPosition.x += this.speed * cos(this.angle);
    this.centerPosition.y += this.speed * sin(this.angle);
  }

  offscreen() {
    if (this.centerPosition.x < 0 || this.centerPosition.x > width || this.centerPosition.y < 0 || this.centerPosition.y > height) return true;
    return false;
  }

  crashed(bot) {
    if ((abs(this.position.x - bot.position.x) <= this.width / 2 + bot.width / 2) &&
      (abs(this.position.y - bot.position.y) <= this.height / 2 + bot.height / 2)) {
      console.log('Crash')
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
    //imageMode(CENTER);
    //image(this.image, 0, 0);
    pop();
  }
}

function bulletMovement(bullets, friendlyBots, enemyBots, i) {
  if (bullets[i] !== undefined) {
    bullets[i].move();
    if (!bullets[i].hit && bullets[i].crashed(enemyBots[i])) {
      bullets[i].hit = true;
      enemyBots[i].reduceScore(maxHitScore);
    }
    if (bullets[i].offscreen()) {
      bullets[i] = undefined;
      friendlyBots[i].shot = false;
    }
  }
}