import L from "leaflet";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { Marker, Popup } from "react-leaflet";

const PointMarker = (props) => {
  const { point } = props;
  return (
    <Marker
      key={point.name}
      position={[point.latitude, point.longitude]}
      icon={L.divIcon({
        html: ReactDOMServer.renderToString(
          <div>
            <img className="point-icon" src={point.image} alt="Point of interest" />
          </div>
        ),
      })}
    >
      <Popup>
        <div className="point-popup">
          <img src={point.image} alt="Point of interest" />
          <div className="point-popup-content">
            <h6>{point.name}</h6>
            <p>{point.description}</p>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default PointMarker;
