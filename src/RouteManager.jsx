import React from "react";

import { Route, Routes } from "react-router-dom";

const RouteManager = ({ routes }) => {
  return (
    <Routes>
      {routes.map((route, i) =>
        route.container ? (
          Array.isArray(route.container.path) ? (
            route.container.path.map((path, k) => (
              <Route
                key={`${i}-${k}`}
                path={path}
                element={route.container.element}
              >
                {route.pages &&
                  route.pages.map((page, j) => (
                    <Route key={j} path={page.path} element={page.element} />
                  ))}
              </Route>
            ))
          ) : (
            <Route
              key={i}
              path={route.container.path}
              element={route.container.element}
            >
              {route.pages &&
                route.pages.map((page, j) => (
                  <Route key={j} path={page.path} element={page.element} />
                ))}
            </Route>
          )
        ) : (
          <Route key={i} path={route.path} element={route?.element} />
        )
      )}
    </Routes>
  );
};

export default RouteManager;
