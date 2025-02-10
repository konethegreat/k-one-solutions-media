// filepath: /c:/Users/Konet/OneDrive/Desktop/Social Media Platform/k-one-solutions-media/src/frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './utils/AuthContext';
import Navbar from './components/Navbar';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Messages from './pages/Messages';
import SearchPage from './pages/SearchPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/search" element={<SearchPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Feed />} />
                <Route path="/profile/:userId" element={<Profile />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/messages" element={<Messages />} />
              </Route>
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};
App.defaultProps = {
  initialRoute: '/',
  config: {
    apiUrl: process.env.REACT_APP_API_URL,
    enableAuth: true
  }
};

export default App;