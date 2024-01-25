import { randNumber } from '@ngneat/falso';

/**
 * @class Plot
 * @classdesc A plot is a single line that is drawn on the canvas. It is defined by a starting point, an ordinal, and a width.
 * @property {Vector3} startPoint - The starting point of the plot.
 * @property {number} ordinal - The ordinal direction angle of the plot. 0 is west, 1 is southwest, etc.
 * @property {number} width - The width of the plot along the street. Default is 60
 */
export default class Plot {
  constructor(startPoint, ordinal, width = randNumber({ min: 40, max: 200 })) {
    this.startPoint = startPoint;
    this.ordinal = ordinal;
    this.width = width;
  }

  plotsIntersect(otherPlot) {
    const x1 = this.startPoint.x;
    const z1 = this.startPoint.z;
    const x2 = this.startPoint.x + this.width * Math.cos((Math.PI / 4) * this.ordinal);
    const z2 = this.startPoint.z + this.width * Math.sin((Math.PI / 4) * this.ordinal);
    const x3 = otherPlot.startPoint.x;
    const z3 = otherPlot.startPoint.z;
    const x4 = otherPlot.startPoint.x + otherPlot.width * Math.cos((Math.PI / 4) * otherPlot.ordinal);
    const z4 = otherPlot.startPoint.z + otherPlot.width * Math.sin((Math.PI / 4) * otherPlot.ordinal);

    const d = (x1 - x2) * (z3 - z4) - (z1 - z2) * (x3 - x4);
    if (d === 0) return false;

    const t = ((x1 - x3) * (z3 - z4) - (z1 - z3) * (x3 - x4)) / d;
    const u = -((x1 - x2) * (z1 - z3) - (z1 - z2) * (x1 - x3)) / d;

    return t > 0 && t < 1 && u > 0 && u < 1;
  }
}
