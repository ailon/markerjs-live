import { MarkerBase } from '../core/MarkerBase';

import { IPoint } from '../core/IPoint';
import { SvgHelper } from '../core/SvgHelper';

import { RectangularBoxMarkerBaseState } from './RectangularBoxMarkerBaseState';
import { MarkerBaseState } from '../core/MarkerBaseState';
import { TransformMatrix } from '../core/TransformMatrix';

/**
 * RectangularBoxMarkerBase is a base class for all marker's with rectangular controls such as all rectangle markers,
 * text and callout markers.
 * 
 * It creates and manages the rectangular control box and related resize, move, and rotate manipulations.
 */
export class RectangularBoxMarkerBase extends MarkerBase {
  /**
   * x coordinate of the top-left corner.
   */
  protected left = 0;
  /**
   * y coordinate of the top-left corner.
   */
  protected top = 0;
  /**
   * Marker width.
   */
  protected width = 0;
  /**
   * Marker height.
   */
  protected height = 0;

  /**
   * The default marker size when the marker is created with a click (without dragging).
   */
  protected defaultSize: IPoint = {x: 50, y: 20};

  /**
   * x coordinate of the top-left corner at the start of manipulation.
   */
  protected manipulationStartLeft: number;
  /**
   * y coordinate of the top-left corner at the start of manipulation.
   */
  protected manipulationStartTop: number;
  /**
   * Width at the start of manipulation.
   */
  protected manipulationStartWidth: number;
  /**
   * Height at the start of manipulation.
   */
  protected manipulationStartHeight: number;

  /**
   * x coordinate of the pointer at the start of manipulation.
   */
  protected manipulationStartX: number;
  /**
   * y coordinate of the pointer at the start of manipulation.
   */
  protected manipulationStartY: number;

  /**
   * Pointer's horizontal distance from the top left corner.
   */
  protected offsetX = 0;
  /**
   * Pointer's vertical distance from the top left corner.
   */
  protected offsetY = 0;

  /**
   * Marker's rotation angle.
   */
  protected rotationAngle = 0;

  /**
   * x coordinate of the marker's center.
   */
  protected get centerX(): number {
    return this.left + this.width / 2;
  }
  /**
   * y coordinate of the marker's center.
   */
  protected get centerY(): number {
    return this.top + this.height / 2;
  }

  private _visual: SVGGraphicsElement;
  /**
   * Container for the marker's visual.
   */
  protected get visual(): SVGGraphicsElement {
    return this._visual;
  }
  protected set visual(value: SVGGraphicsElement) {
    this._visual = value;
    const translate = SvgHelper.createTransform();
    this._visual.transform.baseVal.appendItem(translate);
  }

  /**
   * Creates a new marker.
   *
   * @param container - SVG container to hold marker's visual.
   */
  constructor(container: SVGGElement) {
    super(container);

    // add rotation transform
    this.container.transform.baseVal.appendItem(SvgHelper.createTransform());
  }

