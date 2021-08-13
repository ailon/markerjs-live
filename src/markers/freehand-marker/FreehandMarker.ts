import { IPoint } from '../../core/IPoint';
import { SvgHelper } from '../../core/SvgHelper';
import { RectangularBoxMarkerBase } from '../RectangularBoxMarkerBase';
import { FreehandMarkerState } from './FreehandMarkerState';
import { MarkerBaseState } from '../../core/MarkerBaseState';

export class FreehandMarker extends RectangularBoxMarkerBase {
  /**
   * String type name of the marker type.
   *
   * Used when adding {@link MarkerView.availableMarkerTypes} via a string and to save and restore state.
   */
  public static typeName = 'FreehandMarker';

  /**
   * Marker type title (display name) used for accessibility and other attributes.
   */
  public static title = 'Freehand marker';

  /**
   * Marker color.
   */
  protected color = 'transparent';
  /**
   * Marker's stroke width.
   */
  protected lineWidth = 3;

  private drawingImage: SVGImageElement;
  private drawingImgUrl: string;

  /**
   * Creates a new marker.
   *
   * @param container - SVG container to hold marker's visual.
   */
  constructor(container: SVGGElement) {
    super(container);
  }

  /**
   * Returns true if passed SVG element belongs to the marker. False otherwise.
   *
   * @param el - target element.
   */
  public ownsTarget(el: EventTarget): boolean {
    if (
      super.ownsTarget(el) ||
      el === this.visual ||
      el === this.drawingImage
    ) {
      return true;
    } else {
      return false;
    }
  }

  private createVisual() {
    this.visual = SvgHelper.createGroup();
    this.drawingImage = SvgHelper.createImage();
    this.visual.appendChild(this.drawingImage);

    const translate = SvgHelper.createTransform();
    this.visual.transform.baseVal.appendItem(translate);
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
   * Handles marker manipulation (move, resize, rotate, etc.).
   *
   * @param point - event coordinates.
   */
  public manipulate(point: IPoint): void {
    super.manipulate(point);
  }

  /**
   * Resize marker based on current pointer coordinates and context.
   * @param point
   */
  protected resize(point: IPoint): void {
    super.resize(point);
    SvgHelper.setAttributes(this.visual, [
      ['width', this.width.toString()],
      ['height', this.height.toString()],
    ]);
    SvgHelper.setAttributes(this.drawingImage, [
      ['width', this.width.toString()],
      ['height', this.height.toString()],
    ]);
  }

  /**
   * Handles pointer (mouse, touch, stylus, etc.) up event.
   *
   * @param point - event coordinates.
   */
  public pointerUp(point: IPoint): void {
    super.pointerUp(point);
  }

  /**
   * Selects this marker and displays appropriate selected marker UI.
   */
  public select(): void {
    super.select();
  }

  /**
   * Deselects this marker and hides selected marker UI.
   */
  public deselect(): void {
    super.deselect();
  }

  private setDrawingImage() {
    SvgHelper.setAttributes(this.drawingImage, [
      ['width', this.width.toString()],
      ['height', this.height.toString()],
    ]);
    SvgHelper.setAttributes(this.drawingImage, [['href', this.drawingImgUrl]]);
    this.moveVisual({ x: this.left, y: this.top });
  }

  /**
   * Restores previously saved marker state.
   *
   * @param state - previously saved state.
   */
  public restoreState(state: MarkerBaseState): void {
    this.createVisual();
    super.restoreState(state);
    this.drawingImgUrl = (state as FreehandMarkerState).drawingImgUrl;
    this.setDrawingImage();
  }

  /**
   * Scales marker. Used after the image resize.
   *
   * @param scaleX - horizontal scale
   * @param scaleY - vertical scale
   */
  public scale(scaleX: number, scaleY: number): void {
    super.scale(scaleX, scaleY);

    this.setDrawingImage();
  }
}
