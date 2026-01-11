import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home";
import Login from './pages/Login';
import Register from './pages/Register';
import Setting from './pages/Settings';
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Navbar />
          <div className="pages">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Login" element={<Login />} />
              <Route path="/Register" element={<Register />} />
              <Route path="/Setting" element={<Setting />} />
            </Routes>
          </div>
        </Router>
      </header>
    </div>
  );
}

export default App;
