import { RectangleMarker } from '../RectangleMarker';

export class CoverMarker extends RectangleMarker {
  /**
   * String type name of the marker type. 
   * 
   * Used when adding {@link MarkerView.availableMarkerTypes} via a string and to save and restore state.
   */
  public static typeName = 'CoverMarker';

  /**
   * Marker type title (display name) used for accessibility and other attributes.
   */
  public static title = 'Cover marker';

  /**
   * Creates a new marker.
   *
   * @param container - SVG container to hold marker's visual.
   */
  constructor(container: SVGGElement) {
    super(container);

    this.strokeWidth = 0;
  }
}
