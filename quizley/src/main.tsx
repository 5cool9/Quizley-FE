import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { LevelProvider } from "./context/LevelCotext";

const container = document.getElementById("root") as HTMLElement;
createRoot(container).render(
  <React.StrictMode>
    <BrowserRouter>
      <LevelProvider>
        <App />
      </LevelProvider>
    </BrowserRouter>
  </React.StrictMode>
);
