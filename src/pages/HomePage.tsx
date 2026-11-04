import React, { useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import { Bento, Hero } from '../site/Hero';
import { Certifications, Projects, Services, Skills, Timeline } from '../site/sections';
import { BlogSection, Contact } from '../site/sections2';
import { DocumentsSection, EventsSection, GallerySection } from '../site/publications';

export const HomePage: React.FC = () => {
  const { site, status } = useContent();
  const s = site.settings.sections;

  // Arrivée depuis une autre page avec une ancre (/#contact) : défiler une fois le contenu prêt.
  useEffect(() => {
    if (status === 'loading' || !window.location.hash) return;
    document.getElementById(window.location.hash.slice(1))?.scrollIntoView();
  }, [status]);

  return (
    <>
      <Hero />
      {s.about && <Bento />}
      {s.projects && <Projects />}
      {s.skills && <Skills />}
      {s.services && <Services />}
      {s.timeline && <Timeline />}
      {s.certifications && <Certifications />}
      {s.news && <BlogSection kind="news" />}
      {s.events && <EventsSection />}
      {s.blog && <BlogSection kind="article" />}
      {s.gallery && <GallerySection />}
      {s.documents && <DocumentsSection />}
      {s.contact && <Contact />}
    </>
  );
};
