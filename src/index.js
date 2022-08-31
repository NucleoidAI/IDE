import "./index.css";
import App from "./App";
import boot from "./boot";
import React from "react";
import { createRoot } from "react-dom/client";

boot.run();

const container = document.getElementById("root");
const root = createRoot(container);

root.render(<App />);
