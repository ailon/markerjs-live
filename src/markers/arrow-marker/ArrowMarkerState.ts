import { LineMarkerState } from '../line-marker/LineMarkerState';

export type ArrowType = 'both' | 'start' | 'end' | 'none';

/**
 * Represents arrow marker state.
 */
export interface ArrowMarkerState extends LineMarkerState {
  /**
   * Type of arrow.
   */
  arrowType: ArrowType
}