import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from 'react-router-dom'
import './styles/global.css';
import App from "./components/app/app";

ReactDOM.render(
  <BrowserRouter basename='/'>
    <App />
  </BrowserRouter>, 
  document.getElementById("root")
);
