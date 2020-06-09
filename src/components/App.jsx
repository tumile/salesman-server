import React from "react";
import { Provider } from "react-redux";
import Map from "./Map";
import Menu from "./Menu";
import "./App.css";
import store from "../store";
import Welcome from "./Welcome";

const App = () => {
  return (
    <Provider store={store}>
      <Welcome />
      <Menu />
      <Map />
    </Provider>
  );
};

export default App;
