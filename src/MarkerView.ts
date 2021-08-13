import { SvgHelper } from './core/SvgHelper';
import { Activator } from './core/Activator';

import Logo from './assets/markerjs-logo-m.svg';

import { MarkerBase } from './core/MarkerBase';
import { FrameMarker } from './markers/frame-marker/FrameMarker';
import { LineMarker } from './markers/line-marker/LineMarker';
import { TextMarker } from './markers/text-marker/TextMarker';
import { FreehandMarker } from './markers/freehand-marker/FreehandMarker';
import { ArrowMarker } from './markers/arrow-marker/ArrowMarker';
import { CoverMarker } from './markers/cover-marker/CoverMarker';
import { HighlightMarker } from './markers/highlight-marker/HighlightMarker';
import { CalloutMarker } from './markers/callout-marker/CalloutMarker';
import { EllipseMarker } from './markers/ellipse-marker/EllipseMarker';
import { MeasurementMarker } from './markers/measurement-marker/MeasurementMarker';
import { EllipseFrameMarker } from './markers/ellipse-frame-marker/EllipseFrameMarker';
import { CurveMarker } from './markers/curve-marker/CurveMarker';

import { MarkerAreaState } from './MarkerAreaState';
import { IPoint } from './core/IPoint';

import { StyleManager } from './core/Style';
import {
  EventHandler,
  EventListenerRepository,
  IEventListenerRepository,
} from './core/Events';
import { IMarkerViewPlugin } from './core/MarkerViewPlugin';

/**
 * MarkerViews is the main class of marker.js Live. It controls the core behavior of the library.
 *
 * The simplest marker.js Live usage scenario looks something like this:
 *
 * ```typescript
 * // skip this line if you are importing marker.js Live into the global space via the script tag
 * import * as mjslive from 'markerjs-live';
 *
 * // create an instance of MarkerView and pass the target image reference as a parameter
 * const markerView = new mjslive.MarkerView(target);
 *
 * // call the show() method and pass your annotation configuration (created with marker.js 2) as a parameter
 * markerView.show(markerState);
 * ```
 */
export class MarkerView {
  private target: HTMLImageElement;
  private targetObserver: ResizeObserver;

  private imageWidth: number;
  private imageHeight: number;
  private left: number;
  private top: number;

  public markerImage: SVGSVGElement;
  private markerImageHolder: HTMLDivElement;
  private defs: SVGDefsElement;

  private coverDiv: HTMLDivElement;
  private uiDiv: HTMLDivElement;
  private contentDiv: HTMLDivElement;
  private editorCanvas: HTMLDivElement;
  private editingTarget: HTMLImageElement;
  private overlayContainer: HTMLDivElement;

  private touchPoints = 0;

  private logoUI: HTMLElement;

  private static instanceCounter = 0;
  private _instanceNo: number;
  /**
   * Instance id of this instance
   */
  public get instanceNo(): number {
    return this._instanceNo;
  }

  /**
   * Manage style releated settings via the `styles` property.
   */
  public styles: StyleManager;

  /**
   * Marker types supported by this instance. 
   * You can remove some types to limit the markers displayed.
   */
  public availableMarkerTypes: typeof MarkerBase[] = [
    FrameMarker,
    FreehandMarker,
    ArrowMarker,
    TextMarker,
    EllipseFrameMarker,
    EllipseMarker,
    HighlightMarker,
    CalloutMarker,
    MeasurementMarker,
    CoverMarker,
    LineMarker,
    CurveMarker
  ];

  /**
   * `targetRoot` is used to set an alternative positioning root.
   *
   * This is useful in cases when your target image is positioned, say, inside a div with `position: relative;`
   *
   * ```typescript
   * // set targetRoot to a specific div instead of document.body
   * markerView.targetRoot = document.getElementById('myRootElement');
   * ```
   *
   * @default document.body
   */
  public targetRoot: HTMLElement;

  private currentMarker?: MarkerBase;
  private hoveredMarker?: MarkerBase;
  /**
   * The list of all markers displayed.
   */
  public markers: MarkerBase[] = [];

  private isDragging = false;

  private _isOpen = false;
  /**
   * Returns `true` when MarkerView is open and `false` otherwise.
   *
   * @readonly
   */
  public get isOpen(): boolean {
    return this._isOpen;
  }

  private plugins: IMarkerViewPlugin[] = [];

  /**
   * The suffix of the CSS class name of the marker container (SVG group) element.
   */
  public readonly MARKER_CONTAINER_CLASS_SUFFIX = 'marker-container';

