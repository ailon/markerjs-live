import { IPoint } from '../../core/IPoint';
import { SvgHelper } from '../../core/SvgHelper';
import { RectangularBoxMarkerBase } from '../RectangularBoxMarkerBase';
import { MarkerBaseState } from '../../core/MarkerBaseState';
import { CaptionFrameMarkerState } from './CaptionFrameMarkerState';

export class CaptionFrameMarker extends RectangularBoxMarkerBase {
  /**
   * String type name of the marker type.
   *
   * Used when adding {@link MarkerArea.availableMarkerTypes} via a string and to save and restore state.
   */
  public static typeName = 'CaptionFrameMarker';
  /**
   * Marker type title (display name) used for accessibility and other attributes.
   */
  public static title = 'Caption frame marker';
  /**
   * Caption background (fill) color.
   */
  protected fillColor = 'transparent';
  /**
   * Frame border color.
   */
  protected strokeColor = 'transparent';
  /**
   * Frame border line width.
   */
  protected strokeWidth = 0;
  /**
   * Frame border dash array.
   */
  protected strokeDasharray = '';
  /**
   * Caption font family.
   */
  protected fontFamily: string;
  /**
   * Caption text color.
   */
  protected textColor = 'transparent';
  /**
   * Caption font size.
   */
  protected fontSize = '1rem';

  /**
   * Frame rectangle.
   */
  protected frame: SVGRectElement;
  /**
   * Caption background element.
   */
  protected captionBg: SVGRectElement;
  /**
   * Caption text element.
   */
  protected captionElement!: SVGTextElement;
  /**
   * Caption text.
   */
  protected captionText = '';

  /**
   * Creates a new marker.
   *
   * @param container - SVG container to hold marker's visual.
   * @param overlayContainer - overlay HTML container to hold additional overlay elements while editing.
   * @param settings - settings object containing default markers settings.
   */
  constructor(
    container: SVGGElement,
  ) {
    super(container);

    this.createVisual = this.createVisual.bind(this);
    this.sizeCaption = this.sizeCaption.bind(this);
    this.setCaptionText = this.setCaptionText.bind(this);
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
      el === this.frame ||
      el === this.captionBg ||
      el === this.captionElement
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Creates marker visual.
   */
  protected createVisual(): void {
    this.visual = SvgHelper.createGroup();
    this.addMarkerVisualToContainer(this.visual);

    this.captionBg = SvgHelper.createRect(1, 1, [['fill', this.fillColor]]);
    this.visual.appendChild(this.captionBg);

    this.captionElement = SvgHelper.createText([
      ['fill', this.textColor],
      ['font-family', this.fontFamily],
    ]);
    this.captionElement.style.fontSize = this.fontSize;
    this.captionElement.style.textAnchor = 'start';
    this.captionElement.style.dominantBaseline = 'text-before-edge';
    this.captionElement.textContent = this.captionText;
    this.visual.appendChild(this.captionElement);

    this.frame = SvgHelper.createRect(this.width, this.height, [
      ['fill', 'transparent'],
      ['stroke', this.strokeColor],
      ['stroke-width', this.strokeWidth.toString()],
      ['stroke-dasharray', this.strokeDasharray],
    ]);

    this.visual.appendChild(this.frame);
    this.sizeCaption();
  }

  /**
   * Sets caption text.
   * @param text - new caption text.
   */
  public setCaptionText(text: string): void {
    this.captionText = text;
    this.captionElement.textContent = this.captionText;
    this.sizeCaption();
  }

  /**
   * Resize marker based on current pointer coordinates and context.
   * @param point
   */
  protected resize(point: IPoint): void {
    super.resize(point);
    this.setSize();
  }

  private readonly PADDING = 5;
  private captionBoxWidth = 0;
  private captionBoxHeight = 0;
  protected sizeCaption(): void {
    const textBBox = this.captionElement.getBBox();
    if (this.captionText.trim() !== '') {
      this.captionBoxWidth = textBBox.width + this.PADDING * 2;
      this.captionBoxHeight = textBBox.height + this.PADDING * 2;
    } else {
      this.captionBoxWidth = 0;
      this.captionBoxHeight = 0;
    }

    SvgHelper.setAttributes(this.captionBg, [
      ['width', this.captionBoxWidth.toString()],
      ['height', this.captionBoxHeight.toString()],
      [
        'clip-path',
        `path('M0,0 H${this.width} V${this.height} H${-this.width} Z')`,
      ],
    ]);
    SvgHelper.setAttributes(this.captionElement, [
      ['x', this.PADDING.toString()],
      ['y', this.PADDING.toString()],
      [
        'clip-path',
        `path('M0,0 H${this.width - this.PADDING} V${this.height} H${
          -this.width - this.PADDING
        } Z')`,
      ],
    ]);
  }

  /**
   * Sets marker's visual size after manipulation.
   */
  protected setSize(): void {
    super.setSize();
    SvgHelper.setAttributes(this.frame, [
      ['width', this.width.toString()],
      ['height', this.height.toString()],
    ]);
    this.sizeCaption();
  }

  /**
   * Restores previously saved marker state.
   *
   * @param state - previously saved state.
   */
  public restoreState(state: MarkerBaseState): void {
    const frState = state as CaptionFrameMarkerState;
    this.fillColor = frState.fillColor;
    this.strokeColor = frState.strokeColor;
    this.strokeWidth = frState.strokeWidth;
    this.strokeDasharray = frState.strokeDasharray;
    this.textColor = frState.textColor;
    this.fontFamily = frState.fontFamily;
    this.captionText = frState.captionText;
    this.fontSize = frState.fontSize;

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
