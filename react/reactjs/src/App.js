import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Questions from "./components/Questions";
import AsideBar from "./components/AsideBar";
import Login from "./components/Login";
import Home from "./components/Home";
import Unfound from "./components/Unfound";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import "./App.css";

function App() {
  return (
    <div className="wrapper">
      {/*   <Navbar />
        <AsideBar />  */}
      <Routes>
        <Route element={<ProtectedRoutes />}>
          <Route exact path="/questions" element={<Questions />} />
          <Route exact path="/home" element={<Home />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Unfound />} />
      </Routes>
    </div>
  );
}

export default App;
