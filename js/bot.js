class Bot {
  constructor() {
    this.position = createVector(botX, botY);
    this.width = botWidth;
    this.height = botHeight;
    this.speed = botSpeed;
    this.centerPosition = createVector(this.position.x + this.width / 2, this.position.y + this.height / 2);
    this.angle = -30;
    this.aimRadius = aimRadius;
    this.aimAngle = aimAngle;
    this.shot = false;
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