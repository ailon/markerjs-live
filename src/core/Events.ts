import { MarkerView } from '../MarkerView';
import { MarkerBase } from './MarkerBase';

export type LoadEventHandler = (markerView: MarkerView) => void;
export type SelectEventHandler = (
  markerView: MarkerView,
  marker?: MarkerBase
) => void;

export interface IEventListenerRepository {
  load: LoadEventHandler[];
  select: SelectEventHandler[];
}

export type EventHandler<T extends keyof IEventListenerRepository> = T extends 'load'
  ? LoadEventHandler
  : T extends 'select'
  ? SelectEventHandler
  : SelectEventHandler;

export class EventListenerRepository implements IEventListenerRepository {
  'load': LoadEventHandler[] = [];
  'select': SelectEventHandler[] = [];

  public addEventListener<T extends keyof IEventListenerRepository>(
    eventType: T,
    handler: EventHandler<T>
  ): void {
    this[eventType].push(handler);
  }
}
