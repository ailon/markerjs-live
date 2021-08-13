import { IPoint } from '../../core/IPoint';
import { SvgHelper } from '../../core/SvgHelper';
import { RectangularBoxMarkerBase } from '../RectangularBoxMarkerBase';
import { RectangleMarkerState } from '../RectangleMarkerState';
import { MarkerBaseState } from '../../core/MarkerBaseState';

export class EllipseMarker extends RectangularBoxMarkerBase {
  /**
   * String type name of the marker type. 
   * 
   * Used when adding {@link MarkerView.availableMarkerTypes} via a string and to save and restore state.
   */
  public static typeName = 'EllipseMarker';
  /**
   * Marker type title (display name) used for accessibility and other attributes.
   */
  public static title = 'Ellipse marker';

  /**
   * Ellipse fill color.
   */
  protected fillColor = 'transparent';
  /**
   * Ellipse border color.
   */
  protected strokeColor = 'transparent';
  /**
   * Ellipse border line width.
   */
  protected strokeWidth = 0;
  /**
   * Ellipse border dash array.
   */
  protected strokeDasharray = '';
  /**
   * Ellipse opacity (0..1).
   */
  protected opacity = 1;

  /**
   * Creates a new marker.
   *
   * @param container - SVG container to hold marker's visual.
   */
  constructor(container: SVGGElement) {
    super(container);

    this.setStrokeColor = this.setStrokeColor.bind(this);
    this.setFillColor = this.setFillColor.bind(this);
    this.setStrokeWidth = this.setStrokeWidth.bind(this);
    this.setStrokeDasharray = this.setStrokeDasharray.bind(this);
    this.setOpacity = this.setOpacity.bind(this);
    this.createVisual = this.createVisual.bind(this);
  }

  /**
   * Returns true if passed SVG element belongs to the marker. False otherwise.
   * 
   * @param el - target element.
   */
  public ownsTarget(el: EventTarget): boolean {
    if (super.ownsTarget(el) || el === this.visual) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Creates marker visual.
   */
  protected createVisual(): void {
    this.visual = SvgHelper.createEllipse(this.width / 2, this.height / 2, [
      ['fill', this.fillColor],
      ['stroke', this.strokeColor],
      ['stroke-width', this.strokeWidth.toString()],
      ['stroke-dasharray', this.strokeDasharray],
      ['opacity', this.opacity.toString()]
    ]);
    this.addMarkerVisualToContainer(this.visual);
  }

  /**
   * Handles pointer (mouse, touch, stylus, etc.) down event.
   * 
   * @param point - event coordinates.
   * @param target - direct event target element.
   */
  public pointerDown(point: IPoint, target?: EventTarget): void {
    super.pointerDown(point, target);
  }

  /**
   * Resize marker based on current pointer coordinates and context.
   * @param point 
   */
  protected resize(point: IPoint): void {
    super.resize(point);
    this.setSize();
  }

  /**
   * Sets marker's visual size after manipulation.
   */
  protected setSize(): void {
    super.setSize();
    SvgHelper.setAttributes(this.visual, [
      ['cx', (this.width / 2).toString()],
      ['cy', (this.height / 2).toString()],
      ['rx', (this.width / 2).toString()],
      ['ry', (this.height / 2).toString()],
    ]);
  }

  /**
   * Handles pointer (mouse, touch, stylus, etc.) up event.
   * 
   * @param point - event coordinates.
   */
  public pointerUp(point: IPoint): void {
    super.pointerUp(point);
    this.setSize();
  }

  /**
   * Sets marker's line color.
   * @param color - new line color.
   */
  protected setStrokeColor(color: string): void {
    this.strokeColor = color;
    if (this.visual) {
      SvgHelper.setAttributes(this.visual, [['stroke', this.strokeColor]]);
    }
  }
  /**
   * Sets marker's fill (background) color.
   * @param color - new fill color.
   */
  protected setFillColor(color: string): void {
    this.fillColor = color;
    if (this.visual) {
      SvgHelper.setAttributes(this.visual, [['fill', this.fillColor]]);
    }
  }
  /**
   * Sets marker's line width.
   * @param width - new line width
   */
  protected setStrokeWidth(width: number): void {
    this.strokeWidth = width;
    if (this.visual) {
      SvgHelper.setAttributes(this.visual, [['stroke-width', this.strokeWidth.toString()]]);
    }
  }
  /**
   * Sets marker's border dash array.
   * @param dashes - new dash array.
   */
  protected setStrokeDasharray(dashes: string): void {
    this.strokeDasharray = dashes;
    if (this.visual) {
      SvgHelper.setAttributes(this.visual, [['stroke-dasharray', this.strokeDasharray]]);
    }
  }
  /**
   * Sets marker's opacity.
   * @param opacity - new opacity value (0..1).
   */
  protected setOpacity(opacity: number): void {
    this.opacity = opacity;
    if (this.visual) {
      SvgHelper.setAttributes(this.visual, [['opacity', this.opacity.toString()]]);
    }
  }

  /**
   * Restores previously saved marker state.
   * 
   * @param state - previously saved state.
   */
  public restoreState(state: MarkerBaseState): void {
    const rectState = state as RectangleMarkerState;
    this.fillColor = rectState.fillColor;
    this.strokeColor = rectState.strokeColor;
    this.strokeWidth = rectState.strokeWidth;
    this.strokeDasharray = rectState.strokeDasharray;
    this.opacity = rectState.opacity;

    this.createVisual();
    super.restoreState(state);
    this.setSize();
  }

  /**
   * Scales marker. Used after the image resize.
   * 
   * @param scaleX - horizontal scale
   * @param scaleY - vertical scale
   */
  public scale(scaleX: number, scaleY: number): void {
    super.scale(scaleX, scaleY);

    this.setSize();
  }
}
