class Home {
  constructor(id, startingPoint, angle = 180) {
    this.id = id;
    this.startingPoint = startingPoint;
    this.angle = angle;

    this.width = 60;
    this.depth = 120;

    this.roadSegment = new Segment(startingPoint, this.#calculateEndpoint(this.startingPoint, this.width, this.angle));
    this.color = `rgb(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(
      Math.random() * 255
    )})`;

    this.plot = this.#getPlot();
    this.footprint = this.#getFootprint();
  }

  #getPlot() {
    const p1 = this.startingPoint;
    const p2 = this.#calculateEndpoint(p1, this.width, this.angle);
    const p3 = this.#calculateEndpoint(p2, this.depth, this.angle + 90);
    const p4 = this.#calculateEndpoint(p3, this.width, this.angle - 180);
    return new Polygon([p1, p2, p3, p4]);
  }

  #getFootprint() {
    const p1 = this.#calculateEndpoint(this.plot.points[0], 30, this.angle + 45);
    const p2 = this.#calculateEndpoint(this.plot.points[1], 10, this.angle + 135);
    const p3 = this.#calculateEndpoint(this.plot.points[2], 10, this.angle - 135);
    const p4 = this.#calculateEndpoint(this.plot.points[3], 20, this.angle - 45);
    return new Polygon([p1, p2, p3, p4]);
  }

  #calculateEndpoint(startingPoint, length, angle) {
    let angleRads = angle * (Math.PI / 180);
    return new Point(startingPoint.x + Math.cos(angleRads) * length, startingPoint.y + Math.sin(angleRads) * length);
  }

  draw(ctx) {
    this.plot.draw(ctx, { stroke: this.color, lineWidth: 2, fill: 'transparent' });
    this.footprint.draw(ctx, { fill: this.color });
    this.roadSegment.draw(ctx, { width: 5, color: 'black' });
  }
}
