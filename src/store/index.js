import { applyMiddleware, combineReducers, createStore } from "redux";
import reduxThunk from "redux-thunk";
import game from "./game";
import menu from "./menu";

const rootReducer = combineReducers({ menu, game });

const store = createStore(rootReducer, applyMiddleware(reduxThunk));

console.log(store.getState());

export default store;
