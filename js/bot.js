class Bot {
  constructor() {
    this.position = createVector(400, 300);
    this.width = botWidth;
    this.height = botHeight;
    this.centerPosition = createVector(this.position.x + this.width / 2, this.position.y + this.height / 2);
    this.angle = 0;
    this.aimRadius = aimRadius;
    this.aimAngle = aimAngle;
  }

  update() {

  }

  showAim() {
    //stroke(255, 0, 0);
    line(this.position.x, this.position.y, this.position.x + this.aimRadius * cos(-(this.angle + this.aimAngle / 2)),
      this.position.y + this.aimRadius * sin(-(this.angle + this.aimAngle / 2)));

    line(this.position.x, this.position.y, this.position.x + this.aimRadius * cos(-(this.angle - this.aimAngle / 2)),
      this.position.y + this.aimRadius * sin(-(this.angle - this.aimAngle / 2)));
  }

  show() {
    push();
    stroke(0);
    fill(255);
    translate(this.position.x, this.position.y);
    //rotate(this.velocity.heading());
    rotate(-this.angle);
    rectMode(CENTER);
    rect(0, 0, this.width, this.height);
    //imageMode(CENTER);
    //image(this.image, 0, 0);
    pop();
  }
}