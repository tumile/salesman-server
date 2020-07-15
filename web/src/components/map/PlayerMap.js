import L from "leaflet";
import PropTypes from "prop-types";
import React from "react";
import { Map as LeafletMap, Marker, Popup, TileLayer } from "react-leaflet";
import { connect } from "react-redux";
import "./Map.css";

const POINTS_OF_INTEREST = [
  {
    name: "Rijksmuseum",
    description:
      "The Rijksmuseum is a Dutch national museum dedicated to arts and history in Amsterdam. The museum is located at the Museum Square in the borough Amsterdam South, close to the Van Gogh Museum, the Stedelijk Museum Amsterdam, and the Concertgebouw. The Rijksmuseum was founded in The Hague on 19 November 1798 and moved to Amsterdam in 1808, where it was first located in the Royal Palace and later in the Trippenhuis. The current main building was designed by Pierre Cuypers and first opened in 1885. On 13 April 2013, after a ten-year renovation which cost € 375 million, the main building was reopened by Queen Beatrix. In 2013 and 2014, it was the most visited museum in the Netherlands with record numbers of 2.2 million and 2.47 million visitors. It is also the largest art museum in the country. The museum has on display 8,000 objects of art and history, from their total collection of 1 million objects from the years 1200–2000, among which are some masterpieces by Rembrandt, Frans Hals, and Johannes Vermeer. The museum also has a small Asian collection, which is on display in the Asian pavilion.",
    image: "images/rijksmuseum.jpg",
    position: [52.359927, 4.885108],
  },
];

class PlayerMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pois: [],
    };
  }

  componentDidMount() {
    this.setState({ pois: POINTS_OF_INTEREST });
  }

  render() {
    const { player } = this.props;
    const { pois } = this.state;

    return (
      <LeafletMap center={player.position} zoom={13} minZoom={13} maxZoom={14} zoomControl={false}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors &copy; <a href='https://carto.com/attributions'>CARTO</a>"
        />
        <Marker
          position={player.position}
          icon={L.icon({
            iconUrl: "images/player/salesman.png",
            iconSize: [30],
            iconAnchor: [15, 100],
          })}
        />
        {pois.map((p) => {
          return (
            <Marker key={p.name} position={p.position}>
              <Popup className="leaflet-popup">
                <div className="popup-content" style={{ backgroundImage: `url(${p.image})` }}>
                  <p>{p.description}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </LeafletMap>
    );
  }
}

PlayerMap.propTypes = {
  player: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default connect(({ player }) => ({ player }))(PlayerMap);
