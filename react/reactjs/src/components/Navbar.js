import "./Navbar.css";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../utils/constant";
import LogoutButton from "./LogoutButton";

const Navbar = () => {
  //extracting the path name
  const location = useLocation();
  const path = location.pathname;
  console.log(`current path : ${path}`);
  //hanle the logout button onclick event
  const logout = async () => {
    console.log("logout clicked...");
    try {
      const response = await axios.get(`${baseURL}/logout`, {
        withCredentials: true,
      });
      if (response.status === 204) {
        localStorage.removeItem("token");
        window.location.reload();
      }
    } catch (error) {
      console.log(
        "token now : " +
          localStorage.getItem("token") +
          " error while trying to log out : " +
          error
      );
    }
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-dark mynav fixed-top">
      <h4 className="navbar-brand">Logo</h4>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link
              className={path === "/home" ? "nav-link activated" : "nav-link"}
              to="/home">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className={path === "/questions" ? "nav-link activated" : "nav-link"}
              to="/questions">
              Questions
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/tags">
              Tags
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/users">
              Users
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/ask">
              Ask a Question
            </Link>
          </li>
        </ul>
        <input
          className="form-control search-input"
          type="search"
          placeholder="Search"
        />
        <LogoutButton logout={logout} />
      </div>
    </nav>
  );
};

export default Navbar;
