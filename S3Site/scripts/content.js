// Content Rendering and Interactive Features
class ContentRenderer {
  constructor() {
    this.templates = {};
    this.initTemplates();
  }

  initTemplates() {
    // Content card template
    this.templates.contentCard = (item, index = null) => `
      <div class="cursor-pointer group flex-shrink-0 snap-start w-[171px] md:w-[209px]"
           onclick="learnrApp.openDownloadPopup()">
        <div class="content-card">
          ${item.thumbnailUrl ? 
            `<img src="${item.thumbnailUrl}" alt="${item.name}" 
                 onerror="this.parentElement.innerHTML='${this.templates.fallbackImage()}'" />` :
            this.templates.fallbackImage()
          }
          ${index !== null ? 
            `<div class="absolute top-2 left-2 w-7 h-7 rounded-full bg-[#B8964A] flex items-center justify-center z-10">
               <span class="text-[10px] font-black text-[#0B0C10]">${index + 1}</span>
             </div>` : ''
          }
        </div>
      </div>
    `;

    // Testimonial card template
    this.templates.testimonialCard = (testimonial) => `
      <div class="testimonial-card">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-full bg-[#B8964A]/20 flex items-center justify-center text-[#B8964A] font-black text-xs flex-shrink-0">
            ${testimonial.initials}
          </div>
          <div>
            <div class="text-white font-bold text-sm">${this.escapeHtml(testimonial.name)}</div>
            <div class="text-gray-500 text-xs">${this.escapeHtml(testimonial.location)}</div>
          </div>
        </div>
        <div class="flex gap-0.5">
          ${this.renderStars(testimonial.stars)}
        </div>
        <p class="text-gray-400 text-sm leading-relaxed">${this.escapeHtml(testimonial.text)}</p>
      </div>
    `;

    // Subject icon template
    this.templates.subjectIcon = (item, iconData) => `
      <div class="subject-icon flex-shrink-0 snap-start cursor-pointer flex flex-col items-center justify-center w-[100px] h-[100px] bg-white rounded-[20px]"
           style="border-bottom: 5px solid ${iconData.color}; box-shadow: 0 8px 20px -4px ${iconData.color}55"
           onclick="learnrApp.openDownloadPopup()">
        <img src="${iconData.src}" alt="${item.name}" class="w-14 h-14 object-contain" 
             onerror="this.style.display='none'" />
        <span class="font-black text-[10px] uppercase tracking-wider mt-1.5" 
              style="color: ${iconData.color}">${this.escapeHtml(item.name)}</span>
      </div>
    `;

    // Fallback image template
    this.templates.fallbackImage = () => `
      <div class="absolute inset-0 w-full h-full flex items-center justify-center opacity-60">
        <img src="images/learnrlogo.jpeg" class="w-20 h-20 opacity-20 filter grayscale rounded-xl" 
             alt="Learnr Logo" />
      </div>
    `;

    // Loading template
    this.templates.loading = () => `
      <div class="text-center py-16">
        <div class="loading-spinner mx-auto mb-4"></div>
        <p class="text-gray-500 font-medium">Loading content...</p>
      </div>
    `;

    // Error template
    this.templates.error = (message = 'Failed to load content') => `
      <div class="text-center py-16">
        <div class="text-red-400 mb-4">⚠️</div>
        <p class="text-gray-500 font-medium">${this.escapeHtml(message)}</p>
        <button onclick="location.reload()" 
                class="mt-4 px-4 py-2 bg-[#B8964A] text-[#0B0C10] rounded-full text-sm font-bold hover:opacity-90 transition-opacity">
          Retry
        </button>
      </div>
    `;
  }

  // Utility functions
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  renderStars(count) {
    return Array.from({length: 5}, (_, i) => 
      `<span class="text-sm ${i < count ? 'text-yellow-400' : 'text-gray-600'}">★</span>`
    ).join('');
  }

  // Content validation
  validateContent(data) {
    if (!data) return false;
    
    const required = ['profile', 'sections', 'testimonials'];
    return required.every(key => data.hasOwnProperty(key));
  }

  validateSection(section) {
    return section && 
           section.sectionName && 
           section.sectionType && 
           Array.isArray(section.items);
  }

  validateItem(item) {
    return item && item.name;
  }

  // Content processing
  processContent(rawData) {
    if (!this.validateContent(rawData)) {
      throw new Error('Invalid content structure');
    }

    // Process sections
    const processedSections = rawData.sections
      .filter(section => this.validateSection(section))
      .map(section => ({
        ...section,
        items: section.items.filter(item => this.validateItem(item))
      }))
      .filter(section => section.items.length > 0);

    // Process testimonials
    const processedTestimonials = rawData.testimonials
      .filter(testimonial => testimonial.name && testimonial.text)
      .map(testimonial => ({
        ...testimonial,
        stars: Math.max(1, Math.min(5, testimonial.stars || 5))
      }));

    return {
      ...rawData,
      sections: processedSections,
      testimonials: processedTestimonials
    };
  }

