import { IPoint } from '../../core/IPoint';
import { SvgHelper } from '../../core/SvgHelper';
import { RectangularBoxMarkerBase } from '../RectangularBoxMarkerBase';
import { TextMarkerState } from './TextMarkerState';
import { MarkerBaseState } from '../../core/MarkerBaseState';

export class TextMarker extends RectangularBoxMarkerBase {
  /**
   * String type name of the marker type.
   *
   * Used when adding {@link MarkerView.availableMarkerTypes} via a string and to save and restore state.
   */
  public static typeName = 'TextMarker';

  /**
   * Marker type title (display name) used for accessibility and other attributes.
   */
  public static title = 'Text marker';

  /**
   * Text color.
   */
  protected color = 'transparent';
  /**
   * Text's font family.
   */
  protected fontFamily: string;
  /**
   * Padding inside of the marker's bounding box in percents.
   */
  protected padding = 5;

  private text = '';
  /**
   * Visual text element.
   */
  protected textElement: SVGTextElement;
  /**
   * Text background rectangle.
   */
  protected bgRectangle: SVGRectElement;

  private pointerDownPoint: IPoint;

  /**
   * Creates a new marker.
   *
   * @param container - SVG container to hold marker's visual.
   */
  constructor(container: SVGGElement) {
    super(container);

    this.defaultSize = { x: 100, y: 30 };

    this.setColor = this.setColor.bind(this);
    this.setFont = this.setFont.bind(this);
    this.renderText = this.renderText.bind(this);
    this.sizeText = this.sizeText.bind(this);
    this.setSize = this.setSize.bind(this);
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
      el === this.textElement ||
      el === this.bgRectangle
    ) {
      return true;
    } else {
      let found = false;
      this.textElement.childNodes.forEach((span) => {
        if (span === el) {
          found = true;
        }
      });
      return found;
    }
  }

  /**
   * Creates text marker visual.
   */
  protected createVisual(): void {
    this.visual = SvgHelper.createGroup();

    this.bgRectangle = SvgHelper.createRect(1, 1, [['fill', 'transparent']]);
    this.visual.appendChild(this.bgRectangle);

    this.textElement = SvgHelper.createText([
      ['fill', this.color],
      ['font-family', this.fontFamily],
      ['font-size', '16px'],
      ['x', '0'],
      ['y', '0'],
    ]);
    this.textElement.transform.baseVal.appendItem(SvgHelper.createTransform()); // translate transorm
    this.textElement.transform.baseVal.appendItem(SvgHelper.createTransform()); // scale transorm

    this.visual.appendChild(this.textElement);

    this.addMarkerVisualToContainer(this.visual);
    this.renderText();
  }

  /**
   * Handles pointer (mouse, touch, stylus, etc.) down event.
   *
   * @param point - event coordinates.
   * @param target - direct event target element.
   */
  public pointerDown(point: IPoint, target?: EventTarget): void {
    super.pointerDown(point, target);

    this.pointerDownPoint = point;
  }

  private renderText() {
    const LINE_SIZE = '1.2em';

    while (this.textElement.lastChild) {
      this.textElement.removeChild(this.textElement.lastChild);
    }

    const lines = this.text.split(/\r\n|[\n\v\f\r\x85\u2028\u2029]/);
    lines.forEach((line) => {
      this.textElement.appendChild(
        SvgHelper.createTSpan(
          // workaround for swallowed empty lines
          line.trim() === '' ? ' ' : line.trim(),
          [
            ['x', '0'],
            ['dy', LINE_SIZE],
          ]
        )
      );
    });

    setTimeout(this.sizeText, 10);
  }

  private getTextScale(): number {
    const textSize = this.textElement.getBBox();
    let scale = 1.0;
    if (textSize.width > 0 && textSize.height > 0) {
      const xScale =
        (this.width * 1.0 - (this.width * this.padding * 2) / 100) /
        textSize.width;
      const yScale =
        (this.height * 1.0 - (this.height * this.padding * 2) / 100) /
        textSize.height;
      scale = Math.min(xScale, yScale);
    }
    return scale;
  }

  private getTextPosition(scale: number): IPoint {
    const textSize = this.textElement.getBBox();
    let x = 0;
    let y = 0;
    if (textSize.width > 0 && textSize.height > 0) {
      x = (this.width - textSize.width * scale) / 2;
      y = this.height / 2 - (textSize.height * scale) / 2;
    }
    return { x: x, y: y };
  }

  private sizeText() {
    const textBBox = this.textElement.getBBox();
    const scale = this.getTextScale();
    const position = this.getTextPosition(scale);
    position.y -= textBBox.y * scale; // workaround adjustment for text not being placed at y=0

    if (navigator.userAgent.indexOf('Edge/') > -1) {
      // workaround for legacy Edge as transforms don't work otherwise but this way it doesn't work in Safari
      this.textElement.style.transform = `translate(${position.x}px, ${position.y}px) scale(${scale}, ${scale})`;
    } else {
      this.textElement.transform.baseVal
        .getItem(0)
        .setTranslate(position.x, position.y);
      this.textElement.transform.baseVal.getItem(1).setScale(scale, scale);
    }
  }

  /**
   * Resize marker based on current pointer coordinates and context.
   * @param point
   */
  protected resize(point: IPoint): void {
    super.resize(point);
    this.setSize();
    this.sizeText();
  }

  /**
   * Sets size of marker elements after manipulation.
   */
  protected setSize(): void {
    super.setSize();
    SvgHelper.setAttributes(this.visual, [
      ['width', this.width.toString()],
      ['height', this.height.toString()],
    ]);
    SvgHelper.setAttributes(this.bgRectangle, [
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
    this.setSize();
  }

  /**
   * Deselects this marker, renders text (if necessary), and hides selected marker UI.
   */
  public deselect(): void {
    super.deselect();
  }

  /**
   * Opens text editor on double-click.
   * @param point
   * @param target
   */
  public dblClick(point: IPoint, target?: EventTarget): void {
    super.dblClick(point, target);
  }

  /**
   * Sets text color.
   * @param color - new text color.
   */
  protected setColor(color: string): void {
    SvgHelper.setAttributes(this.textElement, [['fill', color]]);
    this.color = color;
  }

  /**
   * Sets font family.
   * @param font - new font family.
   */
  protected setFont(font: string): void {
    SvgHelper.setAttributes(this.textElement, [['font-family', font]]);
    this.fontFamily = font;
    this.renderText();
  }

  /**
   * Restores previously saved marker state.
   *
   * @param state - previously saved state.
   */
  public restoreState(state: MarkerBaseState): void {
    const textState = state as TextMarkerState;
    this.color = textState.color;
    this.fontFamily = textState.fontFamily;
    this.padding = textState.padding;
    this.text = textState.text;

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
    this.sizeText();
  }
}
