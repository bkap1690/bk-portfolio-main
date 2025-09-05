import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import CaseStudyDetail from "./pages/CaseStudyDetail";
import ComponentTest from "./pages/ComponentTest";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background dark:bg-background transition-colors">
        <header className="flex flex-col gap-2 items-center">
          <NavBar />
        </header>
        <main className="w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/case-studies/:id" element={<CaseStudyDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/test" element={<ComponentTest />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
