// Learnr Static Site - Main JavaScript
class LearnrApp {
  constructor() {
    this.contentData = null;
    this.isScrolled = false;
    this.popupOpen = false;
    this.slideshow = {
      desktop: { pos: 5, skipAnim: false, interval: null },
      mobile: { pos: 5, skipAnim: false, interval: null }
    };
    this.init();
  }

  async init() {
    // Force dark mode
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');

    try {
      await this.loadContent();
      this.setupEventListeners();
      this.renderContent();
      this.initAnimations();
      this.initSlideshows();
    } catch (error) {
      console.error('Failed to initialize app:', error);
      this.showError();
    }
  }

  async loadContent() {
    try {
      const response = await fetch('data/content.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.contentData = await response.json();
      console.log('Content loaded successfully:', this.contentData);
    } catch (error) {
      console.error('Failed to load content:', error);
      // Fallback to minimal content
      this.contentData = this.getFallbackContent();
    }
  }

  getFallbackContent() {
    return {
      profile: {
        appName: "Learnr",
        tagline: "Roz ek kadam, sapnon ki aur.",
        description: "Daily learning in 12+ Indian languages.",
        stats: { totalLearners: "10L+", languages: "12+", hoursContent: "50K+" }
      },
      sections: [],
      testimonials: [],
      slideshow: { images: [] }
    };
  }

  setupEventListeners() {
    // Scroll handler for sticky header
    window.addEventListener('scroll', this.handleScroll.bind(this));

    // Download button handlers
    const downloadButtons = [
      'header-download-btn',
      'desktop-download-btn', 
      'desktop-badge-btn',
      'final-cta-desktop-btn'
    ];

    downloadButtons.forEach(id => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener('click', this.openDownloadPopup.bind(this));
      }
    });

    // Popup handlers
    const closePopupBtn = document.getElementById('close-popup');
    if (closePopupBtn) {
      closePopupBtn.addEventListener('click', this.closeDownloadPopup.bind(this));
    }

    const popup = document.getElementById('download-popup');
    if (popup) {
      popup.addEventListener('click', (e) => {
        if (e.target === popup) {
          this.closeDownloadPopup();
        }
      });
    }

