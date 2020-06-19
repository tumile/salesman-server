import Trie from "./Trie";

const SHOW_CATALOG = "SHOW_CATALOG";
const SEARCH_CITY = "SEARCH_CITY";
const SELECT_CITY = "SELECT_CITY";

const CITIES = [
  { name: "Amsterdam", position: [52.3667, 4.8945] },
  { name: "Athens", position: [37.9838, 23.7275] },
  { name: "Berlin", position: [52.52, 13.405] },
  { name: "Budapest", position: [47.4979, 19.0402] },
  { name: "Copenhagen", position: [55.6761, 12.5683] },
  { name: "Dublin", position: [53.3498, -6.2603] },
  { name: "Helsinki", position: [60.1699, 24.9384] },
  { name: "Istanbul", position: [41.0082, 28.9784] },
  { name: "Kyiv", position: [50.4501, 30.5234] },
  { name: "Lisbon", position: [38.7223, -9.1393] },
  { name: "London", position: [51.5074, -0.1278] },
  { name: "Luxembourg", position: [49.8153, 6.1296] },
  { name: "Madrid", position: [40.4168, -3.7038] },
  { name: "Minsk", position: [53.9006, 27.559] },
  { name: "Moscow", position: [55.7558, 37.6173] },
  { name: "Oslo", position: [59.9139, 10.7522] },
  { name: "Paris", position: [48.8566, 2.3522] },
  { name: "Prague", position: [50.0755, 14.4378] },
  { name: "Rome", position: [41.9028, 12.4964] },
  { name: "Stockholm", position: [59.3293, 18.0686] },
  { name: "Vienna", position: [48.2082, 16.3738] },
  { name: "Warsaw", position: [52.2297, 21.0122] },
];

const suggestion = new Trie();

CITIES.forEach((city) => {
  suggestion.insert(city.name.toLowerCase());
});

export const showTravelCatalog = (isOpen) => {
  return (dispatch) => {
    dispatch({
      type: SHOW_CATALOG,
      payload: { travelCatalogOpen: isOpen, hotelCatalogOpen: false },
    });
  };
};

export const showHotelCatalog = (isOpen) => {
  return (dispatch) => {
    dispatch({
      type: SHOW_CATALOG,
      payload: { travelCatalogOpen: false, hotelCatalogOpen: isOpen },
    });
  };
};

export const searchCity = (key) => {
  return (dispatch) => {
    dispatch({
      type: SEARCH_CITY,
      payload: {
        citySearchKey: key,
        citySuggestions: key ? suggestion.suggest(key).map((name) => name.charAt(0).toUpperCase() + name.slice(1)) : [],
        flightInfo: null,
        flights: [],
      },
    });
  };
};

const getFlightInfo = (origin, destination) => {
  return fetch(
    `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin}&destinations=${destination}&key=AIzaSyA0HlNaNB-5MkrqB7FveaBP3mUb4JmZTPQ`
  )
    .then((res) => res.json())
    .then((res) => res.rows[0].elements[0])
    .then(({ distance, duration }) => ({ distance: distance.text, duration: duration.text }));
};

export const selectCity = (city) => {
  return async (dispatch, getState) => {
    const { currentCity } = getState().game;
    const info = await getFlightInfo(currentCity, city);
    const price = (50 + Number(info.distance.replace(/[^0-9]+/g, "")) * 0.11).toFixed(2);
    dispatch({
      type: SELECT_CITY,
      payload: {
        citySearchKey: city,
        citySuggestions: [],
        selectedCity: city,
        flightInfo: info,
        flights: [
          { name: "Ryanair", image: "", price },
          { name: "Lufthansa", image: "", price },
          { name: "Air France", image: "", price },
          { name: "KLM", image: "", price },
          { name: "easyJet", image: "", price },
          { name: "Turkish Airlines", image: "", price },
          { name: "Aeroflot", image: "", price },
        ],
      },
    });
  };
};

const initialState = {
  travelCatalogOpen: false,
  hotelCatalogOpen: false,
  cities: CITIES,
  citySearchKey: "",
  selectedCity: "",
  citySuggestions: [],
  flightInfo: null,
  flights: [],
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SHOW_CATALOG:
      return {
        ...state,
        ...payload,
      };
    case SEARCH_CITY:
      return {
        ...state,
        ...payload,
      };
    case SELECT_CITY:
      return {
        ...state,
        ...payload,
      };
    default:
      return state;
  }
};
