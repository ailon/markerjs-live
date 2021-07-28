// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { MarkerBaseState, MarkerView, Style } from '../../src';
import { MarkerAreaState } from '../../src/MarkerAreaState';

export * from './../../src/index';

export class Experiments {
  private markerView1: MarkerView;
  private currentState: MarkerAreaState = {
    width: 427,
    height: 320,
    markers: [
      {
        fillColor: 'transparent',
        strokeColor: '#EF4444',
        strokeWidth: 3,
        strokeDasharray: '',
        opacity: 1,
        left: 70,
        top: 72,
        width: 124,
        height: 103,
        rotationAngle: 0,
        visualTransformMatrix: { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 },
        containerTransformMatrix: { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 },
        typeName: 'FrameMarker',
        state: 'select',
      } as MarkerBaseState,
    ],
  };

  constructor() {
    //Activator.addKey('1234');
  }

  public openMarkerView(target: HTMLImageElement): void {
    this.markerView1 = new MarkerView(target);
    Style.styleSheetRoot = document.head;

    this.markerView1.show();
    if (this.currentState) {
      this.markerView1.restoreState(this.currentState);
    }
  }

  public closeMarkerView(): void {
    if (this.markerView1) {
      this.markerView1.close();
    }
  }
}
