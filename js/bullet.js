class Bullet {
  constructor(x, y, angle) {
    this.position = createVector(x, y);
    this.angle = angle;
    this.width = bulletWidth;
    this.height = bulletHeight;
    this.speed = bulletSpeed;
    this.centerPosition = createVector(this.position.x + this.width / 2, this.position.y + this.height / 2);
  }

  move() {
    this.position.x += this.speed * cos(-this.angle);
    this.position.y += this.speed * sin(-this.angle);
  }

  offscreen() {
    if (this.centerPosition.x < 0 || this.centerPosition.x > width || this.centerPosition.y < 0 || this.centerPosition.y > height) return true;
    return false;
  }

  show() {
    push();
    stroke(0);
    fill(255, 0, 0);
    translate(this.position.x, this.position.y);
    rotate(-this.angle);
    rectMode(CENTER);
    rect(0, 0, this.width, this.height);
    //imageMode(CENTER);
    //image(this.image, 0, 0);
    pop();
  }
}