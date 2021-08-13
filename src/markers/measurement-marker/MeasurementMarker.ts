import { IPoint } from '../../core/IPoint';
import { SvgHelper } from '../../core/SvgHelper';
import { LineMarker } from '../line-marker/LineMarker';
import { MarkerBaseState } from '../../core/MarkerBaseState';

export class MeasurementMarker extends LineMarker {
  /**
   * String type name of the marker type. 
   * 
   * Used when adding {@link MarkerView.availableMarkerTypes} via a string and to save and restore state.
   */
  public static typeName = 'MeasurementMarker';

  /**
   * Marker type title (display name) used for accessibility and other attributes.
   */
  public static title = 'Measurement marker';

  private tip1: SVGLineElement;
  private tip2: SVGLineElement;

  private get tipLength(): number {
    return 10 + this.strokeWidth * 3;
  }

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
      el === this.tip1 || el === this.tip2
    ) {
      return true;
    } else {
      return false;
    }
  }

  private createTips() {
    this.tip1 = SvgHelper.createLine(
      this.x1 - this.tipLength / 2, 
      this.y1, 
      this.x1 + this.tipLength / 2, 
      this.y1, 
      [
        ['stroke', this.strokeColor],
        ['stroke-width', this.strokeWidth.toString()]
      ]);
    this.tip1.transform.baseVal.appendItem(SvgHelper.createTransform());
    this.visual.appendChild(this.tip1);

    this.tip2 = SvgHelper.createLine(
      this.x2 - this.tipLength / 2, 
      this.y2, 
      this.x2 + this.tipLength / 2, 
      this.y2, 
      [
        ['stroke', this.strokeColor],
        ['stroke-width', this.strokeWidth.toString()]
      ]);
    this.tip2.transform.baseVal.appendItem(SvgHelper.createTransform());
    this.visual.appendChild(this.tip2);
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
   * Adjusts marker visual after manipulation.
   */
  protected adjustVisual(): void {
    super.adjustVisual();

    if (this.tip1 && this.tip2) {

      SvgHelper.setAttributes(this.tip1,[
        ['x1', (this.x1 - this.tipLength / 2).toString()], 
        ['y1', this.y1.toString()], 
        ['x2', (this.x1 + this.tipLength / 2).toString()], 
        ['y2', this.y1.toString()], 
        ['stroke', this.strokeColor],
        ['stroke-width', this.strokeWidth.toString()]
      ]);
      SvgHelper.setAttributes(this.tip2,[
        ['x1', (this.x2 - this.tipLength / 2).toString()], 
        ['y1', this.y2.toString()], 
        ['x2', (this.x2 + this.tipLength / 2).toString()], 
        ['y2', this.y2.toString()], 
        ['stroke', this.strokeColor],
        ['stroke-width', this.strokeWidth.toString()]
      ]);

      if (Math.abs(this.x1 - this.x2) > 0.1) {
        const lineAngle1 =
          (Math.atan((this.y2 - this.y1) / (this.x2 - this.x1)) * 180) / Math.PI + 90 * Math.sign(this.x1 - this.x2);

        const a1transform = this.tip1.transform.baseVal.getItem(0);
        a1transform.setRotate(lineAngle1, this.x1, this.y1);
        this.tip1.transform.baseVal.replaceItem(a1transform, 0);

        const a2transform = this.tip2.transform.baseVal.getItem(0);
        a2transform.setRotate(lineAngle1 + 180, this.x2, this.y2);
        this.tip2.transform.baseVal.replaceItem(a2transform, 0);
      }
    }
  }

  /**
   * Restores previously saved marker state.
   * 
   * @param state - previously saved state.
   */
  public restoreState(state: MarkerBaseState): void {
    super.restoreState(state);

    this.createTips();
    this.adjustVisual();
  }
}
