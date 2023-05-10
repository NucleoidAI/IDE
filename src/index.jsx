import "./index.css";
import App from "./App";
import React from "react";
import boot from "./boot";

import { createRoot } from "react-dom/client";

boot.run();

const container = document.getElementById("root");
const root = createRoot(container);

root.render(<App />);
