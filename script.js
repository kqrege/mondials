document.addEventListener('DOMContentLoaded', () => {
    const nav = document.getElementById('nav');
    const fades = document.querySelectorAll('.fade');

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
});
