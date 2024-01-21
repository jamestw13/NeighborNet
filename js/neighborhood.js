class Neighborhood {
  constructor(neighbors) {
    this.neighbors = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

    this.startingHome = new Home(0, new Point(canvas.width / 2, canvas.height / 2));

    this.homes = [this.startingHome];

    this.#generateHomes();
  }

  #generateHomes() {
    let startingPoints = [this.startingHome.roadSegment.p1, this.startingHome.roadSegment.p2];

    for (let i = 1; i < 40 /*this.neighbors.length*/; i++) {
      let home;
      let valid = false;

      while (!valid) {
        home = new Home(
          i,
          startingPoints[Math.floor(Math.random() * startingPoints.length)],
          Math.floor(Math.random() * 12) * 45,
          this.homes[i - 1]
        );

        const collisions = this.homes.filter(h => h.footprint.intersectsPoly(home.footprint));
        console.log({ collisions });
        if (
          !collisions.length
          // &&
          // !this.homes.filter(h => h.roadSegment.intersectsSegment(home.plot.segments[0])).length
        ) {
          valid = true;
          console.log('passed');
          this.homes.push(home);
          startingPoints.push(home.roadSegment.p2);
        }
      }
    }
  }

  #recursiveAddHome() {}

  draw(ctx) {
    this.homes.forEach(home => home.draw(ctx));
  }
}
