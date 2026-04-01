/* ===========================
   Lenis Smooth Scroll Init
   =========================== */
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
});

// Sync Lenis with GSAP ScrollTrigger
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

/* ===========================
   Preloader - 2 Second Timer
   =========================== */
const preloader = document.getElementById('preloader');
const cube = document.querySelector('.cube');

// Hide preloader after exactly 2 seconds
setTimeout(() => {
    const preloaderTimeline = gsap.timeline({
        onComplete: () => {
            preloader.style.display = 'none';
        }
    });
    
    // Scale up cube as if pushing past camera
    preloaderTimeline.to(cube, {
        scale: 2.5,
        opacity: 0,
        duration: 1,
        ease: 'power2.in',
    }, 0);
    
    // Fade out the entire preloader
    preloaderTimeline.to(preloader, {
        opacity: 0,
        duration: 1.5,
        ease: 'power2.inOut',
    }, 0.2);
}, 2000);

/* ===========================
   GSAP ScrollTrigger Init
   =========================== */
gsap.registerPlugin(ScrollTrigger);

/* ===========================
   Spline 3D Integration
   =========================== */
const splineViewer = document.getElementById('spline-hero');
let splineApp = null;
let splineMainObject = null;

// Store initial transform for scroll animation
let initialObjectRotationY = 0;

// Listen for Spline load event
splineViewer.addEventListener('load', (e) => {
    splineApp = e.target;
    
    // Access the Spline application instance
    if (splineApp && splineApp.spline) {
        const spline = splineApp.spline;
        
        // Main object is named "Parent" in the scene
        splineMainObject = spline.findObjectByName('Parent');
        
        if (splineMainObject) {
            initialObjectRotationY = splineMainObject.rotation.y;
        }
        
        // Initialize scroll-driven animation
        initSplineScrollAnimation();
    }
    
    console.log('Spline scene loaded');
});

// Scroll-driven Spline animation synced with Lenis
function initSplineScrollAnimation() {
    // Create ScrollTrigger for Hero → Gallery transition
    ScrollTrigger.create({
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
        onUpdate: (self) => {
            const progress = self.progress;
            
            // Rotate main object on scroll (0 to 180 degrees)
            if (splineMainObject) {
                splineMainObject.rotation.y = initialObjectRotationY + (progress * Math.PI);
            }
        }
    });
}

/* ===========================
   Cinematic Ambient Lighting
   Subtle Breathing Glow
   =========================== */
const meshBg = document.querySelector('.mesh-bg');

// Subtle pulsing glow effect - cinematic breathing
gsap.to(meshBg, {
    opacity: 0.85,
    duration: 4,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
});

/* ===========================
   Hero 3D Reveal Animation
   =========================== */
const splineHero = document.getElementById('spline-hero');

// Cinematic fade-in for the 3D canvas
const heroTimeline = gsap.timeline({ defaults: { ease: 'power4.out' } });

heroTimeline.to(splineHero, {
    opacity: 1,
    duration: 2.5,
    ease: 'power2.inOut',
}, 0);

/* ===========================
   Cinematic Section Slide-Ins
   =========================== */
const aboutSection = document.getElementById('about');
const gallerySection = document.getElementById('gallery');

// About Section - Slide in from right with scrub
gsap.to(aboutSection, {
    x: 0,
    opacity: 1,
    ease: 'none',
    scrollTrigger: {
        trigger: '#hero',
        start: 'bottom bottom',
        end: '+=50%',
        scrub: 1,
    }
});

// Gallery Section - Pinned Stacking Cards

/* ===========================
   Stacking Cards Pinned Timeline
   =========================== */
const videoCards = document.querySelectorAll('.video-card');
const galleryTl = gsap.timeline({
    scrollTrigger: {
        trigger: '#gallery',
        start: 'top top',
        end: '+=3000',
        pin: true,
        scrub: 1,
        anticipatePin: 1,
    }
});

// Set initial z-index for proper stacking
videoCards.forEach((card, i) => {
    gsap.set(card, { zIndex: i + 1 });
});

// Choreograph each card's entrance and exit
videoCards.forEach((card, index) => {
    const isLast = index === videoCards.length - 1;
    
    // Step A: Card enters from right, balloons to center
    galleryTl.to(card, {
        x: 0,
        opacity: 1,
        scale: 1.25,
        zIndex: 10 + index,
        duration: 1,
        ease: 'power2.out',
    }, index * 1.5);
    
    // Step B: Card slides left and shrinks (except last card)
    if (!isLast) {
        galleryTl.to(card, {
            x: '-35vw',
            scale: 0.85,
            opacity: 0.6,
            duration: 1,
            ease: 'power2.inOut',
        }, (index * 1.5) + 1);
    } else {
        // Last card holds position
        galleryTl.to(card, {
            scale: 1.1,
            duration: 0.5,
            ease: 'power2.out',
        }, (index * 1.5) + 1);
    }
});
const aboutBio = document.querySelector('.about-bio');
const bioLines = document.querySelectorAll('.bio-line');
const aboutArsenal = document.querySelector('.about-arsenal');
const aboutHeadline = document.querySelector('.about-headline');

// Bio fade-in trigger
gsap.to(aboutBio, {
    opacity: 1,
    duration: 0.1,
    scrollTrigger: {
        trigger: '#about',
        start: 'left 80%',
        containerAnimation: false,
    }
});

// Headline reveal
gsap.from(aboutHeadline, {
    opacity: 0,
    y: 100,
    duration: 1.5,
    ease: 'power3.out',
    scrollTrigger: {
        trigger: '#about',
        start: 'top 70%',
    }
});

