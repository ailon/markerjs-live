import { Settings } from '../../core/Settings';
import { RectangleMarker } from '../RectangleMarker';

export class FrameMarker extends RectangleMarker {
  /**
   * String type name of the marker type. 
   * 
   * Used when adding {@link MarkerArea.availableMarkerTypes} via a string and to save and restore state.
   */
  public static typeName = 'FrameMarker';
  
  /**
   * Marker type title (display name) used for accessibility and other attributes.
   */
  public static title = 'Frame marker';

  /**
   * Creates a new marker.
   *
   * @param container - SVG container to hold marker's visual.
   * @param overlayContainer - overlay HTML container to hold additional overlay elements while editing.
   * @param settings - settings object containing default markers settings.
   */
  constructor(container: SVGGElement, overlayContainer: HTMLDivElement, settings: Settings) {
    super(container, overlayContainer, settings);
  }
}
