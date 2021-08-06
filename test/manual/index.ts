// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { MarkerBaseState, MarkerView } from '../../src/index';
import { MarkerAreaState } from '../../src/MarkerAreaState';
// import { Animate } from '../../src/plugins/animate/Animate';

export * from './../../src/index';

export class Experiments {
  private markerView1: MarkerView;
  private currentState: MarkerAreaState = {
    width: 427,
    height: 320,
    markers: [
      {
        strokeColor: '#FFFF00',
        strokeWidth: 3,
        strokeDasharray: '12 3',
        curveX: 315,
        curveY: 55,
        x1: 123,
        y1: 98,
        x2: 338,
        y2: 204,
        typeName: 'CurveMarker',
        state: 'select',
      } as MarkerBaseState,
      {
        fillColor: 'transparent',
        strokeColor: '#EF4444',
        strokeWidth: 3,
        strokeDasharray: '',
        opacity: 1,
        left: 55,
        top: 51,
        width: 223,
        height: 160,
        rotationAngle: -16.068700831466217,
        visualTransformMatrix: { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 },
        containerTransformMatrix: {
          a: 0.9609305006515487,
          b: -0.27678976302884456,
          c: 0.27678976302884456,
          d: 0.9609305006515487,
          e: -29.75438731526151,
          f: 51.20359995894974,
        },
        typeName: 'FrameMarker',
        state: 'select',
      } as MarkerBaseState,
      {
        color: '#EF4444',
        fontFamily: 'Helvetica, Arial, sans-serif',
        padding: 5,
        text: 'Hello there!',
        left: 226,
        top: 214,
        width: 167,
        height: 68,
        rotationAngle: 0,
        visualTransformMatrix: { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 },
        containerTransformMatrix: { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 },
        typeName: 'TextMarker',
        state: 'select',
      } as MarkerBaseState,
      {
        bgColor: '#FFFF00',
        tipPosition: { x: -88.82403945922852, y: 108.55281066894531 },
        color: '#2563EB',
        fontFamily: 'Helvetica, Arial, sans-serif',
        padding: 5,
        text: 'This is awesome!',
        left: 117,
        top: 56,
        width: 167,
        height: 67,
        rotationAngle: -28.16252737432361,
        visualTransformMatrix: { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 },
        containerTransformMatrix: {
          a: 0.8816123239267032,
          b: -0.4719742686848063,
          c: 0.4719742686848063,
          d: 0.8816123239267032,
          e: -18.504967994594153,
          f: 105.22653787986373,
        },
        typeName: 'CalloutMarker',
        state: 'select',
      } as MarkerBaseState,
    ],
  };
  // private currentState: MarkerAreaState = {
  //   width: 427,
  //   height: 320,
  //   markers: [
  //     {
  //       fillColor: 'transparent',
  //       strokeColor: '#EF4444',
  //       strokeWidth: 3,
  //       strokeDasharray: '',
  //       opacity: 1,
  //       left: 70,
  //       top: 72,
  //       width: 124,
  //       height: 103,
  //       rotationAngle: 0,
  //       visualTransformMatrix: { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 },
  //       containerTransformMatrix: { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 },
  //       typeName: 'FrameMarker',
  //       state: 'select',
  //     } as MarkerBaseState,
  //   ],
  // };

  constructor() {
    //Activator.addKey('1234');
  }

  public openMarkerView(target: HTMLImageElement): void {
    this.markerView1 = new MarkerView(target);
    //Style.styleSheetRoot = document.head;

    const stateText = (document.getElementById(
      'markerAreaState'
    ) as HTMLTextAreaElement).value;
    if (stateText !== undefined && stateText.trim() !== '') {
      this.currentState = JSON.parse(stateText);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.markerView1.addEventListener('create', (mv) => console.log('created'));
    this.markerView1.addEventListener('close', () => console.log('closed'));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.markerView1.addEventListener('load', (mv) => console.log('loaded'));
    this.markerView1.addEventListener('select', (mv, marker) =>
      console.log(marker)
    );
    this.markerView1.addEventListener('over', (mv, marker) =>
      console.log('over', marker)
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.markerView1.addEventListener('pointerdown', (mv, ev, marker) =>
      console.log('down:', ev.clientX, ev.clientY, marker)
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.markerView1.addEventListener('pointerup', (mv, ev, marker) =>
      console.log('up:', ev.clientX, ev.clientY, marker)
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //this.markerView1.addEventListener('pointermove', (mv, ev, marker) => console.log('move:', ev.clientX, ev.clientY));

    // const animate = new Animate();
    // this.markerView1.addPlugin(animate);

    this.markerView1.show(this.currentState);
  }

  public closeMarkerView(): void {
    if (this.markerView1) {
      this.markerView1.close();
    }
  }
}
