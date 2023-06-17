import {
  ViewCarousel,
  Folder,
  Dashboard,
  Business,
  Send,
  Storage,
} from "@mui/icons-material";

import API from "./pages/ide/API";
import Logs from "./pages/ide/Logs";
import Query from "./pages/ide/Query";
import Functions from "./pages/ide/Functions";

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
];

export default routes;