// Staggered bio line reveal
gsap.to(bioLines, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power2.out',
    scrollTrigger: {
        trigger: '.bio-content',
        start: 'top 75%',
    }
});

// Arsenal card slide in from right
gsap.to(aboutArsenal, {
    opacity: 1,
    x: 0,
    duration: 1.2,
    ease: 'power3.out',
    scrollTrigger: {
        trigger: '.about-arsenal',
        start: 'top 80%',
    }
});

/* ===========================
   Stats Counter Animation
   =========================== */
const statNumbers = document.querySelectorAll('.stat-number');

statNumbers.forEach((stat) => {
    const target = parseInt(stat.getAttribute('data-target'));
    
    ScrollTrigger.create({
        trigger: '.stats-grid',
        start: 'top 80%',
        once: true,
        onEnter: () => {
            gsap.to(stat, {
                innerText: target,
                duration: 2,
                ease: 'power3.out',
                snap: { innerText: 1 },
                onUpdate: function() {
                    stat.innerText = Math.floor(this.targets()[0].innerText);
                }
            });
        }
    });
});

/* ===========================
   Text Dodge Effect
   =========================== */
function splitTextForDodge(element) {
    const text = element.innerHTML;
    let newHTML = '';
    let insideTag = false;
    let currentTag = '';
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        
        if (char === '<') {
            insideTag = true;
            currentTag += char;
        } else if (char === '>') {
            insideTag = false;
            currentTag += char;
            newHTML += currentTag;
            currentTag = '';
        } else if (insideTag) {
            currentTag += char;
        } else if (char === ' ') {
            newHTML += ' ';
        } else {
            newHTML += `<span class="dodge-letter">${char}</span>`;
        }
    }
    
    element.innerHTML = newHTML;
}

// Apply text dodge to headlines
const dodgeTexts = document.querySelectorAll('.dodge-text');
dodgeTexts.forEach(splitTextForDodge);

// Get all dodge letters
const dodgeLetters = document.querySelectorAll('.dodge-letter');
const repelRadius = 100;
const repelStrength = 75; // Tripled for aggressive text dodge

// Mousemove handler for text repel
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    dodgeLetters.forEach((letter) => {
        const rect = letter.getBoundingClientRect();
        const letterCenterX = rect.left + rect.width / 2;
        const letterCenterY = rect.top + rect.height / 2;
        
        const deltaX = letterCenterX - mouseX;
        const deltaY = letterCenterY - mouseY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distance < repelRadius) {
            // Calculate repel force (stronger when closer)
            const force = (repelRadius - distance) / repelRadius;
            const angle = Math.atan2(deltaY, deltaX);
            
            const moveX = Math.cos(angle) * force * repelStrength;
            const moveY = Math.sin(angle) * force * repelStrength;
            
            gsap.to(letter, {
                x: moveX,
                y: moveY,
                duration: 0.2,
                ease: 'power2.out',
            });
        } else {
            // Return to original position
            gsap.to(letter, {
                x: 0,
                y: 0,
                duration: 0.4,
                ease: 'elastic.out(1, 0.5)',
            });
        }
    });
});

/* ===========================
   Custom Cursor - Hero Only
   =========================== */
const customCursor = document.querySelector('.custom-cursor');
const heroSticky = document.querySelector('.hero-sticky');

// Start cursor dead center of viewport
gsap.set(customCursor, {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    opacity: 0,
});

// Track mouse position
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    gsap.to(customCursor, {
        x: mouseX,
        y: mouseY,
        duration: 0.5,
        ease: 'power2.out',
    });
});

// Show cursor only in Hero sticky area
heroSticky.addEventListener('mouseenter', () => {
    gsap.to(customCursor, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
    });
});

heroSticky.addEventListener('mouseleave', () => {
    gsap.to(customCursor, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out',
    });
});

/* ===========================
   Video Card Hover Interactions
   =========================== */
videoCards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
        card.classList.add('card-hover');
    });
    
    card.addEventListener('mouseleave', () => {
        card.classList.remove('card-hover');
    });
});

/* ===========================
   Footer Teal Peel Reveal
   =========================== */
const contactFooter = document.getElementById('contact-footer');

gsap.timeline({
    scrollTrigger: {
        trigger: '#gallery',
        start: 'bottom bottom',
        end: '+=100%',
        scrub: 1.5,
    }
})
// Peel the teal footer up from bottom
.to(contactFooter, {
    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    ease: 'none',
}, 0)
// Push gallery down/scale slightly for depth
.to('#gallery', {
    y: -50,
    scale: 0.95,
    ease: 'none',
}, 0);

/* ===========================
   Magnetic Button Effect
   =========================== */
const magneticBtn = document.querySelector('.magnetic-btn');

if (magneticBtn) {
    magneticBtn.addEventListener('mouseenter', function() {
        this.style.transition = 'none';
    });
    
    magneticBtn.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(this, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.3,
            ease: 'power2.out',
        });
    });
    
    magneticBtn.addEventListener('mouseleave', function() {
        gsap.to(this, {
            x: 0,
            y: 0,
            duration: 0.8,
            ease: 'elastic.out(1, 0.3)',
        });
    });
}

/* ===========================
   Local Time Clock (IST)
   =========================== */
const localTimeElement = document.getElementById('local-time');

function updateLocalTime() {
    const now = new Date();
    const istTime = now.toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    
    if (localTimeElement) {
        localTimeElement.textContent = `${istTime} IST`;
    }
}

// Update immediately and every minute
updateLocalTime();
setInterval(updateLocalTime, 60000);
