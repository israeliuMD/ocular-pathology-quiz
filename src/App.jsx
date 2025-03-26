import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Study from './pages/Study';
import Progress from './pages/Progress';

function App() {
  console.log("App component rendering");
  // The rest of your existing code stays the same
  return (
    <Routes>
      // ... existing routes
    </Routes>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="quiz" element={<Quiz />} />
        <Route path="study" element={<Study />} />
        <Route path="progress" element={<Progress />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
