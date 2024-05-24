import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./lib/pages/Home";
import Login from "./lib/pages/Login";
import Register from "./lib/pages/Register";

const router = createBrowserRouter([
  {
    path: "",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
