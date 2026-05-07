import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Stories from './pages/Stories';
import Login from './pages/Login';
import Register from './pages/Register';
import Bookmarks from './pages/Bookmarks';
import { AuthProvider, useAuth } from './context/AuthContext';

function Nav(){
  const { user, logout } = useAuth();
  return (
    <div className="nav-wrap">
      <div className="container">
        <nav className="nav">
          <div className="brand-row">
            <Link className="brand" to="/">HN Stories</Link>
            <div className="nav-links">
              <Link to="/">Stories</Link>
              <Link to="/bookmarks">Bookmarks</Link>
            </div>
          </div>
          <div className="right">
            {user ? (<>
              <span className="muted">Hi {user.username}</span>
              <button className="btn btn-outline" onClick={logout}>Logout</button>
            </>) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}

export default function App(){
  return (
    <AuthProvider>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<Stories />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
