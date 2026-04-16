// Animation Controller for Learnr Static Site
class AnimationController {
  constructor() {
    this.observers = new Map();
    this.animationQueue = [];
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.init();
  }

  init() {
    this.setupIntersectionObservers();
    this.setupScrollAnimations();
    this.setupHoverAnimations();
    this.initializeOnLoadAnimations();
  }

  setupIntersectionObservers() {
    // Main content observer
    const mainObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target, 'fadeInUp');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // Flash cards observer with different behavior
    const flashObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const element = entry.target;
        if (entry.isIntersecting) {
          element.style.transform = 'scale(1)';
          element.style.opacity = '1';
        } else {
          element.style.transform = 'scale(0.82)';
          element.style.opacity = '0.5';
        }
      });
    }, {
      threshold: 0.5,
      rootMargin: '0px -15% 0px -15%'
    });

    // Testimonials observer
    const testimonialsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.startAutoScroll(entry.target);
        }
      });
    }, {
      threshold: 0.3
    });

    this.observers.set('main', mainObserver);
    this.observers.set('flash', flashObserver);
    this.observers.set('testimonials', testimonialsObserver);
  }

  setupScrollAnimations() {
    // Observe elements that should animate on scroll
    const elementsToObserve = [
      '.fade-in-on-scroll',
      '.slide-in-left-on-scroll', 
      '.slide-in-right-on-scroll'
    ];

    elementsToObserve.forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        this.observers.get('main').observe(element);
      });
    });

    // Observe flash cards
    document.querySelectorAll('.flash-card').forEach(element => {
      this.observers.get('flash').observe(element);
    });

    // Observe testimonials section
    const testimonialsSection = document.getElementById('testimonials');
    if (testimonialsSection) {
      this.observers.get('testimonials').observe(testimonialsSection);
    }
  }

  setupHoverAnimations() {
    // Content cards hover effects
    document.querySelectorAll('.content-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        if (!this.isReducedMotion) {
          card.style.transform = 'translateY(-4px)';
          card.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.3)';
        }
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = 'none';
      });
    });

    // Subject icons hover effects
    document.querySelectorAll('.subject-icon').forEach(icon => {
      icon.addEventListener('mouseenter', () => {
        if (!this.isReducedMotion) {
          icon.style.transform = 'scale(1.05) translateY(-2px)';
        }
      });

      icon.addEventListener('mouseleave', () => {
        icon.style.transform = 'scale(1) translateY(0)';
      });
    });

    // Button hover effects
    document.querySelectorAll('.btn-primary, [class*="bg-[#B8964A]"]').forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        if (!this.isReducedMotion) {
          btn.style.transform = 'translateY(-1px)';
        }
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translateY(0)';
      });
    });
  }

  initializeOnLoadAnimations() {
    // Animate elements that should appear immediately
    const immediateElements = document.querySelectorAll('.animate-slide-in');
    immediateElements.forEach((element, index) => {
      setTimeout(() => {
        this.animateElement(element, 'slideInUp');
      }, index * 100);
    });

    // Animate delayed elements
    const delayedElements = [
      { selector: '.animate-slide-in-delay-1', delay: 150 },
      { selector: '.animate-slide-in-delay-2', delay: 250 },
      { selector: '.animate-slide-in-delay-3', delay: 350 },
      { selector: '.animate-slide-in-delay-4', delay: 400 }
    ];

    delayedElements.forEach(({ selector, delay }) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        setTimeout(() => {
          this.animateElement(element, 'slideInUp');
        }, delay);
      });
    });
  }

  animateElement(element, animationType) {
    if (this.isReducedMotion) {
      element.style.opacity = '1';
      element.style.transform = 'none';
      return;
    }

    switch (animationType) {
      case 'fadeInUp':
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        requestAnimationFrame(() => {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        });
        break;

      case 'slideInUp':
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        requestAnimationFrame(() => {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        });
        break;

      case 'slideInLeft':
        element.style.opacity = '0';
        element.style.transform = 'translateX(-30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        requestAnimationFrame(() => {
          element.style.opacity = '1';
          element.style.transform = 'translateX(0)';
        });
        break;

      case 'slideInRight':
        element.style.opacity = '0';
        element.style.transform = 'translateX(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        requestAnimationFrame(() => {
          element.style.opacity = '1';
          element.style.transform = 'translateX(0)';
        });
        break;

      case 'scaleIn':
        element.style.opacity = '0';
        element.style.transform = 'scale(0.9)';
        element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        requestAnimationFrame(() => {
          element.style.opacity = '1';
          element.style.transform = 'scale(1)';
        });
        break;

      case 'fadeIn':
        element.style.opacity = '0';
        element.style.transition = 'opacity 0.6s ease';
        
        requestAnimationFrame(() => {
          element.style.opacity = '1';
        });
        break;
    }
  }

  startAutoScroll(container) {
    const strip = container.querySelector('#testimonials-strip');
    if (!strip || this.isReducedMotion) return;

    // Reset animation
    strip.style.animation = 'none';
    
    // Force reflow
    strip.offsetHeight;
    
    // Start animation
    strip.style.animation = 'autoScroll 30s linear infinite';
  }

  // Smooth scroll to element
  scrollToElement(elementId, offset = 0) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - offset;

    if (this.isReducedMotion) {
      window.scrollTo(0, offsetPosition);
    } else {
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  // Animate modal appearance
  showModal(modalElement) {
    if (!modalElement) return;

    modalElement.style.display = 'flex';
    modalElement.style.opacity = '0';
    
    const content = modalElement.querySelector('.modal-content');
    if (content) {
      content.style.transform = 'scale(0.9) translateY(20px)';
      content.style.opacity = '0';
    }

    requestAnimationFrame(() => {
      modalElement.style.transition = 'opacity 0.3s ease';
      modalElement.style.opacity = '1';
      
      if (content) {
        content.style.transition = 'all 0.3s ease';
        content.style.transform = 'scale(1) translateY(0)';
        content.style.opacity = '1';
      }
    });
  }

  // Animate modal disappearance
  hideModal(modalElement, callback) {
    if (!modalElement) return;

    const content = modalElement.querySelector('.modal-content');
    
    if (content) {
      content.style.transform = 'scale(0.9) translateY(20px)';
      content.style.opacity = '0';
    }
    
    modalElement.style.opacity = '0';
    
    setTimeout(() => {
      modalElement.style.display = 'none';
      if (callback) callback();
    }, 300);
  }

  // Stagger animation for multiple elements
  staggerAnimation(elements, animationType, delay = 100) {
    elements.forEach((element, index) => {
      setTimeout(() => {
        this.animateElement(element, animationType);
      }, index * delay);
    });
  }

  // Parallax effect for elements
  initParallax() {
    if (this.isReducedMotion) return;

    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      
      parallaxElements.forEach(element => {
        const rate = scrolled * -0.5;
        element.style.transform = `translateY(${rate}px)`;
      });
    });
  }

  // Cleanup observers
  destroy() {
    this.observers.forEach(observer => {
      observer.disconnect();
    });
    this.observers.clear();
  }

  // Performance optimization: pause animations when tab is not visible
  handleVisibilityChange() {
    if (document.hidden) {
      // Pause animations
      document.querySelectorAll('[style*="animation"]').forEach(element => {
        element.style.animationPlayState = 'paused';
      });
    } else {
      // Resume animations
      document.querySelectorAll('[style*="animation"]').forEach(element => {
        element.style.animationPlayState = 'running';
      });
    }
  }
}

// Initialize animation controller when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.animationController = new AnimationController();
  
  // Handle visibility changes for performance
  document.addEventListener('visibilitychange', () => {
    window.animationController.handleVisibilityChange();
  });
});

// Utility functions for common animations
window.animationUtils = {
  // Bounce effect for buttons
  bounceButton(button) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
      button.style.transform = 'scale(1)';
    }, 150);
  },

  // Pulse effect for notifications
  pulseElement(element) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    element.classList.add('animate-pulse');
    setTimeout(() => {
      element.classList.remove('animate-pulse');
    }, 2000);
  },

  // Shake effect for errors
  shakeElement(element) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    element.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
      element.style.animation = '';
    }, 500);
  }
};

// Add shake keyframes to document
const shakeKeyframes = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = shakeKeyframes;
document.head.appendChild(styleSheet);