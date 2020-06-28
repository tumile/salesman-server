import Trie from "./Trie";
import cities from "./cities.json";

const SEARCH_CITY = "SEARCH_CITY";
const SELECT_CITY = "SELECT_CITY";
const OPEN_CATALOG = "OPEN_CATALOG";
const CLOSE_CATALOG = "CLOSE_CATALOG";
const SPAWN_CUSTOMER = "SPAWN_CUSTOMER";
const START_GAME = "START_GAME";
const TRAVEL = "TRAVEL";
const SELL = "SELL";
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
      customer: {
        city,
        offer: 800 + Math.floor(Math.random() * 500),
        name: "Customer",
        image: `images/customers/customer${Math.floor(Math.random() * 11)}.png`,
      },
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
      dispatch({ type: UPDATE_TIMER, payload: { increment: 1 } });
    }, 1000);
    dispatch({ type: START_GAME });
  };
};

export const showTravelCatalog = (isOpen) => {
  return (dispatch) => {
    dispatch({
      type: isOpen ? OPEN_CATALOG : CLOSE_CATALOG,
      payload: { travelCatalogOpen: isOpen, hotelCatalogOpen: false },
    });
  };
};

export const showHotelCatalog = (isOpen) => {
  return (dispatch) => {
    dispatch({
      type: isOpen ? OPEN_CATALOG : CLOSE_CATALOG,
      payload: { travelCatalogOpen: false, hotelCatalogOpen: isOpen },
    });
  };
};

export const searchCity = (key) => {
  return (dispatch) => {
    dispatch({
      type: SEARCH_CITY,
      payload: {
        key,
        suggestions: key ? suggestion.suggest(key).map((name) => name.charAt(0).toUpperCase() + name.slice(1)) : [],
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
        city,
        flights: [
          { name: "British Airways", image: "images/airlines/britishairways.png", price },
          { name: "Ryanair", image: "images/airlines/ryanair.png", price },
          { name: "Lufthansa", image: "images/airlines/lufthansa.png", price },
          { name: "Air France", image: "images/airlines/airfrance.png", price },
          { name: "KLM", image: "images/airlines/klm.png", price },
          { name: "easyJet", image: "images/airlines/easyjet.png", price },
          { name: "Turkish Airlines", image: "images/airlines/turkishairlines.png", price },
          { name: "Aeroflot", image: "images/airlines/aeroflot.png", price },
        ],
        flightInfo: info,
      },
    });
  };
};

export const travel = (price) => {
  return (dispatch, getState) => {
    const {
      destinationCity,
      flightInfo: { duration },
    } = getState();
    for (let i = 0; i < Math.floor(duration * 2); i += 1) {
      dispatch(spawnCustomer(getState()));
    }
    dispatch({
      type: TRAVEL,
      payload: { city: destinationCity, duration: Math.round(duration * 3600), price },
    });
  };
};

export const sell = (customer) => {
  return (dispatch) => {
    dispatch({
      type: SELL,
      payload: { customer },
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
        timer: state.timer + payload.increment,
      };
    case OPEN_CATALOG:
      return {
        ...state,
        ...payload,
      };
    case CLOSE_CATALOG:
      return {
        ...state,
        ...payload,
        citySearchKey: "",
        citySearchSuggestions: [],
        destinationCity: "",
        flights: [],
        flightInfo: null,
      };
    case SPAWN_CUSTOMER:
      return {
        ...state,
        customers: [...state.customers, payload.customer],
      };
    case SEARCH_CITY:
      return {
        ...state,
        citySearchKey: payload.key,
        citySearchSuggestions: payload.suggestions,
        flights: [],
        flightInfo: null,
      };
    case SELECT_CITY:
      return {
        ...state,
        citySearchKey: payload.city,
        citySearchSuggestions: [],
        destinationCity: payload.city,
        flights: payload.flights,
        flightInfo: payload.flightInfo,
      };
    case TRAVEL:
      return {
        ...state,
        timer: state.timer + payload.duration,
        money: state.money - payload.price,
        currentCity: payload.city,
        destinationCity: "",
        citySearchKey: "",
        citySearchSuggestions: [],
        flights: [],
        flightInfo: null,
        travelCatalogOpen: false,
      };
    case SELL:
      return {
        ...state,
        money: state.money + payload.customer.offer,
        customers: state.customers.filter((cust) => cust.city !== payload.customer.city),
      };
    default:
      return state;
  }
};
