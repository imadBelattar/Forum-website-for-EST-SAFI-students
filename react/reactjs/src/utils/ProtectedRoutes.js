import React from "react";
import { Outlet, Navigate, Route } from "react-router-dom";
import Navbar from "../components/Navbar";

const ProtectedRoutes = () => {
  let authToken = Boolean(localStorage.getItem("token"));
  return authToken ? (
    <>
      <Navbar />
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" />
  );
};
export default ProtectedRoutes;
