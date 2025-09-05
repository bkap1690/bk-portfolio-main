import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScrollspyNavProps {
  sections: Array<{
    id: string;
    label: string;
  }>;
  heroHeight?: number; // Height after which nav should appear
}

export default function ScrollspyNav({ sections, heroHeight = 600 }: ScrollspyNavProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [activeSectionIndex, setActiveSectionIndex] = useState<number>(-1);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [backgroundStyle, setBackgroundStyle] = useState({ left: 0, width: 0, opacity: 0 });

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      
      // Show nav after scrolling past hero section
      setIsVisible(scrollY > heroHeight);

      // Determine active section
      const sectionElements = sections.map(section => ({
        id: section.id,
        element: document.getElementById(section.id)
      }));

      let currentSection = '';
      let currentSectionIndex = -1;
      const scrollPosition = scrollY + 100; // Offset for better UX

      for (let i = 0; i < sectionElements.length; i++) {
        const section = sectionElements[i];
        if (section.element) {
          const sectionTop = section.element.offsetTop;
          const sectionBottom = sectionTop + section.element.offsetHeight;
          
          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            currentSection = section.id;
            currentSectionIndex = i;
            break;
          }
        }
      }

      setActiveSection(currentSection);
      setActiveSectionIndex(currentSectionIndex);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections, heroHeight]);

  // Update background position when active section changes
  useEffect(() => {
    const updateBackgroundPosition = () => {
      if (activeSectionIndex >= 0 && buttonRefs.current[activeSectionIndex]) {
        const activeButton = buttonRefs.current[activeSectionIndex];
        const containerRect = activeButton.parentElement?.getBoundingClientRect();
        const buttonRect = activeButton.getBoundingClientRect();
        
        if (containerRect) {
          setBackgroundStyle({
            left: buttonRect.left - containerRect.left,
            width: buttonRect.width,
            opacity: 1
          });
        }
      } else {
        setBackgroundStyle(prev => ({ ...prev, opacity: 0 }));
      }
    };

    // Small delay to ensure DOM has updated
    const timeoutId = setTimeout(updateBackgroundPosition, 10);
    
    // Also update on window resize
    window.addEventListener('resize', updateBackgroundPosition);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateBackgroundPosition);
    };
  }, [activeSectionIndex, isVisible]);

  // Auto-scroll active button into view on mobile
  useEffect(() => {
    if (activeSectionIndex >= 0 && buttonRefs.current[activeSectionIndex] && scrollContainerRef.current) {
      const activeButton = buttonRefs.current[activeSectionIndex];
      const container = scrollContainerRef.current;
      
      // Check if we're on mobile (screen width < 768px)
      const isMobile = window.innerWidth < 768;
      
      if (isMobile) {
        const buttonRect = activeButton.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        // Calculate if button is outside visible area
        const isButtonVisible = 
          buttonRect.left >= containerRect.left && 
          buttonRect.right <= containerRect.right;
        
        if (!isButtonVisible) {
          // Scroll the active button into view with some padding
          const scrollLeft = activeButton.offsetLeft - (container.clientWidth / 2) + (activeButton.clientWidth / 2);
          
          container.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
          });
        }
      }
    }
  }, [activeSectionIndex]);

  const scrollToSection = (sectionId: string, index: number) => {
    setActiveSection(sectionId);
    setActiveSectionIndex(index);
    
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 100; // Account for fixed header
      const elementPosition = element.offsetTop - headerOffset;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ 
            type: 'spring',
            stiffness: 300,
            damping: 30,
            duration: 0.3
          }}
          className="fixed bottom-0 inset-x-0 md:bottom-6 md:left-1/2 md:transform md:-translate-x-1/2 md:inset-x-auto z-40 bg-white/10 dark:bg-black/20 backdrop-blur-xl backdrop-saturate-150 backdrop-brightness-110 rounded-none md:rounded-full shadow-md md:shadow-lg border-0 md:border md:border-white/10 md:dark:border-white/5"
        >
          <div 
            ref={scrollContainerRef}
            className="relative flex items-center gap-1 px-4 md:px-4 py-3 justify-start md:justify-start overflow-x-auto md:overflow-x-visible"
            style={{
              scrollbarWidth: 'none', /* Firefox */
              msOverflowStyle: 'none', /* IE and Edge */
            }}
          >
            {/* Single sliding background */}
            <motion.div
              className="absolute bg-primary rounded-full shadow-md"
              initial={false}
              animate={{
                left: backgroundStyle.left,
                width: backgroundStyle.width,
                opacity: backgroundStyle.opacity
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
                duration: 0.4
              }}
              style={{
                height: '40px',
                zIndex: 0
              }}
            />
            
            {sections.map((section, index) => (
              <button
                key={section.id}
                ref={(el) => buttonRefs.current[index] = el}
                onClick={() => scrollToSection(section.id, index)}
                className="relative px-4 py-2 text-sm font-medium rounded-full transition-colors duration-300 ease-out cursor-pointer z-10 whitespace-nowrap flex-shrink-0"
                aria-label={`Go to ${section.label} section`}
              >
                <span className={`relative z-10 transition-colors duration-300 ${
                  activeSection === section.id 
                    ? 'text-white' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary'
                }`}>
                  {section.label}
                </span>
              </button>
            ))}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
