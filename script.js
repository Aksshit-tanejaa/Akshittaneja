document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Mobile Menu Toggle
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      // Animate hamburger lines
      const spans = menuToggle.querySelectorAll('span');
      if (menuToggle.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    // Close menu when clicking nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        const spans = menuToggle.querySelectorAll('span');
        spans.forEach(span => span.style.transform = 'none');
        spans[1].style.opacity = '1';
      });
    });
  }

  // 1. Mouse-Following Radial Glow
  const mouseGlow = document.getElementById('mouse-glow');
  window.addEventListener('mousemove', (e) => {
    document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
  });

  // 2. Rotating Keywords Typing Animation
  const rotatingKeywords = [
    "Growth Marketing",
    "Performance Marketing",
    "Automation Systems",
    "Business Development",
    "No-Code Building",
    "Content Strategy"
  ];
  const keywordRotator = document.getElementById('keyword-rotator');
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeKeyword() {
    const currentWord = rotatingKeywords[wordIndex];
    
    if (isDeleting) {
      keywordRotator.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      keywordRotator.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      // Pause at full word
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % rotatingKeywords.length;
      typingSpeed = 200;
    }

    setTimeout(typeKeyword, typingSpeed);
  }

  if (keywordRotator) {
    typeKeyword();
  }

  // 3. Twinkling Sparkle Particle Canvas Background (Global)
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 120 };

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    }

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2 + 0.5;
        this.twinkleSpeed = Math.random() * 0.015 + 0.005;
        this.phase = Math.random() * Math.PI * 2;
        this.baseAlpha = Math.random() * 0.4 + 0.2;
        this.alpha = this.baseAlpha;
        this.vx = (Math.random() - 0.5) * 0.08;
        this.vy = (Math.random() - 0.5) * 0.08;
        // ~12% of particles are twinkling sparkle flares
        this.flare = Math.random() < 0.12;
        
        const rVal = Math.random();
        if (rVal < 0.4) {
          this.color = '255, 107, 0'; // Purple
        } else if (rVal < 0.8) {
          this.color = '6, 182, 212';   // Cyan
        } else {
          this.color = '255, 255, 255'; // White
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
        ctx.fill();

        // Draw sparkle lens flare if flare is active and star is sufficiently bright
        if (this.flare && this.alpha > 0.3) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 255, 255, ${(this.alpha - 0.3) * 0.4})`;
          ctx.lineWidth = 0.5;
          // Horizontal line
          ctx.moveTo(this.x - this.size * 5, this.y);
          ctx.lineTo(this.x + this.size * 5, this.y);
          // Vertical line
          ctx.moveTo(this.x, this.y - this.size * 5);
          ctx.lineTo(this.x, this.y + this.size * 5);
          ctx.stroke();
        }
      }

      update() {
        // Slow space drift
        this.x += this.vx;
        this.y += this.vy;

        // Twinkle breathing logic
        this.phase += this.twinkleSpeed;
        this.alpha = this.baseAlpha + Math.sin(this.phase) * 0.15;
        this.alpha = Math.min(Math.max(this.alpha, 0.05), 0.8);

        // Screen boundary wrap around
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;

        // Mouse gentle repulsion physics
        if (mouse.x !== null && mouse.y !== null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < mouse.radius) {
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = mouse.radius;
            let force = (maxDistance - distance) / maxDistance;
            let directionX = forceDirectionX * force * 0.8;
            let directionY = forceDirectionY * force * 0.8;
            
            this.x -= directionX;
            this.y -= directionY;
          }
        }
      }
    }

    function initParticles() {
      particles = [];
      const numberOfParticles = Math.min(Math.floor((canvas.width * canvas.height) / 10000), 160);
      for (let i = 0; i < numberOfParticles; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        particles.push(new Particle(x, y));
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      requestAnimationFrame(animateParticles);
    }

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    resizeCanvas();
    animateParticles();
  }

  // 4. About Me Timeline Progress & Card Activation
  const aboutSection = document.getElementById('about');
  const aboutProgress = document.getElementById('about-progress');
  const timelineWrappers = document.querySelectorAll('.timeline-card-wrapper');

  function updateAboutTimeline() {
    if (!aboutSection || !aboutProgress) return;
    
    const rect = aboutSection.getBoundingClientRect();
    const sectionHeight = aboutSection.offsetHeight;
    
    // Calculate how far down the section the user has scrolled
    const scrollInSection = -rect.top;
    const scrollPercent = Math.min(Math.max((scrollInSection / (sectionHeight - window.innerHeight)) * 100, 0), 100);
    
    aboutProgress.style.height = `${scrollPercent}%`;

    // Activate timeline cards based on vertical position
    timelineWrappers.forEach((wrapper) => {
      const wrapperRect = wrapper.getBoundingClientRect();
      // Activate card when it crosses center of the screen
      if (wrapperRect.top < window.innerHeight * 0.7) {
        wrapper.classList.add('active');
      } else {
        wrapper.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', updateAboutTimeline);
  updateAboutTimeline();

  // 5. 3D Tilt Hover Effects
  const tiltTargets = document.querySelectorAll('.tilt-target');
  tiltTargets.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const width = rect.width;
      const height = rect.height;
      
      // Calculate rotation based on cursor offset (-10 to 10 deg)
      const rotateX = ((y / height) - 0.5) * -12;
      const rotateY = ((x / width) - 0.5) * 12;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      
      // Update glow coordinates
      card.style.setProperty('--glow-x', `${(x / width) * 100}%`);
      card.style.setProperty('--glow-y', `${(y / height) * 100}%`);
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  // 6. Featured Work Horizontal Scroll Implementation
  const workSection = document.getElementById('featured-work');
  const workTrack = document.getElementById('work-track');

  let activeCounters = false;
  let activeMapPins = false;

  function handleFeaturedWorkScroll() {
    if (!workSection || !workTrack) return;
    
    // Disable horizontal scroll on mobile/tablet viewports
    if (window.innerWidth <= 1024) {
      workTrack.style.transform = '';
      return;
    }
    
    const rect = workSection.getBoundingClientRect();
    const scrollableHeight = workSection.offsetHeight - window.innerHeight;
    
    // Calculate progress based on relative scroll position and clamp it between 0 and 1
    let progress = -rect.top / scrollableHeight;
    progress = Math.min(Math.max(progress, 0), 1);
    
    // Calculate maximum horizontal travel
    const maxTravel = workTrack.offsetWidth - window.innerWidth;
    const translateX = progress * maxTravel;
    
    workTrack.style.transform = `translateX(${-translateX}px)`;
    
    // Custom assemblies: Project 1 (CHC Handlooms) continuous scroll-linked assembly
    if (window.innerWidth > 1024) {
      const chcCard = document.querySelector('.project-chc');
      if (chcCard) {
        const laptop = chcCard.querySelector('.laptop-mockup');
        const laptopBase = chcCard.querySelector('.laptop-base');
        const phone = chcCard.querySelector('.phone-mockup');
        const diagram = chcCard.querySelector('.diagram-node');
        
        // Calculate progress of section entry (0 when bottom enters viewport, 1 when sticky)
        let entryProgress = (window.innerHeight - rect.top) / window.innerHeight;
        entryProgress = Math.min(Math.max(entryProgress, 0), 1);
        
        if (laptop && phone && diagram) {
          // Laptop: translates from -150px to -50px, opacity 0 to 1
          const laptopX = -150 + (100 * entryProgress);
          laptop.style.transform = `translate(${laptopX}px, -20px) scale(${0.9 + 0.1 * entryProgress})`;
          laptop.style.opacity = entryProgress;
          
          if (laptopBase) {
            laptopBase.style.transform = `translate(${laptopX}px, -20px)`;
            laptopBase.style.opacity = entryProgress;
          }
          
          // Phone: translates from 220px to 100px, opacity 0 to 1
          const phoneX = 220 - (120 * entryProgress);
          phone.style.transform = `translate(${phoneX}px, 30px) scale(${0.9 + 0.1 * entryProgress})`;
          phone.style.opacity = entryProgress;
          
          // Diagram: translates from Y=50px to Y=0px, opacity 0 to 1
          const diagramY = 50 - (50 * entryProgress);
          diagram.style.transform = `translateY(${diagramY}px)`;
          diagram.style.opacity = entryProgress;
        }
      }
    } else {
      // Mobile: Clear inline styles so CSS transitions take over
      const chcCard = document.querySelector('.project-chc');
      if (chcCard) {
        const laptop = chcCard.querySelector('.laptop-mockup');
        const laptopBase = chcCard.querySelector('.laptop-base');
        const phone = chcCard.querySelector('.phone-mockup');
        const diagram = chcCard.querySelector('.diagram-node');
        
        if (laptop) { laptop.style.transform = ''; laptop.style.opacity = ''; }
        if (laptopBase) { laptopBase.style.transform = ''; laptopBase.style.opacity = ''; }
        if (phone) { phone.style.transform = ''; phone.style.opacity = ''; }
        if (diagram) { diagram.style.transform = ''; diagram.style.opacity = ''; }
      }
    }

    // Project 2 (Influencer Campaigns) counter activation
    const influencerCard = document.querySelector('.project-influencer');
    if (influencerCard) {
      const infOffsetLeft = influencerCard.offsetLeft;
      if (translateX + window.innerWidth >= infOffsetLeft + 300 && !activeCounters) {
        activeCounters = true;
        animateDashboardCounters();
      }
    }

    // Project 3 (Lead Qualification) map pins activation
    const qualificationCard = document.querySelector('.project-qualification');
    if (qualificationCard) {
      const qualOffset = qualificationCard.offsetLeft;
      if (translateX + window.innerWidth >= qualOffset + 300 && !activeMapPins) {
        activeMapPins = true;
        animateMapSimulation();
      }
    }
  }

  // Setup IntersectionObserver for vertical scrolling (mobile, tablet & desktop backups)
  const verticalObserverOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -100px 0px"
  };

  const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains('project-chc')) {
          const stage = entry.target.querySelector('.chc-assembly-stage');
          if (stage) {
            stage.classList.add('assembled');
          }
        }
        if (entry.target.classList.contains('project-influencer') && !activeCounters) {
          activeCounters = true;
          animateDashboardCounters();
        }
        if (entry.target.classList.contains('project-qualification') && !activeMapPins) {
          activeMapPins = true;
          animateMapSimulation();
        }
      }
    });
  }, verticalObserverOptions);

  const chcCardElement = document.querySelector('.project-chc');
  const influencerCardElement = document.querySelector('.project-influencer');
  const qualificationCardElement = document.querySelector('.project-qualification');

  if (chcCardElement) projectObserver.observe(chcCardElement);
  if (influencerCardElement) projectObserver.observe(influencerCardElement);
  if (qualificationCardElement) projectObserver.observe(qualificationCardElement);

  // Dashboard Counter animation
  function animateDashboardCounters() {
    const counters = document.querySelectorAll('.db-counter');
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      let count = 0;
      const speed = target / 50; // speed division factor
      
      function updateCount() {
        count += speed;
        if (count < target) {
          counter.textContent = Math.floor(count);
          requestAnimationFrame(updateCount);
        } else {
          counter.textContent = target;
        }
      }
      updateCount();
    });
  }

  // World Map Animation sequence
  function animateMapSimulation() {
    const pins = document.querySelectorAll('.map-pin');
    const flows = document.querySelectorAll('.lead-flow-path');
    const alertBox = document.getElementById('map-alert-box');
    
    const locations = ["Dubai", "Germany", "UK & Europe", "Middle East"];
    
    pins.forEach((pin, index) => {
      setTimeout(() => {
        pin.classList.add('active');
        // Activate flows linked to nodes
        if (flows[index]) {
          flows[index].classList.add('active');
        }
        
        // Alert system updates
        if (alertBox) {
          alertBox.innerHTML = `<span class="active-alert">Lead inbound: Sourcing pipeline from ${locations[index]}...</span>`;
        }
        
        if (index === pins.length - 1) {
          setTimeout(() => {
            if (alertBox) {
              alertBox.innerHTML = `<span class="active-alert">✓ System Active. 4 channels listening. CRM synced.</span>`;
            }
          }, 1500);
        }
      }, index * 1000);
    });
  }

  window.addEventListener('scroll', handleFeaturedWorkScroll);

  // 8. Skills Ecosystem Orbital System
  const ecoNodes = document.querySelectorAll('.eco-orbit');
  const ecoLinesSvg = document.getElementById('ecosystem-lines');
  
  const skillData = {
    marketing: {
      category: "Growth Marketing",
      title: "Full-Funnel Content Strategy",
      description: "Designing end-to-end user acquisition strategies, organic search engines, search engine positioning, and content matrices that align with product flywheels.",
      tags: ["SEO Frameworks", "Content Matrix", "A/B Testing", "Attribution"]
    },
    performance: {
      category: "Performance Marketing",
      title: "Paid Media & Lead Gen Engines",
      description: "Managing budgets across Google search networks, Meta, and LinkedIn. Building precise custom target audiences and continuous creative experiment loops.",
      tags: ["Meta Ads Manager", "Google Search Ads", "CBO Optimization", "Retargeting"]
    },
    automation: {
      category: "Automation Stack",
      title: "Workflow Automation Operations",
      description: "Connecting SaaS systems with event-based logic. Writing secure webhook endpoints, custom triggers, database mappings, and exception handling routines.",
      tags: ["Make.com", "Zapier Integrations", "APIs & Webhooks", "JSON Parsing"]
    },
    business: {
      category: "Business Development",
      title: "Outbound Growth Operations",
      description: "Deploying outbound prospect acquisition loops. Enriching leads automatically using AI profile scanners, email verification triggers, and CRM mappings.",
      tags: ["Clay.run Scopes", "Outreach Automations", "HubSpot Setup", "Prospect Data"]
    },
    design: {
      category: "Graphic Design & UX",
      title: "Visual Brand & Creative Production",
      description: "Mastering layout composition, editorial design, 3D product rendering, print media production, and high-conversion ad creatives using standard tools.",
      tags: ["Photoshop", "Illustrator", "InDesign", "CorelDraw"]
    },
    ai: {
      category: "Artificial Intelligence Stack",
      title: "LLM Pipeline Integrations",
      description: "Harnessing Large Language Models to write, refine, and structure outreach campaigns, audit web layouts, and synthesize raw business data.",
      tags: ["OpenAI API", "Prompt Engineering", "Semantic Analysis", "LLM Chains"]
    }
  };

  const ecoPanelContent = document.getElementById('eco-panel-content');
  const ecoPlaceholder = document.querySelector('.panel-placeholder');
  const ecoBadge = document.getElementById('eco-badge');
  const ecoTitle = document.getElementById('eco-title');
  const ecoDescription = document.getElementById('eco-description');
  const ecoTags = document.getElementById('eco-tags');

  // Draw connections between central AKSHIT node and orbits
  function drawEcosystemLines() {
    if (!ecoLinesSvg) return;
    
    // Clear existing paths
    ecoLinesSvg.innerHTML = '';
    
    const stageWidth = ecoLinesSvg.clientWidth;
    const stageHeight = ecoLinesSvg.clientHeight;
    
    const centerX = stageWidth / 2;
    const centerY = stageHeight / 2;
    
    ecoNodes.forEach(node => {
      // Get orbit angles and radius
      const angleStr = node.style.getPropertyValue('--angle');
      const radiusStr = node.style.getPropertyValue('--orbit-r');
      
      const angleDeg = parseFloat(angleStr);
      const radius = parseFloat(radiusStr);
      const angleRad = (angleDeg * Math.PI) / 180;
      
      // Calculate coordinates of orbit node centers
      const destX = centerX + radius * Math.cos(angleRad);
      const destY = centerY + radius * Math.sin(angleRad);
      
      // Draw SVG Connection line
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      path.setAttribute('x1', centerX);
      path.setAttribute('y1', centerY);
      path.setAttribute('x2', destX);
      path.setAttribute('y2', destY);
      path.setAttribute('stroke', 'rgba(255, 255, 255, 0.08)');
      path.setAttribute('stroke-width', '1.5');
      path.setAttribute('stroke-dasharray', '4 4');
      
      ecoLinesSvg.appendChild(path);
    });
  }

  // Fill detail panel based on hovered node
  function activateSkillDetails(skillId) {
    const data = skillData[skillId];
    if (!data) return;

    ecoPlaceholder.classList.add('hidden');
    ecoPanelContent.classList.remove('hidden');

    ecoBadge.textContent = data.category;
    ecoTitle.textContent = data.title;
    ecoDescription.textContent = data.description;
    
    ecoTags.innerHTML = '';
    data.tags.forEach(tag => {
      const span = document.createElement('span');
      span.textContent = tag;
      ecoTags.appendChild(span);
    });

    // Handle CTA button display for Design
    const ecoCta = document.getElementById('eco-cta-container');
    if (ecoCta) {
      if (skillId === 'design') {
        ecoCta.classList.remove('hidden');
      } else {
        ecoCta.classList.add('hidden');
      }
    }
  }

  ecoNodes.forEach(node => {
    const skillId = node.getAttribute('data-skill');
    
    node.addEventListener('mouseenter', () => {
      ecoNodes.forEach(n => n.classList.remove('active'));
      node.classList.add('active');
      activateSkillDetails(skillId);
    });

    node.addEventListener('click', () => {
      ecoNodes.forEach(n => n.classList.remove('active'));
      node.classList.add('active');
      activateSkillDetails(skillId);
    });
  });

  // Redraw SVG connections on window resizing
  window.addEventListener('resize', drawEcosystemLines);
  setTimeout(drawEcosystemLines, 500); // Wait for dimensions to stabilize

  // 9. Experience Journey Timelines Slides
  const journeyItems = document.querySelectorAll('.journey-item');
  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.2 });

  journeyItems.forEach(item => slideObserver.observe(item));

  // 10. Process Diagram Scroll Connecting Line
  const processSection = document.getElementById('process');
  const processPath = document.getElementById('process-svg-path');
  const processStepItems = document.querySelectorAll('.process-step-item');

  function updateProcessLine() {
    if (!processSection || !processPath) return;
    
    const rect = processSection.getBoundingClientRect();
    const sectionHeight = processSection.offsetHeight;
    
    // Check path length
    const pathLength = processPath.getTotalLength();
    processPath.style.strokeDasharray = pathLength;
    
    const scrollInProcess = -rect.top;
    const progress = Math.min(Math.max(scrollInProcess / (sectionHeight - window.innerHeight * 0.9), 0), 1);
    
    // Animate SVG path drawing
    const drawLength = pathLength * progress;
    processPath.style.strokeDashoffset = pathLength - drawLength;
    
    // Activate step descriptions on scroll
    processStepItems.forEach((step) => {
      const stepRect = step.getBoundingClientRect();
      if (stepRect.top < window.innerHeight * 0.75) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', updateProcessLine);
  // Trigger initially to set lengths
  setTimeout(updateProcessLine, 500);
});
