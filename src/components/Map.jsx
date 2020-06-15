import React, { useState } from "react";
import { Map as LeafletMap, Marker, Popup, TileLayer } from "react-leaflet";
import "./Map.css";

export default function Map() {
  const [position] = useState([48.8566, 2.3522]);

  const cities = [
    {
      name: "Rome",
      lat: 41.9028,
      lng: 12.4964,
    },
    {
      name: "London",
      lat: 51.5074,
      lng: 0.1278,
    },
    {
      name: "Paris",
      lat: 48.8566,
      lng: 2.3522,
    },
    {
      name: "Florence",
      lat: 43.7696,
      lng: 11.2558,
    },
    {
      name: "Barcelona",
      lat: 41.3851,
      lng: 2.1734,
    },
    {
      name: "Amsterdam",
      lat: 52.3667,
      lng: 4.8945,
    },
    {
      name: "Prague",
      lat: 50.0755,
      lng: 14.4378,
    },
    {
      name: "Venice",
      lat: 45.4408,
      lng: 12.3155,
    },
    {
      name: "Athens",
      lat: 37.9838,
      lng: 23.7275,
    },
    {
      name: "Vienna",
      lat: 48.2082,
      lng: 16.3738,
    },
    {
      name: "Dublin",
      lat: 53.3498,
      lng: 6.2603,
    },
    {
      name: "Berlin",
      lat: 52.52,
      lng: 13.405,
    },
    {
      name: "Munich",
      lat: 48.1351,
      lng: 11.582,
    },
    {
      name: "Lisbon",
      lat: 38.7223,
      lng: 9.1393,
    },
    {
      name: "Istanbul",
      lat: 41.0082,
      lng: 28.9784,
    },
    {
      name: "Edinburgh",
      lat: 55.9533,
      lng: 3.1883,
    },
    {
      name: "Madrid",
      lat: 40.4168,
      lng: 3.7038,
    },
    {
      name: "Stockholm",
      lat: 59.3293,
      lng: 18.0686,
    },
    {
      name: "Copenhagen",
      lat: 55.6761,
      lng: 12.5683,
    },
    {
      name: "St. Petersburg",
      lat: 59.9311,
      lng: 30.3609,
    },
  ];

  //Icon Randomizer
  let sourceIcon = function() {
    let i = Math.floor(Math.random() * 6);
    let icon = ['businessman2.png','businessman2-folder.png','businesswoman-calling.png','businesswoman2-calling.png','businesswoman2-determined.png','businessman2-pointing.png'];
    return icon[i];
  }

  return (
    <LeafletMap center={position} zoom={6} maxZoom={7} minZoom={4} zoomControl={false}>
      <TileLayer
        attribution="©OpenStreetMap, ©CartoDB"
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
      />
      {cities.map((c) => (
        <Marker position={[c.lat, c.lng]}>
          <Popup className="leaflet-popup">
            <div className="row">
              <div className="col-4">
                <img src={"images/" + sourceIcon()} className="img-fluid" alt="Customer" />
              </div>
              <div className="col-8">
                <div>
                  <h6>{c.name}</h6>
                  <p>Hi, I'm Dave. I'm looking to buy your product for $1000.</p>
                  <p className="text-muted">Offer expired in 05:00:00</p>
                  <button className="btn btn-primary btn-sm">Flights</button>
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </LeafletMap>
  );
}
