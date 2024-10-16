import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { ThirdwebProvider } from "thirdweb/react";
import "./index.css";

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <ThirdwebProvider>
        <App />
      </ThirdwebProvider>
    </React.StrictMode>
  );
} else {
  console.error("Root element not found");
}
