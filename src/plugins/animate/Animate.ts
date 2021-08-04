import { StyleClass } from '../..';
import { IMarkerViewPlugin } from '../../core/MarkerViewPlugin';
import { MarkerView } from '../..';
import { StyleRule } from '../../core/Style';
import { MarkerViewEventHandler } from '../../core/Events';

export class Animate implements IMarkerViewPlugin {
  private markerView: MarkerView;

  private readonly FADEIN_SUFFIX = 'mva_fade_in';
  private readonly FADEOUT_SUFFIX = 'mva_fade_out';

  public init(markerView: MarkerView): void {
    this.markerView = markerView;

    this.markerView.styles.addClass(new StyleClass(this.markerView.MARKER_CONTAINER_CLASS_SUFFIX, `
      opacity: 0;
    `));

    this.markerView.styles.addRule(
      new StyleRule(
        `@keyframes ${this.markerView.styles.classNamePrefix}_${this.FADEIN_SUFFIX}_animation_frames`,
        `
        from {
          opacity: 0;
          transform: translate(0px, 10px);
        }
        to {
          opacity: 1;
        }
    `
      )
    );
    this.markerView.styles.addRule(
      new StyleRule(
        `@keyframes ${this.markerView.styles.classNamePrefix}_${this.FADEOUT_SUFFIX}_animation_frames`,
        `
        from {
          opacity: 1;
        }
        to {
          opacity: 0;
        }
    `
      )
    );

    this.markerView.styles.addClass(
      new StyleClass(
        this.FADEIN_SUFFIX,
        `
      animation-duration: 0.3s;
      animation-fill-mode: forwards;
      animation-name: ${this.markerView.styles.classNamePrefix}_${this.FADEIN_SUFFIX}_animation_frames;
    `
      )
    );
    this.markerView.styles.addClass(
      new StyleClass(
        this.FADEOUT_SUFFIX,
        `
      animation-duration: 0.3s;
      animation-fill-mode: forwards;
      animation-name: ${this.markerView.styles.classNamePrefix}_${this.FADEOUT_SUFFIX}_animation_frames;
    `
      )
    );

    this.markerView.addEventListener('load', this.markersLoaded);

    console.log('animate initialized');
  }

  private markersLoaded: MarkerViewEventHandler = (markerView) => {
    markerView.markers.forEach((marker, index) => {
      setTimeout(() => marker.container.classList.add(
        `${this.markerView.styles.classNamePrefix}${this.FADEIN_SUFFIX}`
      ), index * 250);
    });
  };
}
