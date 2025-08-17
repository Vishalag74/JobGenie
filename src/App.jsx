import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RoleSelectionPage from './pages/RoleSelectionPage';
import QuestionsPage from './pages/QuestionsPage';
import FeedbackPage from './pages/FeedbackPage';

// Main App Component
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/role-selection" element={<RoleSelectionPage />} />
        <Route path="/questions" element={<QuestionsPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
      </Routes>
    </Router>
  );
}

export default App;
