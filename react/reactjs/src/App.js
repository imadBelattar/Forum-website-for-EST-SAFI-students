import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Questions from "./components/Questions";
import AsideBar from "./components/AsideBar";
import Login from "./components/Login";
import "./App.css";
function App() {
  const  [token, setToken] = useState()

  if(!token){
    return <Login setToken={setToken} />
  }
  return (
    <div className="wrapper">
      <Router>
        <Navbar />
        <AsideBar />
        <Routes>
          <Route path="/questions" element={<Questions />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
