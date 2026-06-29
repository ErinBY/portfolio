import { createBrowserRouter } from "react-router";
import Portfolio from "./components/Portfolio";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Portfolio,
  },
  {
    path: "/portfolio/",
    Component: Portfolio,
  },
], { basename: import.meta.env.BASE_URL });
