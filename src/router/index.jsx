import React from "react";
import { createHashRouter, redirect, Navigate } from "react-router-dom";
import Auth from "@/components/Auth";
import Lazy from "@/components/Lazy";
import homeMicroApps from "./homeMicroApps";

const App = React.lazy(() => import("../App"));
const Login = React.lazy(() => import("../pages/Login"));
const WWB = React.lazy(() => import("../pages/WWB"));
const PocketBook = React.lazy(() => import("../pages/PocketBook"));

export default function getRouter(options) {
  return createHashRouter(
    [
      {
        path: "/",
        loader: () => redirect("Home"),
      },
      {
        path: "Login",
        element: (
          <Lazy>
            <Login />
          </Lazy>
        ),
      },
      {
        path: "Home",
        element: (
          <Auth>
            <Lazy>
              <App />
            </Lazy>
          </Auth>
        ),
        children: [
          {
            index: true,
            loader: () => redirect("WWB"),
          },
          ...homeMicroApps,
          {
            path: "WWB",
            element: (
              <Lazy>
                <WWB />
              </Lazy>
            ),
          },
          {
            path: "PocketBook",
            element: (
              <Lazy>
                <PocketBook />
              </Lazy>
            ),
          },
        ],
      },
    ],
    options
  );
}
