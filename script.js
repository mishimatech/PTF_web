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

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

/* ===========================
   Cached DOM References
   Query once, reuse everywhere
   =========================== */
const themeToggle = document.getElementById('theme-toggle');
const preloader = document.getElementById('preloader');
const cube = document.querySelector('.cube');
const aboutSection = document.getElementById('about');
const aboutBio = document.querySelector('.about-bio');
const bioContent = document.querySelector('.bio-content');
const aboutArsenal = document.querySelector('.about-arsenal');
const scrambleHeading = document.querySelector('.scramble-heading');
const statItems = Array.from(document.querySelectorAll('.stat-item'));
const statNumbers = Array.from(document.querySelectorAll('.stat-number'));
const dodgeTexts = Array.from(document.querySelectorAll('.dodge-text'));
const customCursor = document.querySelector('.custom-cursor');
const heroSticky = document.querySelector('.hero-sticky');
const magneticBtn = document.querySelector('.magnetic-btn');
const contactFooter = document.getElementById('contact-footer');
const localTimeElement = document.getElementById('local-time');
const videoCards = Array.from(document.querySelectorAll('.video-card'));

const cursorMoveX = customCursor
    ? gsap.quickTo(customCursor, 'x', { duration: 0.18, ease: 'power2.out' })
    : null;
const cursorMoveY = customCursor
    ? gsap.quickTo(customCursor, 'y', { duration: 0.18, ease: 'power2.out' })
    : null;
const magneticMoveX = magneticBtn
    ? gsap.quickTo(magneticBtn, 'x', { duration: 0.3, ease: 'power2.out' })
    : null;
const magneticMoveY = magneticBtn
    ? gsap.quickTo(magneticBtn, 'y', { duration: 0.3, ease: 'power2.out' })
    : null;

/* ===========================
   Theme Toggle - Light Mode
   =========================== */
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');

        gsap.fromTo(themeToggle,
            { scale: 0.9 },
            { scale: 1, duration: 0.4, ease: 'elastic.out(1.2, 0.5)' }
        );

        const isLightMode = document.body.classList.contains('light-mode');
        localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
    });

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    }
}

/* ===========================
   Preloader - 2 Second Timer
   =========================== */
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
   Hero 3D Reveal Animation
   =========================== */
const heroTimeline = gsap.timeline({ defaults: { ease: 'power4.out' } });

heroTimeline.to(splineViewer, {
    opacity: 1,
    duration: 2.5,
    ease: 'power2.inOut',
}, 0);

/* ===========================
   Cinematic Section Slide-Ins
   =========================== */
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
/* ===========================
   Cryptographic Scramble Heading
   Matrix-style text distortion
   =========================== */
const scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*!?';
const originalText = 'RYAN JOSHY';  // The true text to reveal
let scrambleInterval = null;

// Generate random scrambled text
function getScrambledText() {
    return originalText.split('').map(char => {
        if (char === ' ') return ' ';
        return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
    }).join('');
}

// Render text with proper serif styling on R and J
function renderText(text, useSerif = false) {
    if (!scrambleHeading) return;

    let html = '';
    const chars = text.split('');

    chars.forEach((char, i) => {
        if (char === ' ') {
            html += ' ';
        } else if (useSerif && (i === 0 || i === 5)) {
            // Apply serif class to R (index 0) and J (index 5 in "RYAN JOSHY")
            html += `<span class="serif">${char}</span>`;
        } else {
            html += char;
        }
    });

    scrambleHeading.innerHTML = html;
}

// Start the scrambling effect
function startScramble() {
    if (scrambleInterval) return;

    scrambleInterval = setInterval(() => {
        renderText(getScrambledText(), false);
    }, 50); // Fast scramble rate for matrix effect
}

// Stop scrambling and reveal true text with decode animation
function revealText() {
    if (scrambleInterval) {
        clearInterval(scrambleInterval);
        scrambleInterval = null;
    }

    // Decode animation — progressively reveal each character
    let revealed = '';
    let currentIndex = 0;
    const chars = originalText.split('');

    const decodeInterval = setInterval(() => {
        if (currentIndex < chars.length) {
            // Build revealed portion + scrambled remainder
            revealed = originalText.substring(0, currentIndex + 1);
            const scrambledRemainder = originalText.substring(currentIndex + 1)
                .split('')
                .map(c => c === ' ' ? ' ' : scrambleChars[Math.floor(Math.random() * scrambleChars.length)])
                .join('');

            renderText(revealed + scrambledRemainder, true);
            currentIndex++;
        } else {
            clearInterval(decodeInterval);
            renderText(originalText, true);
        }
    }, 60);
}

// Hover handlers for scramble heading
if (scrambleHeading) {
    // Start scrambling on page load
    startScramble();

    scrambleHeading.addEventListener('mouseenter', () => {
        revealText();

        // Animate bio-content to visible
        gsap.to(bioContent, {
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.6,
            ease: 'power2.out',
            onStart: () => {
                bioContent.style.pointerEvents = 'auto';
            }
        });
    });

    scrambleHeading.addEventListener('mouseleave', () => {
        startScramble();

        // Animate bio-content back to hidden
        gsap.to(bioContent, {
            opacity: 0,
            filter: 'blur(10px)',
            duration: 0.4,
            ease: 'power2.in',
            onComplete: () => {
                bioContent.style.pointerEvents = 'none';
            }
        });
    });

    // Scroll-triggered clip-path reveal for scramble heading
    ScrollTrigger.create({
        trigger: scrambleHeading,
        start: 'top 85%',
        end: 'top 20%',
        onEnter: () => {
            gsap.to(scrambleHeading, {
                clipPath: 'inset(0% 0 0 0)',
                opacity: 1,
                duration: 0.8,
                ease: 'power3.out',
            });
            scrambleHeading.classList.add('revealed');
        },
        onLeaveBack: () => {
            gsap.to(scrambleHeading, {
                clipPath: 'inset(50% 0 0 0)',
                opacity: 0,
                duration: 0.5,
                ease: 'power2.in',
            });
            scrambleHeading.classList.remove('revealed');
        }
    });
}

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
   Stats Counter Animation with Matrix Scramble
   =========================== */