  /**
   * Creates a new MarkerView for the specified target image.
   *
   * ```typescript
   * // create an instance of MarkerView and pass the target image reference as a parameter
   * let markerView = new mjslive.MarkerView(document.getElementById('myimg'));
   * ```
   *
   * @param target image object to be overlayed with markers.
   */
  constructor(target: HTMLImageElement) {
    this._instanceNo = MarkerView.instanceCounter++;

    this.styles = new StyleManager(this.instanceNo);

    this.target = target;
    this.targetRoot = document.body;

    this.open = this.open.bind(this);
    this.setTopLeft = this.setTopLeft.bind(this);

    this.addNewMarker = this.addNewMarker.bind(this);
    this.setCurrentMarker = this.setCurrentMarker.bind(this);
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onDblClick = this.onDblClick.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.close = this.close.bind(this);
    this.closeUI = this.closeUI.bind(this);
    this.clientToLocalCoordinates = this.clientToLocalCoordinates.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    this.removeMarker = this.removeMarker.bind(this);
  }

  private open(): void {
    this.setupResizeObserver();
    this.setEditingTarget();
    this.setTopLeft();
    this.initMarkerCanvas();
    this.initOverlay();
    this.attachEvents();

    if (!Activator.isLicensed) {
      // NOTE:
      // before removing this call please consider supporting marker.js
      // by visiting https://markerjs.com/ for details
      // thank you!
      this.addLogo();
    }

    this._isOpen = true;
  }

  /**
   * Initializes the MarkerView and show the markers.
   * 
   * @param state - marker configuration created with marker.js 2.
   */
  public show(state: MarkerAreaState): void {
    this.showUI();
    this.open();
    
    this.plugins.forEach(plugin => plugin.init(this));
    
    this.eventListeners['create'].forEach((created) => created(this));

    this.restoreState(state);

    this.eventListeners['load'].forEach((loaded) => loaded(this));
  }

  /**
   * Closes the MarkerView.
   */
  public close(): void {
    if (this.isOpen) {
      if (this.coverDiv) {
        this.closeUI();
      }
      if (this.targetObserver) {
        this.targetObserver.unobserve(this.target);
      }
      this._isOpen = false;

      this.eventListeners['close'].forEach(closed => closed(this));
    }
  }

  private setupResizeObserver() {
    if (window.ResizeObserver) {
      this.targetObserver = new ResizeObserver(() => {
        this.resize(this.target.clientWidth, this.target.clientHeight);
      });
      this.targetObserver.observe(this.target);
    }
  }

  private resize(newWidth: number, newHeight: number) {
    const scaleX = newWidth / this.imageWidth;
    const scaleY = newHeight / this.imageHeight;

    this.imageWidth = Math.round(newWidth);
    this.imageHeight = Math.round(newHeight);
    this.editingTarget.src = this.target.src;
    this.editingTarget.width = this.imageWidth;
    this.editingTarget.height = this.imageHeight;
    this.editingTarget.style.width = `${this.imageWidth}px`;
    this.editingTarget.style.height = `${this.imageHeight}px`;

    this.markerImage.setAttribute('width', this.imageWidth.toString());
    this.markerImage.setAttribute('height', this.imageHeight.toString());
    this.markerImage.setAttribute(
      'viewBox',
      '0 0 ' + this.imageWidth.toString() + ' ' + this.imageHeight.toString()
    );

    this.markerImageHolder.style.width = `${this.imageWidth}px`;
    this.markerImageHolder.style.height = `${this.imageHeight}px`;

    this.overlayContainer.style.width = `${this.imageWidth}px`;
    this.overlayContainer.style.height = `${this.imageHeight}px`;

    this.coverDiv.style.width = `${this.imageWidth.toString()}px`;

    this.positionLogo();

    this.scaleMarkers(scaleX, scaleY);
  }

  private scaleMarkers(scaleX: number, scaleY: number) {
    let preScaleSelectedMarker: MarkerBase;
    if (!(this.currentMarker && this.currentMarker instanceof TextMarker)) {
      preScaleSelectedMarker = this.currentMarker;
      this.setCurrentMarker();
    }
    this.markers.forEach((marker) => marker.scale(scaleX, scaleY));
    if (preScaleSelectedMarker !== undefined) {
      this.setCurrentMarker(preScaleSelectedMarker);
    }
  }

  private setEditingTarget() {
    this.imageWidth = Math.round(this.target.clientWidth);
    this.imageHeight = Math.round(this.target.clientHeight);
    this.editingTarget.src = this.target.src;
    this.editingTarget.width = this.imageWidth;
    this.editingTarget.height = this.imageHeight;
    this.editingTarget.style.width = `${this.imageWidth}px`;
    this.editingTarget.style.height = `${this.imageHeight}px`;
  }