  // Render methods
  renderSection(section) {
    switch (section.sectionType) {
      case 'LIST_TYPE':
      case 'SUBJECT_TYPE':
        return this.renderSubjectSection(section);
      case 'FLASH_TYPE':
        return this.renderFlashSection(section);
      default:
        if (section.sectionName?.toLowerCase() === 'trending') {
          return this.renderTrendingSection(section);
        }
        return this.renderChapterSection(section);
    }
  }

  renderSubjectSection(section) {
    const iconMap = {
      'science': { src: 'https://www.learnr.co.in/Science.png', color: '#4CAF50' },
      'english': { src: 'https://www.learnr.co.in/English.png', color: '#29B6F6' },
      'reasoning': { src: 'https://www.learnr.co.in/reasoning.png', color: '#EC407A' },
      'maths': { src: 'https://www.learnr.co.in/Maths.png', color: '#AB47BC' },
      'mathematics': { src: 'https://www.learnr.co.in/Maths.png', color: '#AB47BC' },
      'geography': { src: 'https://www.learnr.co.in/Geography.png', color: '#26A69A' }
    };

    const iconItems = section.items.filter(item => 
      iconMap[item.name?.toLowerCase()]
    );

    if (iconItems.length === 0) return '';

    return `
      <section class="fade-in-on-scroll">
        <div class="flex justify-between items-center mb-4 px-1">
          <h2 class="text-xl font-bold text-white tracking-tight">${this.escapeHtml(section.sectionName)}</h2>
        </div>
        <div class="flex gap-5 overflow-x-auto pb-6 scrollbar-hide flex-nowrap px-1 snap-x">
          ${iconItems.map(item => {
            const iconData = iconMap[item.name.toLowerCase()];
            return this.templates.subjectIcon(item, iconData);
          }).join('')}
        </div>
        <div class="flex justify-center items-center gap-1.5 mt-1 mb-2">
          <div class="w-4 h-1.5 rounded-full bg-[#4A4D54]"></div>
          <div class="w-1.5 h-1.5 rounded-full bg-[#D1D3D8]"></div>
          <div class="w-1.5 h-1.5 rounded-full bg-[#D1D3D8]"></div>
        </div>
      </section>
    `;
  }

  renderFlashSection(section) {
    return `
      <section class="fade-in-on-scroll">
        <div class="flex justify-between items-end mb-4 px-1">
          <h2 class="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            ⚡ ${this.escapeHtml(section.sectionName)}
          </h2>
          <span class="text-xs text-gray-500 font-medium">Swipe →</span>
        </div>
        <div class="flex gap-4 overflow-x-auto pb-6 scrollbar-hide flex-nowrap snap-x px-1">
          ${section.items.map(item => `
            <div class="flash-card cursor-pointer group flex-shrink-0 snap-start w-[171px] md:w-[200px]"
                 onclick="learnrApp.openDownloadPopup()">
              <div class="content-card">
                ${item.thumbnailUrl ? 
                  `<img src="${item.thumbnailUrl}" alt="${this.escapeHtml(item.name)}" 
                       onerror="this.parentElement.innerHTML='${this.templates.fallbackImage()}'" />` :
                  this.templates.fallbackImage()
                }
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }

  renderTrendingSection(section) {
    return `
      <section class="fade-in-on-scroll">
        <div class="flex justify-between items-end mb-4 px-1">
          <h2 class="text-xl font-bold text-white tracking-tight">${this.escapeHtml(section.sectionName)}</h2>
        </div>
        <div class="flex gap-4 overflow-x-auto pb-6 scrollbar-hide flex-nowrap snap-x">
          ${section.items.map((item, i) => this.templates.contentCard(item, i)).join('')}
        </div>
      </section>
    `;
  }

  renderChapterSection(section) {
    return `
      <section class="fade-in-on-scroll">
        <div class="flex justify-between items-end mb-4 px-1">
          <h2 class="text-xl font-bold text-white tracking-tight">${this.escapeHtml(section.sectionName)}</h2>
        </div>
        <div class="flex gap-4 overflow-x-auto pb-6 scrollbar-hide flex-nowrap snap-x">
          ${section.items.map(item => this.templates.contentCard(item)).join('')}
        </div>
      </section>
    `;
  }

  renderTestimonials(testimonials) {
    // Double the testimonials for seamless loop
    const doubledTestimonials = [...testimonials, ...testimonials];
    
    return doubledTestimonials.map(testimonial => 
      this.templates.testimonialCard(testimonial)
    ).join('');
  }
}

// Interactive Features Manager
class InteractiveFeatures {
  constructor() {
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.isScrolling = false;
    this.init();
  }

  init() {
    this.setupTouchHandlers();
    this.setupKeyboardHandlers();
    this.setupAccessibility();
    this.setupLazyLoading();
  }

