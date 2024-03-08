import API from "./pages/ide/API";
import Chat from "./pages/chat";
import ChatContainer from "./containers/Chat/Chat";
import Functions from "./pages/ide/Functions";
import Logic from "./pages/ide/Logic";
import Logs from "./pages/ide/Logs";
import Mobile from "./pages/ide/Mobile";
import Query from "./pages/ide/Query";

import {
  Folder,
  LensBlur,
  Send,
  Storage,
  ViewCarousel,
} from "@mui/icons-material";
import React, { lazy } from "react";

const IDE = lazy(() => import("./containers/IDE"));
const routes = [
  {
    container: { element: <IDE /> },
    pages: [
      {
        title: "API",
        link: "api",
        path: ":id/api",
        anchor: true,
        element: <API />,
        icon: <Send />,
      },
      {
        title: "Functions",
        link: "functions",
        path: ":id/functions",
        anchor: true,
        element: <Functions />,
        icon: <Folder />,
      },
      {
        title: "Logic",
        link: "logic",
        path: ":id/logic",
        anchor: false,
        element: <Logic />,
        icon: <LensBlur />,
      },
      {
        title: "Query",
        link: "query",
        path: ":id/query",
        anchor: false,
        element: <Query />,
        icon: <Storage />,
      },
      {
        title: "Logs",
        link: "logs",
        path: ":id/logs",
        anchor: false,
        element: <Logs />,
        icon: <ViewCarousel />,
      },
    ],
  },
  {
    container: { element: <ChatContainer />, indexPath: "/chat" },
    pages: [
      {
        title: "Chat",
        path: "/chat",
        element: <Chat />,
      },
    ],
  },
  {
    path: "/mobile",
    element: <Mobile />,
  },
  { path: "/graph" },
];

export default routes;
