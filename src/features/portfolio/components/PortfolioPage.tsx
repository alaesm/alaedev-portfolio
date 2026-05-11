'use client';

import { NavBar }               from './NavBar';
import { HeroSection }          from './HeroSection';
import { AboutSection }         from './AboutSection';
import { TechStackSection }     from './TechStackSection';
import { ExperienceSection }    from './ExperienceSection';
import { ProjectsSection }      from './ProjectsSection';
import { AcademicTrackSection } from './AcademicTrackSection';
import { TestimonialsSection }  from './TestimonialsSection';
import { ContactSection }       from './ContactSection';
import { FooterSection }        from './FooterSection';

export function PortfolioPage() {
  return (
    <div className="bg-s0  text-f0">
      <NavBar />
      <main>
        <HeroSection />
        <AboutSection />
        <TechStackSection />
        <ExperienceSection />
        <ProjectsSection />
        <AcademicTrackSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <FooterSection />
    </div>
  );
}
