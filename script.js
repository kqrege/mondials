document.addEventListener('DOMContentLoaded', () => {
    const nav = document.getElementById('nav');
    const fades = document.querySelectorAll('.fade');
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');

    /* Scroll animations */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

    fades.forEach(el => observer.observe(el));

    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 40);
    });

    /* Particles */
    let particles = [];
    let mouseX = -1000;
    let mouseY = -1000;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        for (let i = 0; i < 3; i++) {
            particles.push({
                x: mouseX + (Math.random() - 0.5) * 10,
                y: mouseY + (Math.random() - 0.5) * 10,
                size: Math.random() * 2 + 0.5,
                alpha: 0.8,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5 - 0.3
            });
        }
    });

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles = particles.filter(p => p.alpha > 0.01);
        for (const p of particles) {
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= 0.012;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
            ctx.fill();
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    /* Falling Feathers */
    const feathersContainer = document.getElementById('feathers-container');
    const feathers = [];
    const FEATHER_SRC = 'assets/feather.png';
    const SPAWN_INTERVAL = 600;
    const MAX_FEATHERS = 30;

    function createFeather() {
        if (feathers.length >= MAX_FEATHERS) return;

        const img = document.createElement('img');
        img.src = FEATHER_SRC;
        img.className = 'feather';
        
        const size = 20 + Math.random() * 20;
        img.style.width = size + 'px';
        
        const startX = Math.random() * window.innerWidth;
        const feather = {
            el: img,
            x: startX,
            y: -50,
            speed: 0.5 + Math.random() * 1.2,
            swayOffset: Math.random() * Math.PI * 2,
            swaySpeed: 0.5 + Math.random() * 1,
            swayAmp: 20 + Math.random() * 30,
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 2,
            dragging: false
        };

        img.style.left = startX + 'px';
        img.style.top = feather.y + 'px';
        img.style.transform = `rotate(${feather.rotation}deg)`;

        /* Drag Logic */
        img.addEventListener('mousedown', (e) => {
            e.preventDefault();
            feather.dragging = true;
            img.classList.add('dragging');
            const startX = e.clientX - feather.x;
            const startY = e.clientY - feather.y;

            function onMove(e) {
                if (!feather.dragging) return;
                feather.x = e.clientX - startX;
                feather.y = e.clientY - startY;
                img.style.left = feather.x + 'px';
                img.style.top = feather.y + 'px';
            }

            function onUp() {
                feather.dragging = false;
                img.classList.remove('dragging');
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', onUp);
            }

            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
        });

        feathersContainer.appendChild(img);
        feathers.push(feather);
    }

    function animateFeathers() {
        for (let i = feathers.length - 1; i >= 0; i--) {
            const f = feathers[i];
            
            if (!f.dragging) {
                f.y += f.speed;
                f.x += Math.sin(f.y * 0.01 + f.swayOffset) * f.swayAmp * 0.02;
                f.rotation += f.rotSpeed;
                
                f.el.style.top = f.y + 'px';
                f.el.style.left = f.x + 'px';
                f.el.style.transform = `rotate(${f.rotation}deg)`;
            }

            if (f.y > window.innerHeight + 50) {
                f.el.remove();
                feathers.splice(i, 1);
            }
        }
        requestAnimationFrame(animateFeathers);
    }

    setInterval(createFeather, SPAWN_INTERVAL);
    animateFeathers();

    /* Card cursor gradient */
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mouse-x', x + '%');
            card.style.setProperty('--mouse-y', y + '%');
        });
    });

    /* Music controls */
    const audio = document.getElementById('bgMusic');
    const toggleBtn = document.getElementById('musicToggle');
    const playIcon = document.getElementById('playIcon');
    const pauseIcon = document.getElementById('pauseIcon');
    const volumeSlider = document.getElementById('musicVolume');

    audio.volume = 0.5;

    function startMusic() {
        audio.play().then(() => {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        }).catch(() => {
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        });
    }

    startMusic();

    document.addEventListener('click', function autoStart() {
        startMusic();
        document.removeEventListener('click', autoStart);
    }, { once: true });

    toggleBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        } else {
            audio.pause();
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        }
    });

    volumeSlider.addEventListener('input', (e) => {
        audio.volume = parseFloat(e.target.value);
    });
});
