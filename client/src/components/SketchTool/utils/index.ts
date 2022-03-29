import { UtilityTypes } from '@/api/models/UtilityTypes';
import { Line } from 'konva/lib/shapes/Line';
import { Node as KonvaNode } from 'konva/lib/Node';
import { Vector2d } from 'konva/lib/types';
import CursorIcon from '!!raw-loader!../../../assets/icons/cursor.svg';
import { LineItem } from '../types';
import { GameMap } from '@/api/models/GameMap';

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
export const optimizeLine = (line: Line | LineItem, threshold: number = 4) => {
  const isNode = line instanceof Line;
  // convert array of x & y values to array of {x, y} objects
  const points = pointsToVectorArray(isNode ? line.points() : line.points);

  const newPoints = points.reduce<Vector2d[]>((acc, curr, i, arr) => {
    if (i !== 0 && i !== arr.length - 1) {
      // get angle between the two vectors (three points)
      const angle = getAngle(arr[i - 1], arr[i], arr[i + 1]);

      // only add center point if angle is above threshold
      if (Math.abs(angle - 180) > threshold) {
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
  if (isNode) {
    line.points(mappedPoints);
  } else {
    line.points = mappedPoints;
  }
};

export const pxToNumber = (str: string): number => +str.split('px')[0];

export const createUtilImage = (util: UtilityTypes): HTMLImageElement => {
  const img = new Image();
  try {
    img.src = require(`@/assets/images/drawtool/${util.toLowerCase()}.png`);
  } catch (e: any) {
    console.warn(e.code, e.message);
  }
  return img;
};

export const createMapImage = (map: GameMap): HTMLImageElement => {
  const img = new Image();
    img.src = `minimaps/${map.toLowerCase()}.webp`;
    img.onerror = () => img.src = '';
  return img;
};

export const createPointerImage = (color: string): HTMLImageElement => {
  //const colors = ['#1EBC9C', '#3298DB', '#F2C512', '#A463BF', '#E84B3C', '#DDE6E8'];
  const img = new Image();
  const tempEl = document.createElement('div');
  try {
    tempEl.innerHTML = CursorIcon;
    tempEl.querySelector('path')!.style.fill = color; // colors[Math.min(colorIndex, colors.length - 1)];
    const base64string = btoa(tempEl.innerHTML);
    img.src = 'data:image/svg+xml;base64,' + base64string;
  } catch (error) {
    console.log(error);
  }
  return img;
};

export const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

export const toRad = (deg: number) => -deg * (Math.PI / 180);

export const rotateVector = (vec: [x: number, y: number], angleInDeg: number): [x: number, y: number] => {
  const angleInRad = toRad(angleInDeg);
  const cos = Math.cos(angleInRad);
  const sin = Math.sin(angleInRad);
  return [Math.round(10000*(vec[0] * cos - vec[1] * sin))/10000, Math.round(10000*(vec[0] * sin + vec[1] * cos))/10000];
};

export const handleDragStart = (event: DragEvent, type: UtilityTypes) => {
  if (!event.dataTransfer) return;

  event.dataTransfer.setData('text/plain', type);

  // create wrapper for image element, because otherwise we can't style it.
  const wrapper = document.createElement('div');
  const image = document.createElement('img');
  image.src = require(`@/assets/icons/${type.toLowerCase()}.png`);
  wrapper.id = 'drag-ghost';
  wrapper.style.position = 'absolute';
  wrapper.style.top = '-1000px';
  image.style.filter = 'invert(1)';
  image.style.width = '42px';
  image.style.height = '42px';
  wrapper.appendChild(image);
  document.body.appendChild(wrapper);

  event.dataTransfer.setDragImage(wrapper, 24, 24);
  event.dataTransfer.dropEffect = 'copy';
};

export const handleDragOver = (event: DragEvent) => {
  if (!event.dataTransfer) return;
  event.preventDefault();

  event.dataTransfer.dropEffect = 'copy';
};

export const handleDragEnd = () => {
  // Drag was finished or cancelled, remove ghost element that follows cursor
  const dragGhost = document.querySelector('#drag-ghost');
  if (dragGhost?.parentNode) {
    dragGhost.parentNode.removeChild(dragGhost);
  }
};

export const fadeIn = (node: KonvaNode) => node.to({ opacity: 1, duration: 0.2 });
export const fadeOut = (node: KonvaNode) => node.to({ opacity: 0, duration: 0.2 });