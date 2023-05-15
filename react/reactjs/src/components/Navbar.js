import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';
const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark mynav">
      <a className="navbar-brand" href="/">Logo</a>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item active">
            <a className="nav-link" href="/">Home</a>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/questions">Questions</Link>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/tags">Tags</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/users">Users</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/ask">Ask a Question</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
