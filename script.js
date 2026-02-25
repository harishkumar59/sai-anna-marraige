/**
 * Wedding Invitation — Interactive Script
 * Sai Kumar & Anjali · 6th March 2026
 * Features: Floating petals, countdown timer, scroll animations, parallax
 */

document.addEventListener('DOMContentLoaded', function () {

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 1. FLOATING PETALS (Canvas)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const canvas = document.getElementById('petalsCanvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const petals = [];
    const PETAL_COUNT = 18;
    const petalColors = [
        'rgba(212, 168, 83, 0.25)',
        'rgba(240, 212, 138, 0.2)',
        'rgba(255, 255, 255, 0.1)',
        'rgba(184, 134, 45, 0.2)',
        'rgba(255, 223, 150, 0.15)',
    ];

    class Petal {
        constructor() {
            this.reset();
            this.y = Math.random() * canvas.height; // start at random y initially
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = -20;
            this.size = Math.random() * 6 + 3;
            this.speedY = Math.random() * 0.6 + 0.2;
            this.speedX = Math.random() * 0.4 - 0.2;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.015;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
            this.wobble = Math.random() * Math.PI * 2;
            this.wobbleSpeed = Math.random() * 0.02 + 0.01;
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX + Math.sin(this.wobble) * 0.3;
            this.rotation += this.rotationSpeed;
            this.wobble += this.wobbleSpeed;

            if (this.y > canvas.height + 20) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.opacity;

            // Draw an elliptical petal shape
            ctx.beginPath();
            ctx.ellipse(0, 0, this.size, this.size * 0.5, 0, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();

            ctx.restore();
        }
    }

    for (let i = 0; i < PETAL_COUNT; i++) {
        petals.push(new Petal());
    }

    function animatePetals() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        petals.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animatePetals);
    }
    animatePetals();


    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 2. COUNTDOWN TIMER
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const weddingDate = new Date('2026-03-06T09:00:00+05:30').getTime();

    const countDays = document.getElementById('countDays');
    const countHours = document.getElementById('countHours');
    const countMinutes = document.getElementById('countMinutes');
    const countSeconds = document.getElementById('countSeconds');

    function updateCountdown() {
        const now = Date.now();
        const diff = weddingDate - now;

        if (diff <= 0) {
            countDays.textContent = '🎉';
            countHours.textContent = '🎊';
            countMinutes.textContent = '💒';
            countSeconds.textContent = '💍';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        countDays.textContent = String(days).padStart(2, '0');
        countHours.textContent = String(hours).padStart(2, '0');
        countMinutes.textContent = String(minutes).padStart(2, '0');
        countSeconds.textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);


    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 3. SCROLL REVEAL ANIMATIONS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const revealElements = document.querySelectorAll(
        '.invite-section, .couple-section, .countdown-section, .timeline-section, ' +
        '.venue-section, .map-section, .rsvp-section, .timeline-item'
    );

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Don't unobserve timeline items to keep staggering
                if (!entry.target.classList.contains('timeline-item')) {
                    revealObserver.unobserve(entry.target);
                }
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });


    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 4. PARALLAX IMAGE (subtle)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const parallaxImage = document.getElementById('parallaxImage');
    let ticking = false;

    function updateParallax() {
        if (!parallaxImage) return;
        const rect = parallaxImage.getBoundingClientRect();
        const windowH = window.innerHeight;

        if (rect.top < windowH && rect.bottom > 0) {
            const progress = (windowH - rect.top) / (windowH + rect.height);
            const y = (progress - 0.5) * 30; // subtle: ±15px
            parallaxImage.style.transform = `translateY(${y}px)`;
        }
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });


    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 5. SCROLL INDICATOR HIDE
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const scrollIndicator = document.getElementById('scrollIndicator');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 100) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.pointerEvents = 'none';
        } else {
            scrollIndicator.style.opacity = '';
            scrollIndicator.style.pointerEvents = '';
        }
    }, { passive: true });


    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 6. MAP CLICKABLE
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const mapWrapper = document.querySelector('.map-wrapper');
    if (mapWrapper) {
        mapWrapper.addEventListener('click', function () {
            window.open('https://maps.app.goo.gl/VMcYxxrKQNQ8uUMo7', '_blank');
        });
    }

});