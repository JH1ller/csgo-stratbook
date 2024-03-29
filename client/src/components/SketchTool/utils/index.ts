import { UtilityTypes } from '@/api/models/UtilityTypes';
import { Line } from 'konva/lib/shapes/Line';
import { Node as KonvaNode } from 'konva/lib/Node';
import { Vector2d } from 'konva/lib/types';
import CursorIcon from '!!raw-loader!../../../assets/icons/cursor.svg';
import PlayerIcon from '!!raw-loader!../../../assets/icons/player.svg';
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
  img.src = require(`@/assets/images/drawtool/minimaps/${map.toLowerCase()}.webp`);
  img.onerror = () => (img.src = '');
  return img;
};

export const createPointerImage = (color: string): HTMLImageElement => {
  const img = new Image();
  const tempEl = document.createElement('div');
  try {
    tempEl.innerHTML = CursorIcon;
    tempEl.querySelector('path')!.style.fill = color;
    const base64string = btoa(tempEl.innerHTML);
    img.src = 'data:image/svg+xml;base64,' + base64string;
  } catch (error) {
    console.log(error);
  }
  return img;
};

export const createPlayerImage = (color: string): HTMLImageElement => {
  const img = new Image();
  const tempEl = document.createElement('div');
  try {
    tempEl.innerHTML = PlayerIcon;
    tempEl.querySelector('path')!.style.fill = color;
    tempEl.querySelector('circle')!.style.fill = color;
    tempEl.querySelector('svg')!.style.transform = 'rotate(45deg) scale(0.7)';
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
  return [
    Math.round(10000 * (vec[0] * cos - vec[1] * sin)) / 10000,
    Math.round(10000 * (vec[0] * sin + vec[1] * cos)) / 10000,
  ];
};

export const handleDragStart = (event: DragEvent, type: string) => {
  if (!event.dataTransfer) return;

  event.dataTransfer.setData('text/plain', type);

  const img = document.querySelector(`.sketch-tool__draggable[data-type='${type.toLowerCase()}'] svg`);

  event.dataTransfer.setDragImage(img!, 24, 24);
  event.dataTransfer.dropEffect = 'copy';
};

export const handleDragOver = (event: DragEvent) => {
  if (!event.dataTransfer) return;
  event.preventDefault();

  event.dataTransfer.dropEffect = 'copy';
};

export const fadeIn = (node: KonvaNode) => node.to({ opacity: 1, duration: 0.2 });
export const fadeOut = (node: KonvaNode) => node.to({ opacity: 0, duration: 0.2 });
