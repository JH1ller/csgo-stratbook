import { Line } from 'konva/lib/shapes/Line';
import { Vector2d } from 'konva/lib/types';

/**
 * Map array of points '[x, y, x, y]' to array of {x, y} objects '[{x, y}, {x, y}]'
 */
export const pointsToVectorArray = (points: number[]): Vector2d[] =>
  points.reduce<Vector2d[]>((acc, curr, index) => {
    const isEven = index % 2 === 0;

    if (isEven) {
      acc.push({
        x: curr,
        y: 0,
      });
    } else {
      acc[acc.length - 1].y = curr;
    }
    return acc;
  }, []);

/**
 * Get angle between the two vectors (three points) in degrees
 */
export const getAngle = (a: Vector2d, b: Vector2d, c: Vector2d): number => {
  const ab = Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
  const bc = Math.sqrt(Math.pow(b.x - c.x, 2) + Math.pow(b.y - c.y, 2));
  const ac = Math.sqrt(Math.pow(c.x - a.x, 2) + Math.pow(c.y - a.y, 2));
  return (Math.acos((bc * bc + ab * ab - ac * ac) / (2 * bc * ab)) * 180) / Math.PI;
};

/**
 * Optimize lines by removing unnecessary points which fall under a certain angle
 * threshold which is barely noticable
 */
export const optimizeLine = (line: Line) => {
  // convert array of x & y values to array of {x, y} objects
  const points = pointsToVectorArray(line.points());

  const newPoints = points.reduce<Vector2d[]>((acc, curr, i, arr) => {
    if (i !== 0 && i !== arr.length - 1) {
      // get angle between the two vectors (three points)
      const angle = getAngle(arr[i - 1], arr[i], arr[i + 1]);

      // only add center point if angle is above threshold
      if (Math.abs(angle - 180) > 5) {
        acc.push(curr);
      }
    } else {
      // always add the first and the last point of the line
      acc.push(curr);
    }
    return acc;
  }, []);

  // convert array of {x, y} objects back to flat array of x & y values
  const mappedPoints = newPoints.flatMap(({ x, y }) => [x, y]);
  line.points(mappedPoints);
};
