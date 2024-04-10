import API from "./pages/ide/API";
import Chat from "./pages/chat";
import Functions from "./pages/ide/Functions";
import Logic from "./pages/ide/Logic";
import Logs from "./pages/ide/Logs";
import Mobile from "./pages/ide/Mobile";
import NotFound from "./pages/NotFound";
import Query from "./pages/ide/Query";

import {
  Folder,
  LensBlur,
  Send,
  Storage,
  ViewCarousel,
} from "@mui/icons-material";
import React, { lazy } from "react";

const ChatContainer = lazy(() => import("./containers/Chat"));
const IDEContainer = lazy(() => import("./containers/IDE"));
const Blank = lazy(() => import("./containers/Blank/Blank"));

const routes = [
  {
    container: {
      element: <IDEContainer />,
      path: ["/", "/:id"],
    },
    pages: [
      {
        title: "API",
        link: "api",
        path: "/:id/api",
        anchor: true,
        element: <API />,
        icon: <Send />,
      },
      {
        title: "Functions",
        link: "functions",
        path: "/:id/functions",
        anchor: true,
        element: <Functions />,
        icon: <Folder />,
      },
      {
        title: "Logic",
        link: "logic",
        path: "/:id/logic",
        anchor: false,
        element: <Logic />,
        icon: <LensBlur />,
      },
      {
        title: "Query",
        link: "query",
        path: "/:id/query",
        anchor: false,
        element: <Query />,
        icon: <Storage />,
      },
      {
        title: "Logs",
        link: "logs",
        path: "/:id/logs",
        anchor: false,
        element: <Logs />,
        icon: <ViewCarousel />,
      },
    ],
  },
  {
    container: {
      element: <ChatContainer />,
      path: "/chat",
    },
    pages: [
      {
        title: "Chat",
        path: "/chat/:chatId",
        element: <Chat />,
      },
    ],
  },
  {
    container: {
      element: <Blank />,
    },
    pages: [
      {
        path: "/mobile",
        element: <Mobile />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  { path: "/graph" },
];

export default routes;
