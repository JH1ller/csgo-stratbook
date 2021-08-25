import { Types } from 'mongoose';

/**
 * Structure helper for sorting arrays
 */
export interface DataSortType {
  id: Types.ObjectId;

  displayPosition: number;
}

/**
 * Constraints for the sorting operation
 */
export interface DisplaySortable {
  displayPosition: number;
  _id?: Types.ObjectId;
}

/**
 * Finds rows affected by the sorting operation
 * @param source source array, usually documents from the database
 * @param oldPosition old (display-)position of the element
 * @param newPosition new (display-)position of the element
 * @returns array containing affected items
 */
export function sortArrayDisplayOrder<T extends DisplaySortable>(
  source: T[],
  oldPosition: number,
  newPosition: number
) {
  // find affected rows
  const affected: DataSortType[] = [];

  if (newPosition > oldPosition) {
    // force oldPosition to be at least 0, and cap newPosition to array length
    oldPosition = Math.max(oldPosition, 0);
    newPosition = Math.min(source.length - 1, newPosition);

    if (newPosition - oldPosition <= 0) {
      return;
    }

    for (let i = oldPosition + 1; i <= newPosition; i++) {
      const item = source[i];

      affected.push({
        id: item._id,
        displayPosition: item.displayPosition - 1,
      });
    }
  } else {
    oldPosition = Math.min(source.length - 1, oldPosition);
    newPosition = Math.max(0, newPosition);

    if (oldPosition - newPosition <= 0) {
      return;
    }

    for (let i = newPosition; i < oldPosition; i++) {
      const item = source[i];

      affected.push({
        id: item._id,
        displayPosition: item.displayPosition + 1,
      });
    }
  }

  affected.push({
    id: source[oldPosition]._id,
    displayPosition: newPosition,
  });

  return affected;
}