  /**
   * Returns true if passed SVG element belongs to the marker. False otherwise.
   * 
   * @param el - target element.
   */
  public ownsTarget(el: EventTarget): boolean {
    if (super.ownsTarget(el)) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Handles pointer (mouse, touch, stylus, etc.) down event.
   * 
   * @param point - event coordinates.
   * @param target - direct event target element.
   */
  public pointerDown(point: IPoint, target?: EventTarget): void {
    super.pointerDown(point, target);

    this.select();
  }

  /**
   * Handles pointer (mouse, touch, stylus, etc.) up event.
   * 
   * @param point - event coordinates.
   * @param target - direct event target element.
   */
  public pointerUp(point: IPoint): void {
    super.pointerUp(point);
  }

  /**
   * Moves visual to the specified coordinates.
   * @param point - coordinates of the new top-left corner of the visual.
   */
  protected moveVisual(point: IPoint): void {
    this.visual.style.transform = `translate(${point.x}px, ${point.y}px)`;
    // const translate = this.visual.transform.baseVal.getItem(0);
    // translate.setTranslate(point.x, point.y);
    // this.visual.transform.baseVal.replaceItem(translate, 0);
  }

  /**
   * Handles marker manipulation (move, resize, rotate, etc.).
   * 
   * @param point - event coordinates.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  public manipulate(point: IPoint): void {}

  /**
   * Resizes the marker based on pointer coordinates and context.
   * @param point - pointer coordinates.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected resize(point: IPoint): void {
    this.setSize();
  }

  /**
   * Sets control box size and location.
   */
  protected setSize(): void {
    this.moveVisual({x: this.left, y: this.top});
  }

  private rotate(point: IPoint) {
    // avoid glitch when crossing the 0 rotation point
    if (Math.abs(point.x - this.centerX) > 0.1) {
      const sign = Math.sign(point.x - this.centerX);
      this.rotationAngle =
        (Math.atan((point.y - this.centerY) / (point.x - this.centerX)) * 180) /
          Math.PI +
        90 * sign;
      this.applyRotation();
    }
  }

  private applyRotation() {
    const rotate = this.container.transform.baseVal.getItem(0);
    rotate.setRotate(this.rotationAngle, this.centerX, this.centerY);
    this.container.transform.baseVal.replaceItem(rotate, 0);
  }

  /**
   * Returns point coordinates based on the actual screen coordinates and marker's rotation.
   * @param point - original pointer coordinates
   */
  protected rotatePoint(point: IPoint): IPoint {
    if (this.rotationAngle === 0) {
      return point;
    }
    
    const matrix = this.container.getCTM();
    let svgPoint = SvgHelper.createPoint(point.x, point.y);
    svgPoint = svgPoint.matrixTransform(matrix);

    const result = { x: svgPoint.x, y: svgPoint.y };

    return result;
  }

  /**
   * Returns original point coordinates based on coordinates with rotation applied.
   * @param point - rotated point coordinates.
   */
  protected unrotatePoint(point: IPoint): IPoint {
    if (this.rotationAngle === 0) {
      return point;
    }
    
    let matrix = this.container.getCTM();
    matrix = matrix.inverse();
    let svgPoint = SvgHelper.createPoint(point.x, point.y);
    svgPoint = svgPoint.matrixTransform(matrix);

    const result = { x: svgPoint.x, y: svgPoint.y };

    return result;
  }

  /**
   * Displays marker's controls.
   */
  public select(): void {
    super.select();
  }

  /**
   * Hides marker's controls.
   */
  public deselect(): void {
    super.deselect();
  }

  /**
   * Restores marker's state to the previously saved one.
   * @param state - previously saved state.
   */
  public restoreState(state: MarkerBaseState): void {
    super.restoreState(state);
    const rbmState = state as RectangularBoxMarkerBaseState;
    this.left = rbmState.left;
    this.top = rbmState.top;
    this.width = rbmState.width;
    this.height = rbmState.height;
    this.rotationAngle = rbmState.rotationAngle;
    this.visual.transform.baseVal.getItem(0).setMatrix(
      TransformMatrix.toSVGMatrix(this.visual.transform.baseVal.getItem(0).matrix, rbmState.visualTransformMatrix)
    );
    this.container.transform.baseVal.getItem(0).setMatrix(
      TransformMatrix.toSVGMatrix(this.container.transform.baseVal.getItem(0).matrix, rbmState.containerTransformMatrix)
    );
    // this.moveVisual({x: this.left, y: this.top});
    // this.applyRotation();
  }

  /**
   * Scales marker. Used after the image resize.
   * 
   * @param scaleX - horizontal scale
   * @param scaleY - vertical scale
   */
  public scale(scaleX: number, scaleY: number): void {
    super.scale(scaleX, scaleY);

    const rPoint = this.rotatePoint({x: this.left, y: this.top});
    const point = this.unrotatePoint({x: rPoint.x * scaleX, y: rPoint.y * scaleY});

    this.left = point.x;
    this.top = point.y;
    this.width = this.width * scaleX;
    this.height = this.height * scaleY;
  }

}
