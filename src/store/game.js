const START_GAME = "START_GAME";

export const startGame = () => {
  return (dispatch) => {
    dispatch({
      type: START_GAME,
    });
  };
};

const initialState = {
  gameStarted: false,
  money: 10000,
  stamina: 100,
  position: [52.52, 13.405],
  cities: [
    { name: "Dublin", lat: 53.3498, lng: -6.2603 },
    { name: "London", lat: 51.5074, lng: -0.1278 },
    { name: "Oslo", lat: 59.9139, lng: 10.7522 },
    { name: "Stockholm", lat: 59.3293, lng: 18.0686 },
    { name: "Copenhagen", lat: 55.6761, lng: 12.5683 },
    { name: "Helsinki", lat: 60.1699, lng: 24.9384 },
    { name: "Moscow", lat: 55.7558, lng: 37.6173 },
    { name: "Minsk", lat: 53.9006, lng: 27.559 },
    { name: "St. Petersburg", lat: 59.9311, lng: 30.3609 },
    { name: "Warsaw", lat: 52.2297, lng: 21.0122 },
    { name: "Kyiv", lat: 50.4501, lng: 30.5234 },
    { name: "Budapest", lat: 47.4979, lng: 19.0402 },
    { name: "Istanbul", lat: 41.0082, lng: 28.9784 },
    { name: "Athens", lat: 37.9838, lng: 23.7275 },
    { name: "Prague", lat: 50.0755, lng: 14.4378 },
    { name: "Vienna", lat: 48.2082, lng: 16.3738 },
    { name: "Rome", lat: 41.9028, lng: 12.4964 },
    { name: "Paris", lat: 48.8566, lng: 2.3522 },
    { name: "Amsterdam", lat: 52.3667, lng: 4.8945 },
    { name: "Luxembourg", lat: 49.8153, lng: 6.1296 },
    { name: "Berlin", lat: 52.52, lng: 13.405 },
    { name: "Lisbon", lat: 38.7223, lng: -9.1393 },
    { name: "Madrid", lat: 40.4168, lng: -3.7038 },
  ],
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case START_GAME:
      return {
        ...state,
        gameStarted: true,
      };
    default:
      return state;
  }
};
