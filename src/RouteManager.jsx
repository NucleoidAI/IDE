import App from "./App";

import { Navigate, Route, Routes } from "react-router-dom";
import React, { Suspense } from "react";

const RouteManager = ({ routes }) => {
  const LoadingIndicator = () => (
    <div className="nuc-progress-indicator" id="nuc-progress-indicator">
      <div className="nuc-progress-indicator-head">
        <div className="nuc-progress-first-indicator"></div>
        <div className="nuc-progress-second-indicator"></div>
      </div>
      <div className="nuc-logo-frame">Nucleoid</div>
    </div>
  );
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <Routes>
        <Route path="/:id/*" element={<App />} exact />
        {routes.map((route, i) =>
          route.container ? (
            <Route key={i} path="/" element={route.container.element}>
              <Route
                index
                element={<Navigate to={route.container?.indexPath} />}
              />
              {route.pages &&
                route.pages.map((page, j) => (
                  <Route key={j} path={page.path} element={page.element} />
                ))}
            </Route>
          ) : (
            <Route key={i} path={route.path} element={route?.element} />
          )
        )}
      </Routes>
    </Suspense>
  );
};

export default RouteManager;
