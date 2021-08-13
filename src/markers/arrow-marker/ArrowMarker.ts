import { IPoint } from '../../core/IPoint';
import { SvgHelper } from '../../core/SvgHelper';
import { LineMarker } from '../line-marker/LineMarker';
import { ArrowMarkerState, ArrowType } from './ArrowMarkerState';
import { MarkerBaseState } from '../../core/MarkerBaseState';

/**
 * Represents an arrow marker.
 */
export class ArrowMarker extends LineMarker {
  /**
   * String type name of the marker type. 
   * 
   * Used when adding {@link MarkerView.availableMarkerTypes} via a string and to save and restore state.
   */
  public static typeName = 'ArrowMarker';

  /**
   * Marker type title (display name) used for accessibility and other attributes.
   */
  public static title = 'Arrow marker';

  private arrow1: SVGPolygonElement;
  private arrow2: SVGPolygonElement;

  private arrowType: ArrowType = 'end';

  private arrowBaseHeight = 10;
  private arrowBaseWidth = 10;

  /**
   * Creates a new marker.
   *
   * @param container - SVG container to hold marker's visual.
   */
  constructor(container: SVGGElement) {
    super(container);

    this.getArrowPoints = this.getArrowPoints.bind(this);
    this.setArrowType = this.setArrowType.bind(this);
  }

  /**
   * Returns true if passed SVG element belongs to the marker. False otherwise.
   * 
   * @param el - target element.
   */
  public ownsTarget(el: EventTarget): boolean {
    if (
      super.ownsTarget(el) ||
      el === this.arrow1 || el === this.arrow2
    ) {
      return true;
    } else {
      return false;
    }
  }

  private getArrowPoints(offsetX: number, offsetY: number): string {
    const width = this.arrowBaseWidth + this.strokeWidth * 2;
    const height = this.arrowBaseHeight + this.strokeWidth * 2;
    return `${offsetX - width / 2},${
      offsetY + height / 2
    } ${offsetX},${offsetY - height / 2} ${
      offsetX + width / 2},${offsetY + height / 2}`;
  }

  private createTips() {
    this.arrow1 = SvgHelper.createPolygon(this.getArrowPoints(this.x1, this.y1), [['fill', this.strokeColor]]);
    this.arrow1.transform.baseVal.appendItem(SvgHelper.createTransform());
    this.visual.appendChild(this.arrow1);

    this.arrow2 = SvgHelper.createPolygon(this.getArrowPoints(this.x2, this.y2), [['fill', this.strokeColor]]);
    this.arrow2.transform.baseVal.appendItem(SvgHelper.createTransform());
    this.visual.appendChild(this.arrow2);
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

    if (this.arrow1 && this.arrow2) {
      this.arrow1.style.display = (this.arrowType === 'both' || this.arrowType === 'start') ? '' : 'none';
      this.arrow2.style.display = (this.arrowType === 'both' || this.arrowType === 'end') ? '' : 'none';

      SvgHelper.setAttributes(this.arrow1, [
        ['points', this.getArrowPoints(this.x1, this.y1)],
        ['fill', this.strokeColor]
      ]);
      SvgHelper.setAttributes(this.arrow2, [
        ['points', this.getArrowPoints(this.x2, this.y2)],
        ['fill', this.strokeColor]
      ]);

      if (Math.abs(this.x1 - this.x2) > 0.1) {
        const lineAngle1 =
          (Math.atan((this.y2 - this.y1) / (this.x2 - this.x1)) * 180) / Math.PI + 90 * Math.sign(this.x1 - this.x2);

        const a1transform = this.arrow1.transform.baseVal.getItem(0);
        a1transform.setRotate(lineAngle1, this.x1, this.y1);
        this.arrow1.transform.baseVal.replaceItem(a1transform, 0);

        const a2transform = this.arrow2.transform.baseVal.getItem(0);
        a2transform.setRotate(lineAngle1 + 180, this.x2, this.y2);
        this.arrow2.transform.baseVal.replaceItem(a2transform, 0);
      }
    }
  }

  private setArrowType(arrowType: ArrowType) {
    this.arrowType = arrowType;
    this.adjustVisual();
  }

  /**
   * Restores previously saved marker state.
   * 
   * @param state - previously saved state.
   */
  public restoreState(state: MarkerBaseState): void {
    super.restoreState(state);

    const amState = state as ArrowMarkerState;
    this.arrowType = amState.arrowType;

    this.createTips();
    this.adjustVisual();
  }

}
