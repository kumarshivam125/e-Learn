import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

import rootReducer from "./reducers";
import {configureStore} from "@reduxjs/toolkit";
import {Provider} from "react-redux";

const store=configureStore({
    reducer:rootReducer
})
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
  </React.StrictMode>
);
