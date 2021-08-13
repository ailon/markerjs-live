import { RectangularBoxMarkerBaseState } from '../RectangularBoxMarkerBaseState';

/**
 * TextMarker state
 */
export interface TextMarkerState extends RectangularBoxMarkerBaseState {
  /**
   * Font color.
   */
  color: string;
  /**
   * Font family.
   */
  fontFamily: string;
  /**
   * Padding inside the control's rectangle.
   */
  padding: number;
  /**
   * Marker's text content.
   */
  text: string;
}
