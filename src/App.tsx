import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AudioProvider } from './context/AudioContext';

import { CosmicBackground } from './components/CosmicBackground';
import { CustomCursor } from './components/CustomCursor';
import { Preloader } from './components/Preloader';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Services } from './components/Services';
import { Projects } from './components/Projects';
import { Timeline } from './components/Timeline';
import { Certifications } from './components/Certifications';
import { StatsCounter } from './components/StatsCounter';
import { Blog } from './components/Blog';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { CvModal } from './components/CvModal';
import { AiAssistantModal } from './components/AiAssistantModal';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [cvModalOpen, setCvModalOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [cursorEnabled, setCursorEnabled] = useState(true);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AudioProvider>
          {loading ? (
            <Preloader onComplete={() => setLoading(false)} />
          ) : (
            <div className="min-h-screen bg-[#0B1120] text-slate-100 font-sans antialiased selection:bg-blue-500 selection:text-white relative">
              {/* Custom Cursor */}
              <CustomCursor enabled={cursorEnabled} />

              {/* Interactive Cosmic Particle Canvas */}
              <CosmicBackground />

              {/* Sticky Header Navbar */}
              <Navbar
                onOpenCvModal={() => setCvModalOpen(true)}
                cursorEnabled={cursorEnabled}
                toggleCursor={() => setCursorEnabled((prev) => !prev)}
              />

              {/* Main Content Sections */}
              <main className="relative z-10">
                <Hero onOpenCvModal={() => setCvModalOpen(true)} />
                <About />
                <Skills />
                <Services />
                <Projects />
                <Timeline />
                <Certifications />
                <StatsCounter />
                <Blog />
                <Contact onOpenAiAssistant={() => setAiModalOpen(true)} />
              </main>

              {/* Footer */}
              <Footer />

              {/* Modals */}
              <CvModal
                isOpen={cvModalOpen}
                onClose={() => setCvModalOpen(false)}
              />

              <AiAssistantModal
                isOpen={aiModalOpen}
                onClose={() => setAiModalOpen(false)}
              />
            </div>
          )}
        </AudioProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
