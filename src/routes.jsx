import { Folder, Hub, Send, Storage, ViewCarousel } from "@mui/icons-material";
import React, { lazy } from "react";

const Chat = lazy(() => import("./pages/Chat"));
const API = lazy(() => import("./pages/ide/API"));
const ChatContainer = lazy(() => import("./Containers/Chat"));
const Functions = lazy(() => import("./pages/ide/Functions"));
const IDE = lazy(() => import("./containers/IDE"));
const Logic = lazy(() => import("./pages/ide/Logic"));
const Logs = lazy(() => import("./pages/ide/Logs"));
const Mobile = lazy(() => import("./pages/ide/Mobile"));
const Query = lazy(() => import("./pages/ide/Query"));

const routes = [
  {
    container: { element: <IDE />, indexPath: "/sample/api" },
    pages: [
      {
        title: "API",
        link: "api",
        path: "/:project/api",
        anchor: true,
        element: <API />,
        icon: <Send />,
      },
      {
        title: "Functions",
        link: "functions",
        path: "/:project/functions",
        anchor: true,
        element: <Functions />,
        icon: <Folder />,
      },
      {
        title: "Logic",
        link: "logic",
        path: "/:project/logic",
        anchor: false,
        element: <Logic />,
        icon: <Hub />,
      },
      {
        title: "Query",
        link: "query",
        path: "/:project/query",
        anchor: false,
        element: <Query />,
        icon: <Storage />,
      },
      {
        title: "Logs",
        link: "logs",
        path: "/:project/logs",
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
];

export default routes;
