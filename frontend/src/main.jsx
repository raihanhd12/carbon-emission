import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import App from "./App.jsx";
import LandingPage from "./LandingPage/LandingPage.jsx";
import ConnectWallet from "./ConnectWallet/ConnectWallet.jsx";
import Explore from "./Explore/Explore.jsx"

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/ConnectWallet',
    element: <ConnectWallet />,
  },
  {
    path: '/Explore',
    element: <Explore />,
  },
])

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
