import L from "leaflet";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { Marker } from "react-leaflet";

const CustomerMarker = (props) => {
  const { customer, city } = props;
  if (!customer) {
    return null;
  }
  return (
    <Marker
      position={[city.latitude, city.longitude - 0.005]}
      icon={L.divIcon({
        html: ReactDOMServer.renderToString(
          <div>
            <img className="customer-icon" src={customer.image} alt="Customer" />
          </div>
        ),
      })}
      onclick={() => console.log("asdf")}
    />
  );
};

export default CustomerMarker;
