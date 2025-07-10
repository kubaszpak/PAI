import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CreateEventPage from "./pages/CreateEventPage";
import VotePage from "./pages/VotePage";
import React from "react";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CreateEventPage />} />
        <Route path="/event/:id" element={<VotePage />} />
      </Routes>
    </Router>
  );
}