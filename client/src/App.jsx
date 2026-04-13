import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import ChapterDetails from "./pages/ChapterDetails";
import Chapters from "./pages/Chapters";
import ChatAI from "./pages/ChatAI";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ModuleDetail from "./pages/ModuleDetail";
import Quiz from "./pages/Quiz";
import Register from "./pages/Register";
import Streams from "./pages/Streams";
import SubjectModules from "./pages/SubjectModules";
import Subjects from "./pages/Subjects";
import Textbooks from "./pages/Textbooks";

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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
          path="/textbooks"
          element={
            <MainLayout>
              <Textbooks />
            </MainLayout>
          }
        />
        <Route
          path="/streams/:id"
          element={
            <MainLayout>
              <Streams />
            </MainLayout>
          }
        />
        <Route
          path="/subject/:subject/:classId"
          element={
            <MainLayout>
              <SubjectModules />
            </MainLayout>
          }
        />
        <Route
          path="/module/:subject/:classId/:moduleId"
          element={
            <MainLayout>
              <ModuleDetail />
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
