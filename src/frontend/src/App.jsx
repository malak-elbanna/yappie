import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <main className="pt-16"> {/* Added padding-top to account for fixed navbar */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/books/:id" element={<BookDetails />} />
            <Route path="/categories" element={<div className="text-white p-8">Categories Page (Coming Soon)</div>} />
            <Route path="/authors" element={<div className="text-white p-8">Authors Page (Coming Soon)</div>} />
            <Route path="/search" element={<div className="text-white p-8">Search Results (Coming Soon)</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
