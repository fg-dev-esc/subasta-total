import { useEffect } from 'react';

const useScrollTrigger = () => {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    // Observar todos los elementos con scroll-trigger
    const scrollElements = document.querySelectorAll(
      '.scroll-trigger, .scroll-trigger-left, .scroll-trigger-right, .scroll-trigger-scale'
    );
    
    scrollElements.forEach((el) => {
      observer.observe(el);
    });

    // Cleanup
    return () => {
      scrollElements.forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, []);
};

export default useScrollTrigger;