    // Keyboard handlers
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.popupOpen) {
        this.closeDownloadPopup();
      }
    });

    // Resize handler for slideshows
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  handleScroll() {
    const scrolled = window.scrollY > 20;
    if (scrolled !== this.isScrolled) {
      this.isScrolled = scrolled;
      const header = document.getElementById('main-header');
      if (header) {
        if (scrolled) {
          header.className = header.className.replace('header-transparent', 'header-sticky');
        } else {
          header.className = header.className.replace('header-sticky', 'header-transparent');
        }
      }
    }
  }

  handleResize() {
    // Reinitialize slideshows on resize
    clearInterval(this.slideshow.desktop.interval);
    clearInterval(this.slideshow.mobile.interval);
    setTimeout(() => {
      this.initSlideshows();
    }, 100);
  }

  openDownloadPopup() {
    this.popupOpen = true;
    const popup = document.getElementById('download-popup');
    if (popup) {
      popup.classList.remove('hidden');
      const content = popup.querySelector('.modal-content');
      if (content) {
        setTimeout(() => content.classList.add('show'), 10);
      }
    }
  }

  closeDownloadPopup() {
    this.popupOpen = false;
    const popup = document.getElementById('download-popup');
    if (popup) {
      const content = popup.querySelector('.modal-content');
      if (content) {
        content.classList.remove('show');
        setTimeout(() => popup.classList.add('hidden'), 300);
      }
    }
  }

  renderContent() {
    if (!this.contentData) return;

    this.renderTestimonials();
    this.renderContentSections();
    this.renderSlideshow();
  }

  renderTestimonials() {
    const testimonialsStrip = document.getElementById('testimonials-strip');
    if (!testimonialsStrip || !this.contentData.testimonials) return;

    // Create double array for seamless loop
    const testimonials = [...this.contentData.testimonials, ...this.contentData.testimonials];
    
    testimonialsStrip.innerHTML = testimonials.map(testimonial => `
      <div class="testimonial-card">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-full bg-[#B8964A]/20 flex items-center justify-center text-[#B8964A] font-black text-xs flex-shrink-0">
            ${testimonial.initials}
          </div>
          <div>
            <div class="text-white font-bold text-sm">${testimonial.name}</div>
            <div class="text-gray-500 text-xs">${testimonial.location}</div>
          </div>
        </div>
        <div class="flex gap-0.5">
          ${Array.from({length: 5}, (_, i) => 
            `<span class="text-sm ${i < testimonial.stars ? 'text-yellow-400' : 'text-gray-600'}">★</span>`
          ).join('')}
        </div>
        <p class="text-gray-400 text-sm leading-relaxed">${testimonial.text}</p>
      </div>
    `).join('');
  }

  renderContentSections() {
    const contentSections = document.getElementById('content-sections');
    if (!contentSections || !this.contentData.sections) return;

    console.log('Rendering content sections:', this.contentData.sections.length);

    contentSections.innerHTML = this.contentData.sections.map(section => {
      console.log('Rendering section:', section.sectionName, 'with', section.items.length, 'items');
      if (section.sectionType === 'LIST_TYPE' || section.sectionType === 'SUBJECT_TYPE') {
        return this.renderSubjectSection(section);
      } else if (section.sectionType === 'FLASH_TYPE') {
        return this.renderFlashSection(section);
      } else if (section.sectionName?.toLowerCase() === 'trending') {
        return this.renderTrendingSection(section);
      } else {
        return this.renderChapterSection(section);
      }
    }).join('');
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

    const iconItems = section.items.filter(item => iconMap[item.name?.toLowerCase()]);

    return `
      <section class="fade-in-on-scroll">
        <div class="flex justify-between items-center mb-4 px-1">
          <h2 class="text-xl font-bold text-white tracking-tight">${section.sectionName}</h2>
        </div>
        <div class="flex gap-5 overflow-x-auto pb-6 scrollbar-hide flex-nowrap px-1 snap-x">
          ${iconItems.map(item => {
            const icon = iconMap[item.name.toLowerCase()];
            return `
              <div class="subject-icon flex-shrink-0 snap-start cursor-pointer flex flex-col items-center justify-center w-[100px] h-[100px] bg-white rounded-[20px]"
                   style="border-bottom: 5px solid ${icon.color}; box-shadow: 0 8px 20px -4px ${icon.color}55"
                   onclick="learnrApp.openDownloadPopup()">
                <img src="${icon.src}" alt="${item.name}" class="w-14 h-14 object-contain" />
                <span class="font-black text-[10px] uppercase tracking-wider mt-1.5" style="color: ${icon.color}">${item.name}</span>
              </div>
            `;
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
            ⚡ ${section.sectionName}
          </h2>
          <span class="text-xs text-gray-500 font-medium">Swipe →</span>
        </div>
        <div class="flex gap-4 overflow-x-auto pb-6 scrollbar-hide flex-nowrap snap-x px-1">
          ${section.items.map(item => `
            <div class="flash-card cursor-pointer group flex-shrink-0 snap-start w-[171px] md:w-[200px]"
                 onclick="learnrApp.openDownloadPopup()">
              <div class="content-card">
                ${item.thumbnailUrl ? 
                  `<img src="${item.thumbnailUrl}" alt="${item.name}" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />` :
                  `<div class="absolute inset-0 w-full h-full flex items-center justify-center">
                     <img src="images/learnrlogo.jpeg" class="w-16 h-16 opacity-20 filter grayscale rounded-xl" />
                   </div>`
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
          <h2 class="text-xl font-bold text-white tracking-tight">${section.sectionName}</h2>
        </div>
        <div class="flex gap-4 overflow-x-auto pb-6 scrollbar-hide flex-nowrap snap-x">
          ${section.items.map((item, i) => `
            <div class="cursor-pointer group flex-shrink-0 snap-start w-[171px] md:w-[209px]"
                 onclick="learnrApp.openDownloadPopup()">
              <div class="content-card">
                ${item.thumbnailUrl ? 
                  `<img src="${item.thumbnailUrl}" alt="${item.name}" />` :
                  `<div class="absolute inset-0 w-full h-full flex items-center justify-center opacity-60">
                     <img src="images/learnrlogo.jpeg" class="w-20 h-20 opacity-20 filter grayscale rounded-xl" />
                   </div>`
                }
                <div class="absolute top-2 left-2 w-7 h-7 rounded-full bg-[#B8964A] flex items-center justify-center z-10">
                  <span class="text-[10px] font-black text-[#0B0C10]">${i + 1}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }

  renderChapterSection(section) {
    return `
      <section class="fade-in-on-scroll">
        <div class="flex justify-between items-end mb-4 px-1">
          <h2 class="text-xl font-bold text-white tracking-tight">${section.sectionName}</h2>
        </div>
        <div class="flex gap-4 overflow-x-auto pb-6 scrollbar-hide flex-nowrap snap-x">
          ${section.items.map(item => `
            <div class="cursor-pointer group flex-shrink-0 snap-start w-[171px] md:w-[209px]"
                 onclick="learnrApp.openDownloadPopup()">
              <div class="content-card">
                ${item.thumbnailUrl ? 
                  `<img src="${item.thumbnailUrl}" alt="${item.name}" />` :
                  `<div class="absolute inset-0 w-full h-full flex items-center justify-center opacity-60">
                     <img src="images/learnrlogo.jpeg" class="w-20 h-20 opacity-20 filter grayscale rounded-xl" />
                   </div>`
                }
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }

  renderSlideshow() {
    if (!this.contentData.slideshow?.images) return;

    const images = this.contentData.slideshow.images;
    const strip = [...images, ...images, ...images]; // Triple for seamless loop

    // Mobile slideshow
    const mobileSlideshow = document.getElementById('mobile-slideshow');
    if (mobileSlideshow) {
      mobileSlideshow.innerHTML = `
        <div class="slideshow-track" id="mobile-track" style="gap: 8px;">
          ${strip.map((src, i) => `
            <div class="slideshow-item flex-shrink-0 h-full rounded-2xl" 
                 style="width: 75%; transform: scale(${i === 5 ? '1' : '0.96'});"
                 onclick="learnrApp.handleSlideClick('mobile', ${i})">
              <button class="w-full h-full rounded-2xl overflow-hidden focus:outline-none block relative">
                <img src="${src}" alt="" class="w-full h-full object-contain" draggable="false" />
                ${i !== 5 ? '<div class="absolute inset-0 bg-black/25 rounded-2xl pointer-events-none"></div>' : ''}
              </button>
            </div>
          `).join('')}
        </div>
        <div class="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-[#0B0C10] to-transparent z-10 pointer-events-none"></div>
        <div class="absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-[#0B0C10] to-transparent z-10 pointer-events-none"></div>
      `;
    }

    // Desktop slideshow
    const desktopSlideshow = document.getElementById('desktop-slideshow');
    if (desktopSlideshow) {
      desktopSlideshow.innerHTML = `
        <div class="slideshow-track" id="desktop-track" style="gap: 4%;">
          ${strip.map((src, i) => `
            <div class="slideshow-item flex-shrink-0 h-full rounded-3xl" 
                 style="width: 40%; transform: scale(${i === 5 ? '1' : '0.93'});"
                 onclick="learnrApp.handleSlideClick('desktop', ${i})">
              <button class="w-full h-full rounded-3xl overflow-hidden focus:outline-none cursor-pointer block">
                <img src="${src}" alt="" class="w-full h-full object-contain" draggable="false" />
              </button>
            </div>
          `).join('')}
        </div>
        <div class="absolute inset-y-0 left-0 w-[10%] bg-gradient-to-r from-[#0B0C10] to-transparent z-10 pointer-events-none"></div>
        <div class="absolute inset-y-0 right-0 w-[10%] bg-gradient-to-l from-[#0B0C10] to-transparent z-10 pointer-events-none"></div>
      `;
    }
  }

  initSlideshows() {
    this.startSlideshow('mobile');
    this.startSlideshow('desktop');
  }

  startSlideshow(type) {
    const slideshow = this.slideshow[type];
    if (slideshow.interval) clearInterval(slideshow.interval);
    
    slideshow.interval = setInterval(() => {
      this.advanceSlide(type);
    }, 2000);
  }

  advanceSlide(type) {
    const slideshow = this.slideshow[type];
    slideshow.skipAnim = false;
    slideshow.pos += 1;
    this.updateSlideshow(type);
  }

  handleSlideClick(type, index) {
    const slideshow = this.slideshow[type];
    slideshow.skipAnim = false;
    slideshow.pos = index;
    this.updateSlideshow(type);
    this.startSlideshow(type); // Reset interval
  }

  updateSlideshow(type) {
    const slideshow = this.slideshow[type];
    const track = document.getElementById(`${type}-track`);
    if (!track) return;

    const container = track.parentElement;
    const containerW = container.offsetWidth;
    const N = 5; // Number of original images
    
    // Calculate positions
    let cardW, gap, xOffset;
    if (type === 'mobile') {
      gap = 8;
      cardW = containerW * 0.75;
      xOffset = containerW / 2 - cardW / 2 - slideshow.pos * (cardW + gap);
    } else {
      gap = containerW * 0.04;
      cardW = containerW * 0.40;
      xOffset = containerW / 2 - cardW / 2 - slideshow.pos * (cardW + gap);
    }

    // Apply transform
    if (slideshow.skipAnim) {
      track.classList.add('no-transition');
    } else {
      track.classList.remove('no-transition');
    }
    
    track.style.transform = `translateX(${xOffset}px)`;

    // Update active states
    const items = track.querySelectorAll('.slideshow-item');
    items.forEach((item, i) => {
      const isActive = i === slideshow.pos;
      const scale = type === 'mobile' ? (isActive ? '1' : '0.96') : (isActive ? '1' : '0.93');
      item.style.transform = `scale(${scale})`;
      
      const overlay = item.querySelector('.absolute');
      if (overlay) {
        overlay.style.display = isActive ? 'none' : 'block';
      }
    });

    // Handle infinite loop
    setTimeout(() => {
      if (slideshow.pos < N) {
        slideshow.skipAnim = true;
        slideshow.pos += N;
        this.updateSlideshow(type);
      } else if (slideshow.pos >= N * 2) {
        slideshow.skipAnim = true;
        slideshow.pos -= N;
        this.updateSlideshow(type);
      }
    }, slideshow.skipAnim ? 0 : 450);
  }

  initAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    // Observe all fade-in elements
    document.querySelectorAll('.fade-in-on-scroll').forEach(el => {
      observer.observe(el);
    });

    // Flash card observer with different margins
    const flashObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const flashCard = entry.target;
        if (entry.isIntersecting) {
          flashCard.classList.add('in-view');
          flashCard.classList.remove('out-of-view');
        } else {
          flashCard.classList.add('out-of-view');
          flashCard.classList.remove('in-view');
        }
      });
    }, {
      threshold: 0.5,
      rootMargin: '0px -15% 0px -15%'
    });

    document.querySelectorAll('.flash-card').forEach(el => {
      flashObserver.observe(el);
    });
  }

  showError() {
    const contentSections = document.getElementById('content-sections');
    if (contentSections) {
      contentSections.innerHTML = `
        <div class="text-center py-16">
          <p class="text-gray-500 font-medium">Loading sections...</p>
        </div>
      `;
    }
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.learnrApp = new LearnrApp();
});

// Handle loading state
window.addEventListener('load', () => {
  // Hide any loading indicators
  const loadingElements = document.querySelectorAll('.loading-spinner');
  loadingElements.forEach(el => el.style.display = 'none');
});