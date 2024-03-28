import React from "react";

import { Navigate, Route, Routes } from "react-router-dom";

const RouteManager = ({ routes }) => {
  return (
    <Routes>
      {routes.map((route, i) =>
        route.container ? (
          <Route
            key={i}
            path={route.container?.path || "/"}
            element={route.container.element}
          >
            {route.pages &&
              route.pages.map((page, j) => (
                <Route key={j} path={page.path} element={page.element} />
              ))}
            {route.rules &&
              route.rules.map((rule, k) => (
                <Route
                  key={k}
                  path={rule.path}
                  element={<Navigate to={rule.to} />}
                />
              ))}
          </Route>
        ) : (
          <Route key={i} path={route.path} element={route?.element} />
        )
      )}
    </Routes>
  );
};

export default RouteManager;
