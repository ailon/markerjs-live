import { IPoint } from '../../core/IPoint';
import { SvgHelper } from '../../core/SvgHelper';
import { LinearMarkerBase } from '../LinearMarkerBase';
import { CurveMarkerState } from './CurveMarkerState';
import { MarkerBaseState } from '../../core/MarkerBaseState';

export class CurveMarker extends LinearMarkerBase {
  /**
   * String type name of the marker type. 
   * 
   * Used when adding {@link MarkerView.availableMarkerTypes} via a string and to save and restore state.
   */
  public static typeName = 'CurveMarker';
  
  /**
   * Marker type title (display name) used for accessibility and other attributes.
   */
  public static title = 'Curve marker';
  /**
   * Invisible wider curve to make selection easier/possible.
   */
  protected selectorCurve: SVGPathElement;
  /**
   * Visible marker curve.
   */
  protected visibleCurve: SVGPathElement;

  /**
   * Line color.
   */
  protected strokeColor = 'transparent';
  /**
   * Line width.
   */
  protected strokeWidth = 0;
  /**
   * Line dash array.
   */
  protected strokeDasharray = '';

  private curveX = 0;
  private curveY = 0;

  /**
   * Creates a new marker.
   *
   * @param container - SVG container to hold marker's visual.
   */
  constructor(container: SVGGElement) {
    super(container);

    this.setStrokeColor = this.setStrokeColor.bind(this);
    this.setStrokeWidth = this.setStrokeWidth.bind(this);
    this.setStrokeDasharray = this.setStrokeDasharray.bind(this);
    this.adjustVisual = this.adjustVisual.bind(this);
    this.resize = this.resize.bind(this);
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
      el === this.selectorCurve ||
      el === this.visibleCurve
    ) {
      return true;
    } else {
      return false;
    }
  }

  private getPathD(): string {
    const result = `M ${this.x1} ${this.y1} Q ${this.curveX} ${this.curveY}, ${this.x2} ${this.y2}`;
    return result;
  }

  private createVisual() {
    this.visual = SvgHelper.createGroup();
    this.selectorCurve = SvgHelper.createPath(
      this.getPathD(),
      [
        ['stroke', 'transparent'],
        ['stroke-width', (this.strokeWidth + 10).toString()],
        ['fill', 'transparent'],
      ]
    );
    this.visibleCurve = SvgHelper.createPath(
      this.getPathD(),
      [
        ['stroke', this.strokeColor],
        ['stroke-width', this.strokeWidth.toString()],
        ['fill', 'transparent'],
      ]
    );
    this.visual.appendChild(this.selectorCurve);
    this.visual.appendChild(this.visibleCurve);

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
   * Adjusts visual after manipulation.
   */
  protected adjustVisual(): void {
    this.selectorCurve.setAttribute('d', this.getPathD());

    this.visibleCurve.setAttribute('d', this.getPathD());

    SvgHelper.setAttributes(this.visibleCurve, [['stroke', this.strokeColor]]);
    SvgHelper.setAttributes(this.visibleCurve, [['stroke-width', this.strokeWidth.toString()]]);
    SvgHelper.setAttributes(this.visibleCurve, [['stroke-dasharray', this.strokeDasharray.toString()]]);
  }

  /**
   * Sets line color.
   * @param color - new color.
   */
  protected setStrokeColor(color: string): void {
    this.strokeColor = color;
    this.adjustVisual();
  }
  /**
   * Sets line width.
   * @param width - new width.
   */
  protected setStrokeWidth(width: number): void {
    this.strokeWidth = width
    this.adjustVisual();
  }

  /**
   * Sets line dash array.
   * @param dashes - new dash array.
   */
  protected setStrokeDasharray(dashes: string): void {
    this.strokeDasharray = dashes;
    this.adjustVisual();
  }

  /**
   * Restores previously saved marker state.
   * 
   * @param state - previously saved state.
   */
  public restoreState(state: MarkerBaseState): void {
    super.restoreState(state);

    const lmState = state as CurveMarkerState;
    this.strokeColor = lmState.strokeColor;
    this.strokeWidth = lmState.strokeWidth;
    this.strokeDasharray = lmState.strokeDasharray;
    this.curveX = lmState.curveX;
    this.curveY = lmState.curveY;

    this.createVisual();
    this.adjustVisual();
  }
}
