import L from "leaflet";
import "@elfalem/leaflet-curve";
import { Path, withLeaflet } from "react-leaflet";

class Curve extends Path {
  createLeafletElement(props) {
    const { positions, options, ...others } = props;
    return L.curve(positions, options, this.getOptions(others));
  }

  updateLeafletElement(fromProps, toProps) {
    if (toProps.positions !== fromProps.positions) {
      this.leafletElement.setPath(toProps.positions);
    }
    this.setStyleIfChanged(fromProps, toProps);
  }
}

export default withLeaflet(Curve);
