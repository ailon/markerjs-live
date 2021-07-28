import { Settings } from '../../core/Settings';
import { CoverMarker } from '../cover-marker/CoverMarker';
import { SvgHelper } from '../../core/SvgHelper';

export class HighlightMarker extends CoverMarker {
  /**
   * String type name of the marker type. 
   * 
   * Used when adding {@link MarkerArea.availableMarkerTypes} via a string and to save and restore state.
   */
  public static typeName = 'HighlightMarker';
  /**
   * Marker type title (display name) used for accessibility and other attributes.
   */
  public static title = 'Highlight marker';

  /**
   * Creates a new marker.
   *
   * @param container - SVG container to hold marker's visual.
   * @param overlayContainer - overlay HTML container to hold additional overlay elements while editing.
   * @param settings - settings object containing default markers settings.
   */
  constructor(container: SVGGElement, overlayContainer: HTMLDivElement, settings: Settings) {
    super(container, overlayContainer, settings);

    this.setOpacity = this.setOpacity.bind(this);

    this.strokeWidth = 0;
  }

  /**
   * Sets marker's opacity (0..1).
   * @param opacity - new opacity value.
   */
  protected setOpacity(opacity: number): void {
    this.opacity = opacity;
    if (this.visual) {
      SvgHelper.setAttributes(this.visual, [['opacity', this.opacity.toString()]]);
    }
  }
}
