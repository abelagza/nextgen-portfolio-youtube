import { SkillsSection, TestimonialsSection } from "./Sections";
import { AboutSection } from "./Sections/AboutSection";
import { AchievementsSection } from "./Sections/AchievementsSection";
import { BlogSection } from "./Sections/BlogSection";
import { CertificationsSection } from "./Sections/CertificationsSection";
import { ContactSection } from "./Sections/ContactSection";
import { EducationSection } from "./Sections/EducationSection";
import { ExperienceSection } from "./Sections/ExperienceSection";
import HeroSection from "./Sections/HeroSection";
import { ProjectsSection } from "./Sections/ProjectsSection";
import { ServicesSection } from "./Sections/ServicesSection";

function PortfolioContent() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ExperienceSection />
      <EducationSection />
      <ProjectsSection />
      <CertificationsSection />
      <TestimonialsSection />
      <ServicesSection />
      <AchievementsSection />
      <BlogSection />
      <ContactSection />
    </>
  );
}

export default PortfolioContent;
