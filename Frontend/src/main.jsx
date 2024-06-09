import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, } from "react-router-dom";
import "./index.css";
import Root from "./routes/root";

import Works from "./routes/works/Works/Works";
import To_do_list from "./routes/activity/to_do_list";
import River_order from "./routes/purchase/river_order";
import Store_order from "./routes/purchase/store_order";
import Internet_order from "./routes/purchase/internet_order";
import Deliver_goods from "./routes/record/deliver_goods";
import Notes from "./routes/notes/notes";
import Home from "./routes/works/Home";
import EmployeeManage from "./routes/EmployeeManage";

import ErrorPage from "./routes/error-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/Restock-and-Refund",
        element: <Deliver_goods />,
      },
      {
        path: "/Works",
        element: <Works />,
      },
      {
        path: "/internet_order",
        element: <Internet_order />,
      },
      {
        path: "/store_order",
        element: <Store_order />,
      },
      {
        path: "/river_order",
        element: <River_order />,
      },
      {
        path: "/to_do_list",
        element: <To_do_list />,
      },
      {
        path: "/Note",
        element: <Notes />,
      },
      {
        path: "/Home",
        element: <Home />,
      },
      {
        path: "/EmployeeManage",
        element: <EmployeeManage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);