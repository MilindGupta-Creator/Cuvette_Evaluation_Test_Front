import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider , Routes , Route } from "react-router-dom";
import Register from "./screens/register/Register";
import AdminPanel from "./screens/dashboard/AdminPanel";
import PollCompletion from "./screens/pollCompletion/PollCompletion";
import QuizCompletion from "./screens/quizCompletion/QuizCompletion";
import Questions from "./screens/questions/Questions";
import NotFound from "./screens/NotFound/NotFound";
import Report from "./screens/Report/Report";

const router = createBrowserRouter([
  { path: '/', element: <Register /> },
  { path: '/adminpanel', element: <AdminPanel /> },
  { path: '/pollcompleted', element: <PollCompletion /> },
  { path: '/quizcompleted', element: <QuizCompletion /> },
  { path: '/quiz/:quizId', element: <Questions /> },
  { path: '/quizanalysis', element: <Report /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router}>
    <Routes>
        <Route path="*" element={<NotFound/>} />
      </Routes>
      </RouterProvider>
  </React.StrictMode>
);
