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
