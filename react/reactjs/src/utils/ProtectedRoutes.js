import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import AsideBar from "../components/AsideBar";
import "./ProtectedRoutes.css";

const ProtectedRoutes = () => {
  let authToken = Boolean(localStorage.getItem("token"));
  const name = localStorage.getItem("name") || "undefined name";
  return authToken ? (
    <>
      <Navbar />
      <div className="underNav">
        <AsideBar name={name} />
        <div className="Outlet-container">
          <Outlet />
        </div>
      </div>
    </>
  ) : (
    <Navigate to="/login" />
  );
};
export default ProtectedRoutes;
