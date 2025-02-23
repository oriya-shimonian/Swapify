import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "./providers/ThemeProvider";
import HeroPage from "./pages/HeroPage";
// import Footer from "@/components/Footer";
// import Home from "@/pages/Home";
// import About from "@/pages/About";
// import Contact from "@/pages/Contact";
// import Explore from "@/pages/Explore";
// import Login from "@/pages/Login";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-all">
          <Navbar />
          <main className="pt-16" >
            <Routes>
               <Route path="/" element={<HeroPage />} />
              {/*<Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/login" element={<Login />} /> */}
            </Routes>
          </main>
          {/* <Footer /> */}
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
