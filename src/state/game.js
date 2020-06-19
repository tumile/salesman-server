const START_GAME = "START_GAME";
const UPDATE_TIMER = "UPDATE_TIMER";
const SPAWN_CUSTOMER = "SPAWN_CUSTOMER";
const FLY = "FLY";

const spawnCustomer = (state) => {
  const {
    game: { customers, currentCity },
  } = state;
  let i = Math.floor(Math.random() * 22);
  // eslint-disable-next-line no-loop-func
  while (currentCity === i || customers.find((c) => c.city === i)) {
    i = Math.floor(Math.random() * 22);
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

export const bookFlight = (city, price) => {
  return (dispatch) => {
    dispatch({
      type: FLY,
      payload: {
        currentCity: city,
        price,
      },
    });
  };
};

const initialState = {
  gameStarted: false,
  timer: 0,
  money: 10000,
  stamina: 100,
  customers: [],
  currentCity: "Amsterdam",
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
    case FLY:
      return {
        ...state,
        currentCity: payload.currentCity,
        money: state.money - payload.price,
      };
    default:
      return state;
  }
};
