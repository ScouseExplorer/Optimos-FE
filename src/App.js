import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import React from 'react';
import ChatApp from './functionality/aichat.jsx'; 
import Functionality from './functionality/funchome.jsx';

function App() {
  return (
    <Router>
      <header className="header">
        <Link to="/" className="logo">lynxstrat</Link>
        <nav className="header-right">
          <Link to="/">Home</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/about">About</Link>
          <Link to="/login">Log in</Link>
          <Link to="/blog" className="signup-button">Blog</Link>
          {/* Button that sends users to funchome.jsx */}
          <Link to="/funchome" className="signup-button">
            <button type="button">Features</button>
          </Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={
          <>
            <div>
              <h1>Welcome to Optimos</h1>
              <p>Your guide in growing your LinkedIn reach and influence.</p>
            </div>

            <div>
              <h2>About Us</h2>
              <p>
                At Optimos, we specialize in helping professionals and businesses 
                enhance their LinkedIn presence through strategic content creation, 
                profile optimization, and targeted connection building.
              </p>

              <p>
                Im a world where connections matter. Let us help you make the most of yours.
              </p>
            </div>

            <div>
              <h2>Our Services</h2>
              <ul>
                <li>LinkedIn Profile Optimization</li>
                <li>Content Creation and Strategy</li>
                <li>Connection Building</li>
                <li>Analytics and Reporting</li>
              </ul>
            </div>

            <div>
              <h2>Why Choose Optimos?</h2>
              <ul>
                <li>Competitive pricing</li>
                <li>Grow your Brand overnight</li>
                <li>Expand your reach</li>
              </ul>
            </div>

            <Link to="/aichat" className="signup-button">Get Started</Link>
          </>
        } />

        <Route path="/aichat" element={<ChatApp />} />
        <Route path="/funchome" element={<Functionality />} />
        <Route path="/contact" element={
          <div>
            <h2>Contact Us</h2>
            <p>Email: contact@lynxstrat.com</p> 
            <p>Phone: +1 (123) 456-7890</p>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