  setupTouchHandlers() {
    // Touch handlers for mobile slideshow
    const slideshows = document.querySelectorAll('#mobile-slideshow, #desktop-slideshow');
    
    slideshows.forEach(slideshow => {
      slideshow.addEventListener('touchstart', (e) => {
        this.touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      slideshow.addEventListener('touchend', (e) => {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe(slideshow);
      }, { passive: true });
    });

    // Touch handlers for horizontal scrolling sections
    const scrollSections = document.querySelectorAll('.overflow-x-auto');
    
    scrollSections.forEach(section => {
      let isScrolling = false;
      
      section.addEventListener('touchstart', () => {
        isScrolling = true;
      }, { passive: true });

      section.addEventListener('touchend', () => {
        setTimeout(() => {
          isScrolling = false;
        }, 100);
      }, { passive: true });

      // Prevent vertical scroll when horizontally scrolling
      section.addEventListener('touchmove', (e) => {
        if (isScrolling) {
          e.preventDefault();
        }
      }, { passive: false });
    });
  }

  handleSwipe(slideshow) {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      const type = slideshow.id.includes('mobile') ? 'mobile' : 'desktop';
      
      if (diff > 0) {
        // Swipe left - next slide
        if (window.learnrApp) {
          window.learnrApp.advanceSlide(type);
        }
      } else {
        // Swipe right - previous slide
        if (window.learnrApp) {
          const slideshow = window.learnrApp.slideshow[type];
          slideshow.pos = Math.max(0, slideshow.pos - 1);
          window.learnrApp.updateSlideshow(type);
        }
      }
    }
  }

  setupKeyboardHandlers() {
    document.addEventListener('keydown', (e) => {
      // Handle keyboard navigation
      switch (e.key) {
        case 'ArrowLeft':
          if (e.target.closest('.slideshow-container')) {
            e.preventDefault();
            // Handle left arrow for slideshow
          }
          break;
        case 'ArrowRight':
          if (e.target.closest('.slideshow-container')) {
            e.preventDefault();
            // Handle right arrow for slideshow
          }
          break;
        case 'Enter':
        case ' ':
          if (e.target.classList.contains('content-card') || 
              e.target.closest('.content-card')) {
            e.preventDefault();
            if (window.learnrApp) {
              window.learnrApp.openDownloadPopup();
            }
          }
          break;
      }
    });
  }

  setupAccessibility() {
    // Add ARIA labels and roles
    const contentCards = document.querySelectorAll('.content-card');
    contentCards.forEach((card, index) => {
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `Learning content ${index + 1}. Click to download app.`);
    });

    // Add focus indicators
    const focusableElements = document.querySelectorAll('button, [role="button"], a, [tabindex="0"]');
    focusableElements.forEach(element => {
      element.addEventListener('focus', () => {
        element.style.outline = '2px solid #B8964A';
        element.style.outlineOffset = '2px';
      });

      element.addEventListener('blur', () => {
        element.style.outline = 'none';
      });
    });

    // Screen reader announcements
    const announceToScreenReader = (message) => {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = message;
      document.body.appendChild(announcement);
      
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    };

    // Announce when content loads
    window.addEventListener('load', () => {
      announceToScreenReader('Learnr learning platform loaded. Navigate with tab key to explore content.');
    });
  }

  setupLazyLoading() {
    // Intersection Observer for lazy loading images
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '50px'
    });

    // Observe all images with data-src
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // Utility methods
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}

// Performance Monitor
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.init();
  }

  init() {
    this.measureLoadTime();
    this.monitorScrollPerformance();
    this.trackUserInteractions();
  }

  measureLoadTime() {
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      this.metrics.loadTime = loadTime;
      console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
    });
  }

  monitorScrollPerformance() {
    let scrollCount = 0;
    const scrollHandler = this.throttle(() => {
      scrollCount++;
    }, 16); // 60fps

    window.addEventListener('scroll', scrollHandler);

    // Log scroll performance every 5 seconds
    setInterval(() => {
      if (scrollCount > 0) {
        console.log(`Scroll events: ${scrollCount} in last 5s`);
        scrollCount = 0;
      }
    }, 5000);
  }

  trackUserInteractions() {
    let interactionCount = 0;
    
    ['click', 'touchstart', 'keydown'].forEach(eventType => {
      document.addEventListener(eventType, () => {
        interactionCount++;
      }, { passive: true });
    });

    // Log interaction metrics
    setInterval(() => {
      if (interactionCount > 0) {
        this.metrics.interactions = interactionCount;
        interactionCount = 0;
      }
    }, 10000);
  }

  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.contentRenderer = new ContentRenderer();
  window.interactiveFeatures = new InteractiveFeatures();
  window.performanceMonitor = new PerformanceMonitor();
});

// Add CSS for screen reader only content
const srOnlyCSS = `
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`;

const styleElement = document.createElement('style');
styleElement.textContent = srOnlyCSS;
document.head.appendChild(styleElement);