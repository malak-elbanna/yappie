import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BookDetails from './components/BookDetails';
import Home from './components/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books/:id" element={<BookDetails />} />
      </Routes>
    </Router>
  );
}

export default App; 