  private setTopLeft() {
    const targetRect = this.editingTarget.getBoundingClientRect();
    const bodyRect = this.editorCanvas.getBoundingClientRect();
    this.left = targetRect.left - bodyRect.left;
    this.top = targetRect.top - bodyRect.top;
  }

  private initMarkerCanvas(): void {
    this.markerImageHolder = document.createElement('div');
    this.markerImageHolder.style.setProperty('touch-action', 'pinch-zoom');

    this.markerImage = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg'
    );
    this.markerImage.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    this.markerImage.setAttribute('width', this.imageWidth.toString());
    this.markerImage.setAttribute('height', this.imageHeight.toString());
    this.markerImage.setAttribute(
      'viewBox',
      '0 0 ' + this.imageWidth.toString() + ' ' + this.imageHeight.toString()
    );
    this.markerImage.style.pointerEvents = 'auto';

    this.markerImageHolder.style.position = 'absolute';
    this.markerImageHolder.style.width = `${this.imageWidth}px`;
    this.markerImageHolder.style.height = `${this.imageHeight}px`;
    this.markerImageHolder.style.transformOrigin = 'top left';
    this.positionMarkerImage();

    this.defs = SvgHelper.createDefs();
    this.markerImage.appendChild(this.defs);

    this.markerImageHolder.appendChild(this.markerImage);

