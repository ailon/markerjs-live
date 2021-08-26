import { MarkerView } from '../MarkerView';
import { MarkerBase } from './MarkerBase';

/**
 * General MarkerView event handler type.
 */
export type MarkerViewEventHandler = (markerView: MarkerView) => void;

/**
 * Marker event handler type.
 */
export type MarkerEventHandler = (
  markerView: MarkerView,
  marker?: MarkerBase
) => void;

/**
 * Pointer related marker event handler type.
 */
export type PointerEventHandler = (
  markerView: MarkerView,
  event: PointerEvent,
  marker?: MarkerBase
) => void;

/**
 * Describes a repository of MarkerView event handlers.
 */
export interface IEventListenerRepository {
  /**
   * Event handlers for the `create` event.
   */
  create: MarkerViewEventHandler[];
  /**
   * Event handlers for the `close` event.
   */
  close: MarkerViewEventHandler[];
  /**
   * Event handlers for the `load` event.
   */
  load: MarkerViewEventHandler[];
  /**
   * Event handlers for the `select` event.
   */
  select: MarkerEventHandler[];
  /**
   * Event handlers for the `over` event.
   */
  over: MarkerEventHandler[];
  /**
   * Event handlers for the `pointerdown` event.
   */
  pointerdown: PointerEventHandler[];
  /**
   * Event handlers for the `pointermove` event.
   */
  pointermove: PointerEventHandler[];
  /**
   * Event handlers for the `pointerup` event.
   */
  pointerup: PointerEventHandler[];
  /**
   * Event handlers for the `pointerenter` event.
   */
  pointerenter: PointerEventHandler[];
  /**
   * Event handlers for the `pointerleave` event.
   */
  pointerleave: PointerEventHandler[];
}

/**
 * Event handler type for a specific event type.
 */
export type EventHandler<
  T extends keyof IEventListenerRepository
> = T extends 'select'
  ? MarkerEventHandler
  : T extends 'over'
  ? MarkerEventHandler
  : T extends 'pointerdown'
  ? PointerEventHandler
  : T extends 'pointermove'
  ? PointerEventHandler
  : T extends 'pointerup'
  ? PointerEventHandler
  : T extends 'pointerenter'
  ? PointerEventHandler
  : T extends 'pointerleave'
  ? PointerEventHandler
  : MarkerViewEventHandler;

/**
 * Event handler repository.
 */
export class EventListenerRepository implements IEventListenerRepository {
  /**
   * Event handlers for the `create` event.
   */
  create: MarkerViewEventHandler[] = [];
  /**
   * Event handlers for the `close` event.
   */
  close: MarkerViewEventHandler[] = [];
  /**
   * Event handlers for the `load` event.
   */
  load: MarkerViewEventHandler[] = [];
  /**
   * Event handlers for the `select` event.
   */
  select: MarkerEventHandler[] = [];
  /**
   * Event handlers for the `over` event.
   */
  over: MarkerEventHandler[] = [];
  /**
   * Event handlers for the `pointerdown` event.
   */
  pointerdown: PointerEventHandler[] = [];
  /**
   * Event handlers for the `pointermove` event.
   */
  pointermove: PointerEventHandler[] = [];
  /**
   * Event handlers for the `pointerup` event.
   */
  pointerup: PointerEventHandler[] = [];
  /**
   * Event handlers for the `pointerenter` event.
   */
  pointerenter: PointerEventHandler[] = [];
  /**
   * Event handlers for the `pointerleave` event.
   */
  pointerleave: PointerEventHandler[] = [];

  /**
   * Add an event handler for a specific event type.
   * @param eventType - event type.
   * @param handler - function to handle the event.
   */
  public addEventListener<T extends keyof IEventListenerRepository>(
    eventType: T,
    handler: EventHandler<T>
  ): void {
    (<Array<EventHandler<T>>>this[eventType]).push(handler);
  }

  /**
   * Remove an event handler for a specific event type.
   * @param eventType - event type.
   * @param handler - function currently handling the event.
   */
  public removeEventListener<T extends keyof IEventListenerRepository>(
    eventType: T,
    handler: EventHandler<T>
  ): void {
    const index = (<Array<EventHandler<T>>>this[eventType]).indexOf(handler);
    if (index > -1) {
      (<Array<EventHandler<T>>>this[eventType]).splice(index, 1);
    }
  }
}
