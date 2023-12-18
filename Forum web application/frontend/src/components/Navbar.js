import "./Navbar.css";
import axios from "axios";
import { baseURL } from "../utils/constant";
import LogoutButton from "./LogoutButton";
import EST_SAFI_logo from "../utils/img/EST SAFI LOGO.png";
import app_logo from "../utils/img/app_logo.png";
import { FaSearch } from "react-icons/fa";
const Navbar = () => {
  //hanle the logout button onclick event
  const logout = async () => {
    console.log("logout clicked...");
    try {
      const response = await axios.get(`${baseURL}/logout`, {
        withCredentials: true,
      });
      if (response.status === 204) {
        sessionStorage.clear();
        localStorage.clear();
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
      {!localStorage.getItem("token") && (
        <img className="logo" src={EST_SAFI_logo} alt="logo" width="65" />
      )}
      <img
        className="app-logo"
        src={app_logo}
        alt="logo"
        width={150}
        height={60}
      />
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
        {localStorage.getItem("token") ? (
          <>
            <FaSearch className="search-icon" />
            <input
              className="form-control search-input"
              type="search"
              placeholder="Search"
            />
            <LogoutButton logout={logout} />
          </>
        ) : (
          <></>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
