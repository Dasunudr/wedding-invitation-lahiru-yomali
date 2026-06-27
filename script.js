document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 0. Premium Hero Animations (Staggered Reveal & Sparkle Canvas)
    // ==========================================

    // A. Letter Reveal Animation for Hero Title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent.trim();
        heroTitle.innerHTML = '';
        [...text].forEach((char, index) => {
            const span = document.createElement('span');
            span.style.transitionDelay = `${index * 0.05}s`;
            if (char === ' ') {
                span.innerHTML = '&nbsp;';
            } else {
                span.textContent = char;
            }
            heroTitle.appendChild(span);
        });
    }

    // B. Floating Gold Sparkles Canvas
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const maxParticles = 50;

        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.reset();
                this.y = Math.random() * canvas.height;
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = canvas.height + Math.random() * 20;
                this.radius = Math.random() * 1.5 + 0.5;
                this.speed = Math.random() * 0.3 + 0.1;
                this.opacity = Math.random() * 0.4 + 0.1;
                this.angle = Math.random() * Math.PI * 2;
                this.wobble = Math.random() * 0.02 - 0.01;
            }

            update() {
                this.y -= this.speed;
                this.angle += this.wobble;
                this.x += Math.sin(this.angle) * 0.15;
                if (this.y < 0) {
                    this.reset();
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
                ctx.shadowBlur = this.radius * 3;
                ctx.shadowColor = 'rgba(212, 175, 55, 0.6)';
                ctx.fill();
                ctx.shadowColor = 'transparent';
            }
        }

        const initParticles = () => {
            particles = [];
            for (let i = 0; i < maxParticles; i++) {
                particles.push(new Particle());
            }
        };
        initParticles();

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        };
        animate();
    }

    // ==========================================
    // 1. Background Music Player Control
    // ==========================================
    const musicToggle = document.getElementById('music-toggle');
    const bgMusic = document.getElementById('bg-music');
    const musicOnIcon = document.getElementById('music-on-icon');
    const musicOffIcon = document.getElementById('music-off-icon');
    let isMusicPlaying = false;

    // Standard play logic
    const playMusic = () => {
        bgMusic.play()
            .then(() => {
                isMusicPlaying = true;
                musicOnIcon.classList.remove('hidden');
                musicOffIcon.classList.add('hidden');
            })
            .catch(err => {
                console.log("Audio autoplay prevented. Waiting for user interaction.", err);
            });
    };

    const pauseMusic = () => {
        bgMusic.pause();
        isMusicPlaying = false;
        musicOnIcon.classList.add('hidden');
        musicOffIcon.classList.remove('hidden');
    };

    // Toggle click handler
    musicToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isMusicPlaying) {
            pauseMusic();
        } else {
            playMusic();
        }
    });

    // Try playing on first user interaction anywhere on the page (browser policy compliance)
    const handleFirstInteraction = () => {
        if (!isMusicPlaying) {
            playMusic();
        }
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('touchstart', handleFirstInteraction);
    };
    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);


    // ==========================================
    // 2. Countdown Timer
    // ==========================================
    // Target date: November 28, 2026 at 10:00:00 (Colombo Time / local time)
    const targetDate = new Date('November 28, 2026 10:00:00').getTime();

    const updateCountdown = () => {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) {
            document.getElementById('days').innerText = '00';
            document.getElementById('hours').innerText = '00';
            document.getElementById('minutes').innerText = '00';
            document.getElementById('seconds').innerText = '00';
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Format to double digits
        document.getElementById('days').innerText = days < 10 ? '0' + days : days;
        document.getElementById('hours').innerText = hours < 10 ? '0' + hours : hours;
        document.getElementById('minutes').innerText = minutes < 10 ? '0' + minutes : minutes;
        document.getElementById('seconds').innerText = seconds < 10 ? '0' + seconds : seconds;
    };

    // Update countdown every second
    setInterval(updateCountdown, 1000);
    updateCountdown(); // Initial call


    // ==========================================
    // 3. Scroll Reveal Animations (Intersection Observer)
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal-fade, .reveal-up, .reveal-left, .reveal-right');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Unobserve once revealed to keep layout responsive
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Offset trigger point slightly
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });


    // ==========================================
    // 4. Interactive Lightbox Gallery
    // ==========================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('.gallery-img');
            lightboxImg.src = img.src;
            lightboxCaption.innerText = img.alt;
            lightbox.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Lock background scrolling
        });
    });

    const closeLightbox = () => {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
        lightboxImg.src = '';
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target === lightboxClose) {
            closeLightbox();
        }
    });

    // Close lightbox on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.style.display === 'flex') {
            closeLightbox();
        }
    });


    // ==========================================
    // 5. RSVP Form Submission Handling
    // ==========================================
    const rsvpForm = document.getElementById('rsvp-form');
    const rsvpSuccess = document.getElementById('rsvp-success');
    const rsvpSubmitBtn = document.getElementById('rsvp-submit-btn');
    const rsvpResetBtn = document.getElementById('rsvp-reset-btn');

    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Simple validation
        const nameInput = document.getElementById('guest-name');
        if (!nameInput.value.trim()) {
            alert('Please enter your name.');
            return;
        }

        // Show elegant button loading state
        const originalText = rsvpSubmitBtn.innerText;
        rsvpSubmitBtn.disabled = true;
        rsvpSubmitBtn.innerText = 'Sending response...';

        // Simulate network latency (1.5 seconds)
        setTimeout(() => {
            // Restore button state
            rsvpSubmitBtn.disabled = false;
            rsvpSubmitBtn.innerText = originalText;

            // Hide Form and Show Success Card
            rsvpForm.classList.add('hidden');
            rsvpSuccess.classList.remove('hidden');
        }, 1500);
    });

    // Reset button to allow editing response
    rsvpResetBtn.addEventListener('click', () => {
        rsvpSuccess.classList.add('hidden');
        rsvpForm.classList.remove('hidden');
        rsvpForm.reset();
    });

});
