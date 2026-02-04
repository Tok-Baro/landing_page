import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./page/home";
import { Terms } from "./page/Terms";
import { Privacy } from "./page/Privacy";
import DemoApp from "./demo/App";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/demo/*" element={<DemoApp />} />
      </Routes>
    </Router>
  );
}

export default App;
