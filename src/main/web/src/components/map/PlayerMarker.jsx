import L from "leaflet";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { Marker } from "react-leaflet";

const PlayerMarker = (props) => {
  const { player, city } = props;
  return (
    <Marker
      position={[city.latitude, city.longitude]}
      icon={L.divIcon({
        html: ReactDOMServer.renderToString(
          <div>
            <img className="player-icon" src={player.image} alt="Player" />
          </div>
        ),
      })}
    />
  );
};

export default PlayerMarker;
