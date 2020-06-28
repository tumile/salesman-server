import React from "react";
import { Provider } from "react-redux";
import store from "../state";
import "./App.css";
import Map from "./Map";
import Menu from "./Menu";
import Sales from "./Sales";
import Welcome from "./Welcome";

const App = () => {
  return (
    <Provider store={store}>
      <Sales />
      <Welcome />
      <Menu />
      <Map />
    </Provider>
  );
};

export default App;
