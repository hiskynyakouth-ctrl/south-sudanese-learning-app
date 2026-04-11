import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import Home from './pages/Home';
import Subjects from './pages/Subjects';
import Chapters from './pages/Chapters';
import ChapterDetails from './pages/ChapterDetails';
import Quiz from './pages/Quiz';
import ChatAI from './pages/ChatAI';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/subjects" element={<MainLayout><Subjects /></MainLayout>} />
        <Route path="/chapters/:subjectId" element={<MainLayout><Chapters /></MainLayout>} />
        <Route path="/chapter/:chapterId" element={<MainLayout><ChapterDetails /></MainLayout>} />
        <Route path="/quiz/:chapterId" element={<MainLayout><Quiz /></MainLayout>} />
        <Route path="/chat" element={<MainLayout><ChatAI /></MainLayout>} />
        <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
        <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />
      </Routes>
    </Router>
  );
}

export default App;