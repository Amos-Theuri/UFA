import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Features from "./Pages/Features";
import Contact from "./Pages/Contact";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Merchendise from "./Pages/Merchendise";
import AdminEventsManager from "./Pages/AdminEventsManager";
import JoinModal from "./components/JoinModal";
import { JoinModalProvider } from "./context/JoinModalContext";
import "./App.css";

// Smooth scroll to top or hash target on route/hash changes
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const elementId = hash.replace("#", "");
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  }, [pathname, hash]);

  return null;
}

function App() {
  return (
    <JoinModalProvider>
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/About" element={<About />} />
          <Route path="/Features" element={<Features />} />
          <Route path="/programs" element={<Features />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/Merchendise" element={<Merchendise />} />
          {/* Secure administrative routes - unlinked in navigation, protected by passcode */}
          <Route path="/admin/events" element={<AdminEventsManager />} />
          <Route path="/portal/events-manager" element={<AdminEventsManager />} />
        </Routes>
      </main>
      <Footer />
      <JoinModal />
    </JoinModalProvider>
  );
}

export default App;
