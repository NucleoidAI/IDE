import API from "./pages/ide/API";
import Functions from "./pages/ide/Functions";
import Logic from "./pages/ide/Logic";
import Logs from "./pages/ide/Logs";
import Query from "./pages/ide/Query";

import { Folder, Send, Storage, ViewCarousel } from "@mui/icons-material";

const routes = [
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
  {
    title: "Logic",
    link: "logic",
    path: "/:project/logic",
    anchor: false,
    element: <Logic />,
    icon: <></>,
  },
];

export default routes;
