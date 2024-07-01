import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './components/User/HomePage';
import QuizListPage from './components/User/QuizListPage';
import CredentialScreen from './components/User/CredentialScreen/ToggleScreen';
import AdminDashboard from './components/Admin/AdminDashboard';
import AdminQuizView from './components/Admin/AdminQuizView'
import ProtectedRoute from './components/ProtectedRoute';
import QuizPage from './components/User/QuizPage';


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomeScreen />} />
                <Route path="/quizzes" element={<QuizListPage />}/>
                <Route path="/quizzes/:id" element={<QuizPage />} />
                <Route path="/login" element={<CredentialScreen />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<AdminDashboard />} />
                    <Route path="/dashboard/:id" element={<AdminQuizView />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
