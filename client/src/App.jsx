import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { SubscriptionProvider } from "./context/SubscriptionContext";
import { ProgressProvider } from "./context/ProgressContext";
import Admin from "./pages/Admin";
import ChapterDetails from "./pages/ChapterDetails";
import Chapters from "./pages/Chapters";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ModuleDetail from "./pages/ModuleDetail";
import Notifications from "./pages/Notifications";
import PastPapers from "./pages/PastPapers";
import Profile from "./pages/Profile";
import Quiz from "./pages/Quiz";
import Register from "./pages/Register";
import Search from "./pages/Search";
import Streams from "./pages/Streams";
import SubjectModules from "./pages/SubjectModules";
import Subjects from "./pages/Subjects";
import Subscription from "./pages/Subscription";
import Textbooks from "./pages/Textbooks";
import SubscriptionGate from "./components/SubscriptionGate";

const Protected = ({ children }) => (
  <MainLayout>
    <ProtectedRoute>
      <SubscriptionGate>
        {children}
      </SubscriptionGate>
    </ProtectedRoute>
  </MainLayout>
);

export default function App() {
  return (
    <SubscriptionProvider>
      <ProgressProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            {/* ── Public pages ── */}
            <Route path="/" element={<MainLayout><Home /></MainLayout>} />
            <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
            <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />
            <Route path="/forgot-password" element={<AuthLayout><ForgotPassword /></AuthLayout>} />
            <Route path="/subscription" element={<MainLayout><Subscription /></MainLayout>} />
            <Route path="/search" element={<MainLayout><Search /></MainLayout>} />

            {/* ── Protected pages ── */}
            <Route path="/streams/:id"               element={<Protected><Streams /></Protected>} />
            <Route path="/subject/:subject/:classId" element={<Protected><SubjectModules /></Protected>} />
            <Route path="/module/:subject/:classId/:moduleId" element={<Protected><ModuleDetail /></Protected>} />
            <Route path="/subjects/:classId"         element={<Protected><Subjects /></Protected>} />
            <Route path="/chapters/:subjectId"       element={<Protected><Chapters /></Protected>} />
            <Route path="/chapter/:id"               element={<Protected><ChapterDetails /></Protected>} />
            <Route path="/quiz/:chapterId"           element={<Protected><Quiz /></Protected>} />
            <Route path="/textbooks"                 element={<Protected><Textbooks /></Protected>} />
            <Route path="/past-papers"               element={<Protected><PastPapers /></Protected>} />
            <Route path="/profile"                   element={<Protected><Profile /></Protected>} />
            <Route path="/notifications"             element={<Protected><Notifications /></Protected>} />
            <Route path="/admin"                     element={<Protected><Admin /></Protected>} />
          </Routes>
        </BrowserRouter>
      </ProgressProvider>
    </SubscriptionProvider>
  );
}
