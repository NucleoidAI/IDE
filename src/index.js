import "./index.css";
import App from "./App";
import React from "react";
import { createRoot } from "react-dom/client";
import vfs from "./vfs";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(<App />);
