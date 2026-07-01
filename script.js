document.addEventListener('DOMContentLoaded', () => {

    /* --- المتغيرات الأساسية للموسيقى --- */
    let isMusicPlaying = false;
    const audio = document.getElementById('bg-music');
    const equalizer = document.querySelector('.equalizer');
    
    // ضبط مستوى الصوت
    audio.volume = 0.25;

    /* --- Loading Screen & Cinematic Audio Start --- */
    const loadingScreen = document.getElementById('loading-screen');
    const loadingPercentage = document.querySelector('.loading-percentage');
    const loadingBarContainer = document.querySelector('.loading-bar-container');
    const loadingBar = document.querySelector('.loading-bar');
    const enterBtnContainer = document.getElementById('enter-btn-container');
    const enterBtn = document.getElementById('enter-btn');
    let loadCount = 0;

    const interval = setInterval(() => {
        loadCount += Math.floor(Math.random() * 10) + 2; 
        if (loadCount > 100) loadCount = 100;
        
        loadingPercentage.innerText = `${loadCount}%`;
        loadingBar.style.width = `${loadCount}%`;

        if (loadCount === 100) {
            clearInterval(interval);
            setTimeout(() => {
                // إخفاء شريط التحميل وإظهار زرار الدخول
                loadingPercentage.style.display = 'none';
                loadingBarContainer.style.display = 'none';
                enterBtnContainer.classList.add('show');
            }, 500);
        }
    }, 150);

    // لما تضغط على "افتحي الرسالة"
    enterBtn.addEventListener('click', () => {
        // تشغيل الأغنية فوراً
        audio.play().then(() => {
            isMusicPlaying = true;
            equalizer.classList.add('playing');
        }).catch(() => {
            console.log("Audio play failed, user interaction might still be required by browser.");
        });

        // اختفاء شاشة التحميل ببطء ودخول الموقع
        loadingScreen.classList.add('hide');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            triggerHeroAnimations();
        }, 1000);
    });

    function triggerHeroAnimations() {
        const heroElements = document.querySelectorAll('#hero .reveal');
        heroElements.forEach(el => el.classList.add('active'));
    }

    /* --- Music Player Toggle (الزرار العائم) --- */
    const musicBtn = document.getElementById('music-toggle');
    
    musicBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play().then(() => {
                isMusicPlaying = true;
                equalizer.classList.add('playing');
            }).catch(() => {});
        } else {
            audio.pause();
            isMusicPlaying = false;
            equalizer.classList.remove('playing');
        }
    });

    /* --- Custom Cursor --- */
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorGlow = document.querySelector('.cursor-glow');

    if (window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            cursorGlow.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        const hoverElements = document.querySelectorAll('a, button, .glass-card');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('hover-effect'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('hover-effect'));
        });
    } else {
        cursorDot.style.display = 'none';
        cursorGlow.style.display = 'none';
    }

    /* --- Floating Particles Generator --- */
    const particlesContainer = document.getElementById('particles-container');
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
        createParticle();
    }

    function createParticle() {
        const particle = document.createElement('div');
        particle.classList.add('floating-particle');
        
        const size = Math.random() * 8 + 2;
        const startPosX = Math.random() * window.innerWidth;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 15;

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${startPosX}px`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;

        particlesContainer.appendChild(particle);
    }

    /* --- Intersection Observer for Scroll Animations --- */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                const counters = entry.target.querySelectorAll('.counter');
                counters.forEach(counter => {
                    if(!counter.classList.contains('counted')) {
                        startCounter(counter);
                        counter.classList.add('counted');
                    }
                });

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(element => {
        revealObserver.observe(element);
    });

    /* --- Animated Counter --- */
    function startCounter(counterElement) {
        const target = +counterElement.getAttribute('data-target');
        const duration = 2000; 
        const increment = target / (duration / 16); 
        
        let current = 0;
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counterElement.innerText = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counterElement.innerText = target;
            }
        };
        updateCounter();
    }

    /* --- 3D Tilt Effect on Cards --- */
    const tiltCards = document.querySelectorAll('.tilt-card');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

    /* --- Ripple Click Effect for Buttons --- */
    const buttons = document.querySelectorAll('.ripple-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            let x = e.clientX - e.target.getBoundingClientRect().left;
            let y = e.clientY - e.target.getBoundingClientRect().top;
            
            let ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    /* --- Scroll & Navigation Logic --- */
    const navbar = document.getElementById('navbar');
    const scrollProgress = document.querySelector('.scroll-progress');
    const backToTop = document.getElementById('back-to-top');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let currentScroll = window.scrollY;
        
        if (currentScroll > 50) {
            navbar.style.padding = "0 20px";
            navbar.style.height = "60px";
            navbar.style.background = "rgba(255, 255, 255, 0.85)";
        } else {
            navbar.style.padding = "0 30px";
            navbar.style.height = "70px";
            navbar.style.background = "rgba(255, 255, 255, 0.7)";
        }

        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolledPercentage = (currentScroll / documentHeight) * 100;
        scrollProgress.style.width = `${scrolledPercentage}%`;

        if (currentScroll > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        sections.forEach(sec => {
            const top = window.scrollY;
            const offset = sec.offsetTop - 150;
            const height = sec.offsetHeight;
            const id = sec.getAttribute('id');

            if (top >= offset && top < offset + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    document.querySelector(`.nav-links a[href*=${id}]`).classList.add('active');
                });
            }
        });
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-links');

    mobileBtn.addEventListener('click', () => {
        navMenu.classList.toggle('show');
        if(navMenu.classList.contains('show')) {
            mobileBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        } else {
            mobileBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show');
            mobileBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
        });
    });

});