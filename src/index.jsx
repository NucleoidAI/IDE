import "./index.css";

import App from "./App";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import boot from "./boot";
import { createRoot } from "react-dom/client";

boot.run();

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <BrowserRouter basename="ide">
    <App />
  </BrowserRouter>
);
