import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from 'react-router-dom'
import config from "./config"

import ToastProvider from "@/components/toast/toastProvider"
import App from "@/components/app/app";


// 注入 static 配置
window.CONFIG = config()

//styles
import './styles/global.css';
import './styles/normalize.css';
import "./styles/variables.css"

ReactDOM.render(
  <BrowserRouter basename='/'>
    <ToastProvider>
      <App />
    </ToastProvider>
  </BrowserRouter>, 
  document.getElementById("root")
);
