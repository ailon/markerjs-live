import { IPoint } from '../../core/IPoint';
import { SvgHelper } from '../../core/SvgHelper';
import { LinearMarkerBase } from '../LinearMarkerBase';
import { LineMarkerState } from './LineMarkerState';
import { MarkerBaseState } from '../../core/MarkerBaseState';

export class LineMarker extends LinearMarkerBase {
  /**
   * String type name of the marker type. 
   * 
   * Used when adding {@link MarkerView.availableMarkerTypes} via a string and to save and restore state.
   */
  public static typeName = 'LineMarker';
  
  /**
   * Marker type title (display name) used for accessibility and other attributes.
   */
  public static title = 'Line marker';

  /**
   * Invisible wider line to make selection easier/possible.
   */
  protected selectorLine: SVGLineElement;
  /**
   * Visible marker line.
   */
  protected visibleLine: SVGLineElement;

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
      el === this.selectorLine ||
      el === this.visibleLine
    ) {
      return true;
    } else {
      return false;
    }
  }

  private createVisual() {
    this.visual = SvgHelper.createGroup();
    this.selectorLine = SvgHelper.createLine(
      this.x1,
      this.y1,
      this.x2,
      this.y2,
      [
        ['stroke', 'transparent'],
        ['stroke-width', (this.strokeWidth + 10).toString()],
      ]
    );
    this.visibleLine = SvgHelper.createLine(
      this.x1,
      this.y1,
      this.x2,
      this.y2,
      [
        ['stroke', this.strokeColor],
        ['stroke-width', this.strokeWidth.toString()],
      ]
    );
    this.visual.appendChild(this.selectorLine);
    this.visual.appendChild(this.visibleLine);

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
    this.selectorLine.setAttribute('x1', this.x1.toString());
    this.selectorLine.setAttribute('y1', this.y1.toString());
    this.selectorLine.setAttribute('x2', this.x2.toString());
    this.selectorLine.setAttribute('y2', this.y2.toString());

    this.visibleLine.setAttribute('x1', this.x1.toString());
    this.visibleLine.setAttribute('y1', this.y1.toString());
    this.visibleLine.setAttribute('x2', this.x2.toString());
    this.visibleLine.setAttribute('y2', this.y2.toString());

    SvgHelper.setAttributes(this.visibleLine, [['stroke', this.strokeColor]]);
    SvgHelper.setAttributes(this.visibleLine, [['stroke-width', this.strokeWidth.toString()]]);
    SvgHelper.setAttributes(this.visibleLine, [['stroke-dasharray', this.strokeDasharray.toString()]]);
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

    const lmState = state as LineMarkerState;
    this.strokeColor = lmState.strokeColor;
    this.strokeWidth = lmState.strokeWidth;
    this.strokeDasharray = lmState.strokeDasharray;

    this.createVisual();
    this.adjustVisual();
  }
}
