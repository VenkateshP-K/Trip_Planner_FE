import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

import { Provider } from "react-redux";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.js";

import { store } from "./app/store.js";

createRoot(document.getElementById("root")).render(
    <Provider store={store}>
      <App />
    </Provider>
);
