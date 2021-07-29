import { MarkerView } from '../MarkerView';
import { MarkerBase } from './MarkerBase';

export type EventType = 'load' | 'select';

export type LoadEventHandler = (markerView: MarkerView) => void;
export type SelectEventHandler = (
  markerView: MarkerView,
  marker?: MarkerBase
) => void;

export type EventHandler<T extends EventType> = T extends 'load'
  ? LoadEventHandler
  : T extends 'select'
  ? SelectEventHandler
  : SelectEventHandler;

// export type EventListenerRepository<T extends EventType> = Map<
//   T,
//   Array<EventHandler<T>>
// >;

export class EventListenerRepository extends Map<EventType, Array<EventHandler<EventType>>> {
  constructor() {
    super();
    // init handler arrays
    this.set('load', new Array<EventHandler<'load'>>());
    this.set('select', new Array<EventHandler<'select'>>());
  }

  public addEventListener<T extends EventType>(eventType: T, handler: EventHandler<T>): void {
    this.get(eventType).push(handler);
  }
}
