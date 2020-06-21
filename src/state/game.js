import Trie from "./Trie";
import cities from "./cities.json";

const SEARCH_CITY = "SEARCH_CITY";
const SELECT_CITY = "SELECT_CITY";
const SHOW_CATALOG = "SHOW_CATALOG";
const SPAWN_CUSTOMER = "SPAWN_CUSTOMER";
const START_GAME = "START_GAME";
const TRAVEL = "TRAVEL";
const UPDATE_TIMER = "UPDATE_TIMER";

const suggestion = new Trie();

cities.forEach((city) => {
  suggestion.insert(city.name.toLowerCase());
});

const spawnCustomer = (state) => {
  const { customers, cities, currentCity } = state;
  let city = cities[Math.floor(Math.random() * cities.length)].name;
  // eslint-disable-next-line no-loop-func
  while (city === currentCity || customers.find((cust) => cust.city === city)) {
    city = cities[Math.floor(Math.random() * cities.length)].name;
  }
  return {
    type: SPAWN_CUSTOMER,
    payload: {
      city,
      name: "Customer",
      image: `images/customers/customer${Math.floor(Math.random() * 11)}.png`,
    },
  };
};

const getFlightInfo = (origin, destination) => {
  return fetch(
    `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin}&destinations=${destination}&key=AIzaSyA0HlNaNB-5MkrqB7FveaBP3mUb4JmZTPQ`
  )
    .then((res) => res.json())
    .then((res) => res.rows[0].elements[0])
    .then(({ distance }) => {
      distance = Number(distance.text.replace(/[^0-9.]/g, ""));
      const duration = distance / 575;
      return { distance, duration };
    });
};

export const startGame = () => {
  return (dispatch, getState) => {
    setInterval(() => {
      const state = getState();
      if (state.timer % 3600 === 0) {
        dispatch(spawnCustomer(state));
      }
      dispatch({
        type: UPDATE_TIMER,
        payload: 1,
      });
    }, 1000);
    dispatch({
      type: START_GAME,
    });
  };
};

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
        citySearchSuggestions: key
          ? suggestion.suggest(key).map((name) => name.charAt(0).toUpperCase() + name.slice(1))
          : [],
        flights: [],
        flightInfo: null,
      },
    });
  };
};

export const setDestinationCity = (city) => {
  return async (dispatch, getState) => {
    const { currentCity } = getState();
    const info = await getFlightInfo(currentCity, city);
    const price = (50 + info.distance * 0.11).toFixed(2);
    dispatch({
      type: SELECT_CITY,
      payload: {
        citySearchKey: city,
        citySearchSuggestions: [],
        destinationCity: city,
        flights: [
          { name: "Ryanair", image: "", price },
          { name: "Lufthansa", image: "", price },
          { name: "Air France", image: "", price },
          { name: "KLM", image: "", price },
          { name: "easyJet", image: "", price },
          { name: "Turkish Airlines", image: "", price },
          { name: "Aeroflot", image: "", price },
        ],
        flightInfo: info,
      },
    });
  };
};

export const travel = (city, price) => {
  return (dispatch) => {
    dispatch({
      type: TRAVEL,
      payload: { city, price },
    });
  };
};

const initialState = {
  gameStarted: false,
  timer: 0,
  money: 10000,
  stamina: 100,
  customers: [],
  cities,
  currentCity: "Amsterdam",
  destinationCity: "",
  citySearchKey: "",
  citySearchSuggestions: [],
  flights: [],
  flightInfo: null,
  travelCatalogOpen: false,
  hotelCatalogOpen: false,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case START_GAME:
      return {
        ...state,
        gameStarted: true,
      };
    case UPDATE_TIMER:
      return {
        ...state,
        timer: state.timer + payload,
      };
    case SPAWN_CUSTOMER:
      return {
        ...state,
        customers: [...state.customers, payload],
      };
    case TRAVEL:
      return {
        ...state,
        money: state.money - payload.price,
        currentCity: payload.city,
        destinationCity: "",
        citySearchKey: "",
        citySearchSuggestions: [],
        flights: [],
        flightInfo: null,
        travelCatalogOpen: false,
      };
    case SHOW_CATALOG:
    case SEARCH_CITY:
    case SELECT_CITY:
      return {
        ...state,
        ...payload,
      };
    default:
      return state;
  }
};
