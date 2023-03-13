import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from 'react-router-dom'

import ToastProvider from "@/components/toast/toastProvider"
import TooltipProvider from "@/components/tooltip/tooltipProvider"
import App from "@/components/app/app";


//styles
import './styles/global.css';
import './styles/normalize.css';
import "./styles/variables.less"

ReactDOM.render(
  <BrowserRouter basename='/'>
    <ToastProvider>
      <TooltipProvider>
        <App />
      </TooltipProvider>
    </ToastProvider>
  </BrowserRouter>, 
  document.getElementById("root")
);