    this.editorCanvas.appendChild(this.markerImageHolder);
  }

  private initOverlay(): void {
    this.overlayContainer = document.createElement('div');
    this.overlayContainer.style.position = 'absolute';
    this.overlayContainer.style.left = '0px';
    this.overlayContainer.style.top = '0px';
    this.overlayContainer.style.width = `${this.imageWidth}px`;
    this.overlayContainer.style.height = `${this.imageHeight}px`;
    this.overlayContainer.style.display = 'flex';
    this.markerImageHolder.appendChild(this.overlayContainer);
  }

  private positionMarkerImage() {
    this.markerImageHolder.style.top = this.top + 'px';
    this.markerImageHolder.style.left = this.left + 'px';
  }

  private attachEvents() {
    this.markerImage.addEventListener('pointerdown', this.onPointerDown);
    this.markerImage.addEventListener('dblclick', this.onDblClick);
    window.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerUp);
    window.addEventListener('pointercancel', () => {
      if (this.touchPoints > 0) {
        this.touchPoints--;
      }
    });
    window.addEventListener('pointerout', () => {
      if (this.touchPoints > 0) {
        this.touchPoints--;
      }
    });
    window.addEventListener('pointerleave', this.onPointerUp);
    window.addEventListener('resize', this.onWindowResize);
    window.addEventListener('keyup', this.onKeyUp);
  }

  /**
   * NOTE:
   *
   * before removing or modifying this method please consider supporting marker.js
   * by visiting https://markerjs.com/#price for details
   *
   * thank you!
   */
  private addLogo() {
    this.logoUI = document.createElement('div');
    this.logoUI.style.display = 'inline-block';
    this.logoUI.style.margin = '0px';
    this.logoUI.style.padding = '0px';
    this.logoUI.style.fill = '#333333';

    const link = document.createElement('a');
    link.href = 'https://markerjs.com/';
    link.target = '_blank';
    link.innerHTML = Logo;
    link.title = 'Powered by marker.js';

    link.style.display = 'grid';
    link.style.alignItems = 'center';
    link.style.justifyItems = 'center';
    link.style.padding = '3px';
    link.style.width = '20px';
    link.style.height = '20px';

    this.logoUI.appendChild(link);

    this.editorCanvas.appendChild(this.logoUI);

    this.logoUI.style.position = 'absolute';
    this.logoUI.style.pointerEvents = 'all';
    this.positionLogo();
  }

  private positionLogo() {
    if (this.logoUI) {
      this.logoUI.style.left = `${this.markerImageHolder.offsetLeft + 10}px`;
      this.logoUI.style.top = `${
        this.markerImageHolder.offsetTop +
        this.markerImageHolder.offsetHeight -
        this.logoUI.clientHeight -
        10
      }px`;
    }
  }

  private showUI(): void {
    this.coverDiv = document.createElement('div');
    this.coverDiv.className = `${this.styles.classNamePrefixBase} ${this.styles.classNamePrefix}`;
    // hardcode font size so nothing inside is affected by higher up settings
    this.coverDiv.style.fontSize = '16px';
    this.coverDiv.style.userSelect = 'none';
    this.coverDiv.style.position = 'absolute';
    this.coverDiv.style.top = `${this.target.offsetTop.toString()}px`;
    this.coverDiv.style.left = `${this.target.offsetLeft.toString()}px`;
    this.coverDiv.style.width = `${this.target.offsetWidth.toString()}px`;
    //this.coverDiv.style.height = `${this.target.offsetHeight.toString()}px`;
    this.coverDiv.style.zIndex = '5';
    // flex causes the ui to stretch when toolbox has wider nowrap panels
    //this.coverDiv.style.display = 'flex';
    this.targetRoot.appendChild(this.coverDiv);

    this.uiDiv = document.createElement('div');
    this.uiDiv.style.display = 'flex';
    this.uiDiv.style.flexDirection = 'column';
    this.uiDiv.style.flexGrow = '2';
    this.uiDiv.style.margin = '0px';
    this.uiDiv.style.border = '0px';
    // this.uiDiv.style.overflow = 'hidden';
    //this.uiDiv.style.backgroundColor = '#ffffff';
    this.coverDiv.appendChild(this.uiDiv);

    this.contentDiv = document.createElement('div');
    this.contentDiv.style.display = 'flex';
    this.contentDiv.style.flexDirection = 'row';
    this.contentDiv.style.flexGrow = '2';
    this.contentDiv.style.flexShrink = '1';
    this.uiDiv.appendChild(this.contentDiv);

    this.editorCanvas = document.createElement('div');
    this.editorCanvas.style.flexGrow = '2';
    this.editorCanvas.style.flexShrink = '1';
    this.editorCanvas.style.position = 'relative';
    this.editorCanvas.style.overflow = 'hidden';
    this.editorCanvas.style.display = 'flex';
    this.editorCanvas.style.pointerEvents = 'none';
    this.contentDiv.appendChild(this.editorCanvas);

    this.editingTarget = document.createElement('img');
    this.editorCanvas.appendChild(this.editingTarget);
  }

  private closeUI() {
    // @todo better cleanup
    this.targetRoot.removeChild(this.coverDiv);
  }

  private removeMarker(marker: MarkerBase) {
    this.markerImage.removeChild(marker.container);
    if (this.markers.indexOf(marker) > -1) {
      this.markers.splice(this.markers.indexOf(marker), 1);
    }
    marker.dispose();
  }

  /**
   * Uses the state created with marker.js 2 to display the markers.
   *
   * @param state - previously saved marker.js 2 state object.
   */
  private restoreState(state: MarkerAreaState): void {
    this.markers.splice(0);
    while (this.markerImage.lastChild) {
      this.markerImage.removeChild(this.markerImage.lastChild);
    }
    state.markers.forEach((markerState) => {
      const markerType = this.availableMarkerTypes.find(
        (mType) => mType.typeName === markerState.typeName
      );
      if (markerType !== undefined) {
        const marker = this.addNewMarker(markerType);
        marker.restoreState(markerState);
        this.markers.push(marker);
      }
    });
    if (
      state.width &&
      state.height &&
      (state.width !== this.imageWidth || state.height !== this.imageHeight)
    ) {
      this.scaleMarkers(
        this.imageWidth / state.width,
        this.imageHeight / state.height
      );
    }
  }

  private addNewMarker(markerType: typeof MarkerBase): MarkerBase {
    const g = SvgHelper.createGroup();
    g.setAttribute('class', `${this.styles.classNamePrefix}${this.MARKER_CONTAINER_CLASS_SUFFIX}`);
    this.markerImage.appendChild(g);

    return new markerType(g);
  }

  /**
   * Sets the currently selected marker or deselects it if no parameter passed.
   *
   * @param marker marker to select. Deselects current marker if undefined.
   */
  public setCurrentMarker(marker?: MarkerBase): void {
    const currentChanged = this.currentMarker !== marker;

    if (this.currentMarker !== undefined) {
      this.currentMarker.deselect();
    }
    this.currentMarker = marker;
    if (this.currentMarker !== undefined) {
      this.currentMarker.select();
    }

    if (currentChanged) {
      this.eventListeners['select'].forEach((selected) =>
        selected(this, marker)
      );
    }
  }

  private onPointerDown(ev: PointerEvent) {
    this.touchPoints++;
    if (this.touchPoints === 1 || ev.pointerType !== 'touch') {
      const hitMarker = this.markers.find((m) => m.ownsTarget(ev.target));
      if (hitMarker !== undefined) {
        this.setCurrentMarker(hitMarker);
        this.isDragging = true;
        this.currentMarker.pointerDown(
          this.clientToLocalCoordinates(ev.clientX, ev.clientY),
          ev.target
        );
      } else {
        this.setCurrentMarker();
      }

      if (this.eventListeners['pointerdown'].length > 0) {
        this.eventListeners['pointerdown'].forEach((pointerDownHandler) =>
          pointerDownHandler(this, ev, hitMarker)
        );
      }
    }
  }

  private onDblClick(ev: PointerEvent) {
    const hitMarker = this.markers.find((m) => m.ownsTarget(ev.target));
    if (hitMarker !== undefined && hitMarker !== this.currentMarker) {
      this.setCurrentMarker(hitMarker);
    }
    if (this.currentMarker !== undefined) {
      this.currentMarker.dblClick(
        this.clientToLocalCoordinates(ev.clientX, ev.clientY),
        ev.target
      );
    } else {
      this.setCurrentMarker();
    }
  }

  private isPointerIn = false;
  private onPointerMove(ev: PointerEvent) {
    if (this.touchPoints === 1 || ev.pointerType !== 'touch') {
      if (this.currentMarker !== undefined || this.isDragging) {
        ev.preventDefault();
      }
    }

    if (
      this.eventListeners['over'].length > 0 ||
      this.eventListeners['pointermove'].length > 0
    ) {
      const hitMarker = this.markers.find((m) => m.ownsTarget(ev.target));
      if (hitMarker !== this.hoveredMarker) {
        this.hoveredMarker = hitMarker;
        this.eventListeners['over'].forEach((overHandler) =>
          overHandler(this, this.hoveredMarker)
        );
      }

      this.eventListeners['pointermove'].forEach((pointerMoveHandler) =>
        pointerMoveHandler(this, ev, hitMarker)
      );

      if (!this.isPointerIn && (hitMarker !== undefined || this.markerImage === ev.target)) {
        this.isPointerIn = true;
        this.eventListeners['pointerenter'].forEach((pointerEnterHandler) =>
          pointerEnterHandler(this, ev, hitMarker)
        );
      }

      if (this.isPointerIn && hitMarker === undefined && this.markerImage !== ev.target) {
        this.isPointerIn = false;
        this.eventListeners['pointerleave'].forEach((pointerLeaveHandler) =>
          pointerLeaveHandler(this, ev, hitMarker)
        );
      }
    }
  }

  private onPointerUp(ev: PointerEvent) {
    if (this.touchPoints > 0) {
      this.touchPoints--;
    }
    if (this.touchPoints === 0) {
      if (this.isDragging && this.currentMarker !== undefined) {
        this.currentMarker.pointerUp(
          this.clientToLocalCoordinates(ev.clientX, ev.clientY)
        );
      }
    }
    this.isDragging = false;

    if (this.eventListeners['pointerup'].length > 0) {
      const hitMarker = this.markers.find((m) => m.ownsTarget(ev.target));
      this.eventListeners['pointerup'].forEach((pointerUpHandler) =>
        pointerUpHandler(this, ev, hitMarker)
      );
    }

  }

  private onKeyUp(ev: KeyboardEvent) {
    if (
      this.currentMarker !== undefined &&
      (ev.key === 'Delete' || ev.key === 'Backspace')
    ) {
      this.removeMarker(this.currentMarker);
      this.setCurrentMarker();
      this.markerImage.style.cursor = 'default';
    }
  }

  private clientToLocalCoordinates(x: number, y: number): IPoint {
    const clientRect = this.markerImage.getBoundingClientRect();
    return { x: x - clientRect.left, y: y - clientRect.top };
  }

  private onWindowResize() {
    this.positionUI();
  }

  private positionUI() {
    this.setTopLeft();
    this.coverDiv.style.top = `${this.target.offsetTop.toString()}px`;
    this.coverDiv.style.left = `${this.target.offsetLeft.toString()}px`;
    this.positionMarkerImage();
    this.positionLogo();
  }

  private eventListeners = new EventListenerRepository();
  /**
   * Adds an event listener for one of the marker.js Live events.
   * 
   * @param eventType - type of the event.
   * @param handler - function handling the event.
   */
  public addEventListener<T extends keyof IEventListenerRepository>(
    eventType: T,
    handler: EventHandler<T>
  ): void {
    this.eventListeners.addEventListener(eventType, handler);
  }

  /**
   * Adds a plugin to the plugin array.
   * @param plugin 
   */
  public addPlugin(plugin: IMarkerViewPlugin): void {
    this.plugins.push(plugin);
  }
  
  /**
   * Removes a plugin from the plugin array.
   * @param plugin 
   */
  public removePlugin(plugin: IMarkerViewPlugin): void {
    const pluginIndex = this.plugins.indexOf(plugin);
    if (pluginIndex >= 0) {
      this.plugins.splice(pluginIndex, 1);
    }
  }
}
