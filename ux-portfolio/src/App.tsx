import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import CaseStudyDetail from "./pages/CaseStudyDetail";
import ComponentTest from "./pages/ComponentTest";
import Prototypes from "./pages/Prototypes";
import AccountCreationFlow from "./pages/prototypes/wasatch/pages/AccountCreationFlow";
import AccountSuccessPage from "./pages/prototypes/wasatch/pages/AccountSuccessPage";

// Get base path from Vite config or environment
const basePath = import.meta.env.BASE_URL || '/';

function AppContent() {
  const location = useLocation();
  const isPrototypePage = location.pathname.startsWith("/prototypes") || location.pathname.startsWith(`${basePath}prototypes`);

  return (
    <div className="min-h-screen bg-background dark:bg-background transition-colors">
      {!isPrototypePage && (
        <header className="flex flex-col gap-2 items-center">
          <NavBar />
        </header>
      )}
      <main className="w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/case-studies/:id" element={<CaseStudyDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/test" element={<ComponentTest />} />
          <Route path="/prototypes" element={<Prototypes />} />
          <Route path="/prototypes/:prototypeId" element={<Prototypes />} />
          <Route path="/prototypes/wasatch-signup" element={<AccountCreationFlow />} />
          <Route path="/prototypes/wasatch-success" element={<AccountSuccessPage />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter basename={basePath}>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