const statScrambleChars = '0123456789@#$%&*!?';

// Matrix scramble effect for stat numbers
statNumbers.forEach((stat) => {
    const target = parseInt(stat.getAttribute('data-target'));
    const targetStr = target.toString();
    let statScrambleInterval = null;
    let isStatRevealed = false;

    // Generate scrambled number
    function getScrambledNumber() {
        return targetStr.split('').map(() =>
            statScrambleChars[Math.floor(Math.random() * statScrambleChars.length)]
        ).join('');
    }

    // Start scrambling
    function startStatScramble() {
        if (statScrambleInterval) return;
        statScrambleInterval = setInterval(() => {
            stat.innerText = getScrambledNumber();
        }, 50);
    }

    // Decode to real number
    function revealStatNumber() {
        if (statScrambleInterval) {
            clearInterval(statScrambleInterval);
            statScrambleInterval = null;
        }

        let currentIndex = 0;
        const decodeInterval = setInterval(() => {
            if (currentIndex < targetStr.length) {
                const revealed = targetStr.substring(0, currentIndex + 1);
                const scrambled = targetStr.substring(currentIndex + 1)
                    .split('')
                    .map(() => statScrambleChars[Math.floor(Math.random() * statScrambleChars.length)])
                    .join('');
                stat.innerText = revealed + scrambled;
                currentIndex++;
            } else {
                clearInterval(decodeInterval);
                stat.innerText = target;
            }
        }, 80);
    }

    // Hover interactions
    stat.addEventListener('mouseenter', () => {
        if (isStatRevealed) {
            revealStatNumber();
        }
    });

    stat.addEventListener('mouseleave', () => {
        if (isStatRevealed) {
            startStatScramble();
        }
    });

    // Store functions for scroll trigger
    stat._startScramble = startStatScramble;
    stat._revealNumber = revealStatNumber;
    stat._setRevealed = (val) => { isStatRevealed = val; };
    stat._stopScramble = () => {
        if (statScrambleInterval) {
            clearInterval(statScrambleInterval);
            statScrambleInterval = null;
        }
    };
});

// Clip-path reveal for each stat item with stagger
statItems.forEach((item, index) => {
    const statNum = statNumbers[index];

    ScrollTrigger.create({
        trigger: item,
        start: 'top 85%',
        end: 'top 20%',
        onEnter: () => {
            // Clip reveal animation
            gsap.to(item, {
                clipPath: 'inset(0 0 0% 0)',
                opacity: 1,
                duration: 0.8,
                delay: index * 0.15,
                ease: 'power3.out',
                onComplete: () => {
                    item.classList.add('revealed');
                    // Start matrix scramble after reveal
                    if (statNum) {
                        statNum._setRevealed(true);
                        statNum._startScramble();
                    }
                }
            });
        },
        onLeaveBack: () => {
            // Clip out animation
            gsap.to(item, {
                clipPath: 'inset(0 0 50% 0)',
                opacity: 0,
                duration: 0.5,
                ease: 'power2.in',
                onStart: () => {
                    item.classList.remove('revealed');
                    if (statNum) {
                        statNum._setRevealed(false);
                        statNum._stopScramble();
                        statNum.innerText = '0';
                    }
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
dodgeTexts.forEach(splitTextForDodge);

// Get all dodge letters
const dodgeLetters = document.querySelectorAll('.dodge-letter');
const repelRadius = 100;
const repelStrength = 75; // Tripled for aggressive text dodge

let dodgePointerX = 0;
let dodgePointerY = 0;
let dodgeFrame = null;

function updateDodgeLetters() {
    dodgeLetters.forEach((letter) => {
        const rect = letter.getBoundingClientRect();
        const letterCenterX = rect.left + rect.width / 2;
        const letterCenterY = rect.top + rect.height / 2;

        const deltaX = letterCenterX - dodgePointerX;
        const deltaY = letterCenterY - dodgePointerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance < repelRadius) {
            // Calculate repel force (stronger when closer)
            const force = (repelRadius - distance) / repelRadius;
            const angle = Math.atan2(deltaY, deltaX);

            const moveX = Math.cos(angle) * force * repelStrength;
            const moveY = Math.sin(angle) * force * repelStrength;

            letter.style.transform = `translate(${moveX}px, ${moveY}px)`;
        } else {
            // Return to original position
            letter.style.transform = '';
        }
    });

    dodgeFrame = null;
}

/* ===========================
   Custom Cursor - Hero Only
   =========================== */
// Start cursor dead center of viewport
gsap.set(customCursor, {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    opacity: 0,
});

// Track mouse position
document.addEventListener('mousemove', (e) => {
    dodgePointerX = e.clientX;
    dodgePointerY = e.clientY;

    if (cursorMoveX && cursorMoveY) {
        cursorMoveX(e.clientX);
        cursorMoveY(e.clientY);
    }

    if (dodgeFrame === null) {
        dodgeFrame = requestAnimationFrame(updateDodgeLetters);
    }
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
if (magneticBtn) {
    magneticBtn.addEventListener('mouseenter', function() {
        this.style.transition = 'none';
    });

    magneticBtn.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        if (magneticMoveX && magneticMoveY) {
            magneticMoveX(x * 0.3);
            magneticMoveY(y * 0.3);
        }
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
