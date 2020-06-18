const START_GAME = "START_GAME";
const UPDATE_TIMER = "UPDATE_TIMER";
const SPAWN_CUSTOMER = "SPAWN_CUSTOMER";

const spawnCustomer = (state) => {
  const { currentCity, customers } = state.game;
  let i = Math.floor(Math.random() * 24);
  // eslint-disable-next-line no-loop-func
  while (currentCity === i || customers.find((c) => c.city === i)) {
    i = Math.floor(Math.random() * 24);
  }
  return {
    type: SPAWN_CUSTOMER,
    payload: {
      city: i,
      name: "Customer",
      image: `images/customers/customer${Math.floor(Math.random() * 11)}.png`,
    },
  };
};

export const updateTimer = (amount) => {
  return (dispatch) => {
    dispatch({
      type: UPDATE_TIMER,
      payload: amount,
    });
  };
};

export const startGame = () => {
  return (dispatch, getState) => {
    setInterval(() => {
      if (getState().game.timer % 3600 === 0) {
        dispatch(spawnCustomer(getState()));
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

const initialState = {
  gameStarted: false,
  timer: 0,
  money: 10000,
  stamina: 100,
  currentCity: 0,
  customers: [],
  cities: [
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
    { name: "St. Petersburg", position: [59.9311, 30.3609] },
    { name: "Stockholm", position: [59.3293, 18.0686] },
    { name: "Vienna", position: [48.2082, 16.3738] },
    { name: "Warsaw", position: [52.2297, 21.0122] },
  ],
  flights: [
    { name: "Ryanair", image: "" },
    { name: "Lufthansa", image: "" },
    { name: "Air France", image: "" },
    { name: "KLM", image: "" },
    { name: "easyJet", image: "" },
    { name: "Turkish Airlines", image: "" },
    { name: "Aeroflot", image: "" },
  ],
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case START_GAME:
      return {
        ...state,
        gameStarted: true,
      };
    case SPAWN_CUSTOMER:
      return {
        ...state,
        customers: [...state.customers, payload],
      };
    case UPDATE_TIMER:
      return {
        ...state,
        timer: state.timer + payload,
      };
    default:
      return state;
  }
};
