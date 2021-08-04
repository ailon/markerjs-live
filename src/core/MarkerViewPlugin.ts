import { MarkerView } from '../MarkerView';

export interface IMarkerViewPlugin {
  init: (markerView: MarkerView) => void;
}
