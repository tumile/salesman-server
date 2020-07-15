import { applyMiddleware, createStore } from "redux";
import reduxThunk from "redux-thunk";
import game from "./game";

const store = createStore(game, applyMiddleware(reduxThunk));

export default store;
