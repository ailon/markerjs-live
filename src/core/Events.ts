import { MarkerView } from '../MarkerView';
import { MarkerBase } from './MarkerBase';

export type MarkerViewEventHandler = (markerView: MarkerView) => void;
export type MarkerEventHandler = (
  markerView: MarkerView,
  marker?: MarkerBase
) => void;
export type PointerEventHandler = (
  markerView: MarkerView,
  event: PointerEvent,
  marker?: MarkerBase
) => void;

export interface IEventListenerRepository {
  create: MarkerViewEventHandler[];
  close: MarkerViewEventHandler[];
  load: MarkerViewEventHandler[];
  select: MarkerEventHandler[];
  over: MarkerEventHandler[];
  pointerdown: PointerEventHandler[];
  pointermove: PointerEventHandler[];
  pointerup: PointerEventHandler[];
}

export type EventHandler<T extends keyof IEventListenerRepository> = T extends 'select'
  ? MarkerEventHandler
  : T extends 'over'
  ? MarkerEventHandler
  : T extends 'pointerdown'
  ? PointerEventHandler
  : T extends 'pointermove'
  ? PointerEventHandler
  : T extends 'pointerup'
  ? PointerEventHandler
  : MarkerViewEventHandler;

export class EventListenerRepository implements IEventListenerRepository {
  create: MarkerViewEventHandler[] = [];
  close: MarkerViewEventHandler[] = [];
  load: MarkerViewEventHandler[] = [];
  select: MarkerEventHandler[] = [];
  over: MarkerEventHandler[] = [];
  pointerdown: PointerEventHandler[] = [];
  pointermove: PointerEventHandler[] = [];
  pointerup: PointerEventHandler[] = [];

  public addEventListener<T extends keyof IEventListenerRepository>(
    eventType: T,
    handler: EventHandler<T>
  ): void {
    (<Array<EventHandler<T>>>this[eventType]).push(handler);
  }
}
