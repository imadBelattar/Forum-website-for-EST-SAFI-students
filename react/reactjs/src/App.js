import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Questions from "./components/Questions";
import Login from "./components/Login";
import Unfound from "./components/Unfound";
import AddQuestion from "./components/AddQuestion";
import ShowQuestion from "./components/ShowQuestion";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import "./App.css";
import UserQuestions from "./components/user/UserQuestions";

function App() {
  return (
    <div className="wrapper">
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route element={<ProtectedRoutes />}>
          <Route exact path="/questions" element={<Questions />} />
          <Route exact path="/userQuestions" element={<UserQuestions />} />
          <Route exact path="/addQuestion" element={<AddQuestion />} />
          <Route exact path="/user/addQuestion" element={<AddQuestion />} />
          <Route path="/showQuestion/:id" element={<ShowQuestion />} />
          <Route path="user/showQuestion/:id" element={<ShowQuestion />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Unfound />} />
      </Routes>
    </div>
  );
}

export default App;
