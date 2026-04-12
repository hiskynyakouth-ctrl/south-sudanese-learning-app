import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import ChapterDetails from "./pages/ChapterDetails";
import Chapters from "./pages/Chapters";
import ChatAI from "./pages/ChatAI";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Quiz from "./pages/Quiz";
import Register from "./pages/Register";
import Subjects from "./pages/Subjects";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path="/subjects/:classId"
          element={
            <MainLayout>
              <Subjects />
            </MainLayout>
          }
        />
        <Route
          path="/chapters/:subjectId"
          element={
            <MainLayout>
              <Chapters />
            </MainLayout>
          }
        />
        <Route
          path="/chapter/:id"
          element={
            <MainLayout>
              <ChapterDetails />
            </MainLayout>
          }
        />
        <Route
          path="/quiz/:chapterId"
          element={
            <MainLayout>
              <Quiz />
            </MainLayout>
          }
        />
        <Route
          path="/chat"
          element={
            <MainLayout>
              <ChatAI />
            </MainLayout>
          }
        />
        <Route
          path="/login"
          element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          }
        />
        <Route
          path="/register"
          element={
            <AuthLayout>
              <Register />
            </AuthLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
