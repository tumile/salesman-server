import React from "react";
import { Provider } from "react-redux";
import store from "../state";
import "./App.css";
import Menu from "./menu/Menu";
import PlayerMap from "./map/PlayerMap";

const App = () => {
  return (
    <Provider store={store}>
      <Menu />
      <PlayerMap />
    </Provider>
  );
};

export default App;
