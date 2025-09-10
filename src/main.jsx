import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store, persistor } from "./redux/store/store.js";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App.jsx";
import "./index.css";

const root = document.getElementById("root");

if (root) {
  createRoot(root).render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}
