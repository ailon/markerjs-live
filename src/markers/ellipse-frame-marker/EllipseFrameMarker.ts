import { EllipseMarker } from '../ellipse-marker/EllipseMarker';

export class EllipseFrameMarker extends EllipseMarker {
  /**
   * String type name of the marker type. 
   * 
   * Used when adding {@link MarkerView.availableMarkerTypes} via a string and to save and restore state.
   */
  public static typeName = 'EllipseFrameMarker';
  /**
   * Marker type title (display name) used for accessibility and other attributes.
   */
  public static title = 'Ellipse frame marker';

  /**
   * Creates a new marker.
   *
   * @param container - SVG container to hold marker's visual.
   */
  constructor(container: SVGGElement) {
    super(container);

    this.fillColor = 'transparent';
  }
}
