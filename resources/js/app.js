import "./bootstrap";
import "../sass/app.scss";

import React from "react";
import ReactDOM from "react-dom";
import Example from "./components/Example";

const rootElement = document.getElementById("app");
if (rootElement) {
    ReactDOM.render(<Example />, rootElement);
}
