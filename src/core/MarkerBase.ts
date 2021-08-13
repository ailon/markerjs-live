import { SvgHelper } from './SvgHelper';
import { IPoint } from './IPoint';
import { MarkerBaseState } from './MarkerBaseState';

/**
 * Base class for all available and custom marker types.
 * 
 * All markers used with marker.js Live should be descendants of this class.
 */
export class MarkerBase {
  /**
   * String type name of the marker type. 
   * 
   * Used when adding {@link MarkerView.availableMarkerTypes} via a string and to save and restore state.
   */
  public static typeName = 'MarkerBase';

  protected _outerContainer: SVGGElement;
  /**
   * Outer SVG group container not manipulated or transformed by the marker itself in any way
   */
  public get outerContainer(): SVGGElement {
    return this._outerContainer;
  }

  protected _container: SVGGElement;
  /**
   * SVG container object holding the marker's visual.
   */
  public get container(): SVGGElement {
    return this._container;
  }

  /**
   * Additional information about the marker
   */
  public notes?: string;

  /**
   * Marker type title (display name) used for accessibility and other attributes.
   */
  public static title: string;

  /**
   * Method called when marker creation is finished.
   */
  public onMarkerCreated: (marker: MarkerBase) => void;

  /**
   * Creates a new marker.
   *
   * @param container - SVG container to hold marker's visual.
   */
  constructor(container: SVGGElement) {
    this._outerContainer = container;
    const innerContainer = SvgHelper.createGroup();
    this._outerContainer.appendChild(innerContainer);
    this._container = innerContainer;
  }

  /**
   * Returns true if passed SVG element belongs to the marker. False otherwise.
   * 
   * @param el - target element.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public ownsTarget(el: EventTarget): boolean {
    return false;
  }

  /**
   * Selects this marker.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public select(): void {}

  /**
   * Deselects this marker.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public deselect(): void {}

  /**
   * Handles pointer (mouse, touch, stylus, etc.) down event.
   * 
   * @param point - event coordinates.
   * @param target - direct event target element.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  public pointerDown(point: IPoint, target?: EventTarget):void {}

  /**
   * Handles pointer (mouse, touch, stylus, etc.) double click event.
   * 
   * @param point - event coordinates.
   * @param target - direct event target element.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  public dblClick(point: IPoint, target?: EventTarget):void {}

  /**
   * Handles marker manipulation (move, resize, rotate, etc.).
   * 
   * @param point - event coordinates.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  public manipulate(point: IPoint):void {}

  /**
   * Handles pointer (mouse, touch, stylus, etc.) up event.
   * 
   * @param point - event coordinates.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  public pointerUp(point: IPoint):void {}

  /**
   * Disposes the marker and clean's up.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public dispose(): void {}

  /**
   * Adds marker's root visual element to the container group.
   * @param element - marker's visual element.
   */
  protected addMarkerVisualToContainer(element: SVGElement): void {
    if (this.container.childNodes.length > 0) {
      this.container.insertBefore(element, this.container.childNodes[0]);
    } else {
      this.container.appendChild(element);
    }
  }

  /**
   * Restores previously saved marker state.
   * 
   * @param state - previously saved state.
   */
  public restoreState(state: MarkerBaseState): void {
    this.notes = state.notes;
  }

  /**
   * Scales marker. Used after the image resize.
   * 
   * @param scaleX - horizontal scale
   * @param scaleY - vertical scale
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  public scale(scaleX: number, scaleY: number): void {}
}
