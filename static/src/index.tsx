import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from 'react-router-dom'
import App from "./components/app/app";

//styles
import './styles/global.css';
import './styles/normalize.css';
import "./styles/variables.css"

ReactDOM.render(
  <BrowserRouter basename='/'>
    <App />
  </BrowserRouter>, 
  document.getElementById("root")
);
