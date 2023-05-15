import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Navbar from './components/Navbar';
import Questions from './components/Questions';
import AsideBar from './components/AsideBar';
import Login from './components/Login';

function App() {
  return (
    <Router>
      <Navbar />
      <AsideBar />
      <Routes>
        <Route path="/questions" element={<Questions />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
