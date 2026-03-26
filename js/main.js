/* ==========================================
   Particle Network — Hero Canvas
   ========================================== */
const canvas = document.getElementById('hero-canvas');

if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: null, y: null };

  const CFG = {
    count: 75,
    connectDist: 160,
    speed: 0.28,
    color: '124, 158, 245',
  };

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * CFG.speed;
      this.vy = (Math.random() - 0.5) * CFG.speed;
      this.r = Math.random() * 1.4 + 0.6;
      this.alpha = Math.random() * 0.5 + 0.35;
    }

    update() {
      // Subtle mouse repulsion
      if (mouse.x !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 130) {
          const f = ((130 - d) / 130) * 0.35;
          this.vx += (dx / d) * f;
          this.vy += (dy / d) * f;
        }
      }

      // Speed cap + gentle friction
      const spd = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (spd > CFG.speed * 4) {
        this.vx = (this.vx / spd) * CFG.speed * 4;
        this.vy = (this.vy / spd) * CFG.speed * 4;
      }
      this.vx *= 0.992;
      this.vy *= 0.992;

      this.x += this.vx;
      this.y += this.vy;

      // Wrap edges
      if (this.x < -10) this.x = canvas.width + 10;
      if (this.x > canvas.width + 10) this.x = -10;
      if (this.y < -10) this.y = canvas.height + 10;
      if (this.y > canvas.height + 10) this.y = -10;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${CFG.color}, ${this.alpha})`;
      ctx.fill();
    }
  }

  function init() {
    particles = Array.from({ length: CFG.count }, () => new Particle());
  }

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < CFG.connectDist) {
          const alpha = (1 - d / CFG.connectDist) * 0.28;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${CFG.color}, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawLines();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }

  resize();
  init();
  animate();

  window.addEventListener('resize', () => { resize(); init(); });
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });
}

/* ==========================================
   Nav Scroll Behavior
   ========================================== */
const nav = document.getElementById('nav');

if (nav) {
  // On project pages (no hero), always show scrolled state
  if (!canvas) {
    nav.classList.add('scrolled');
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else if (canvas) {
      // Only remove scrolled class on the homepage
      nav.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ==========================================
   Scroll-triggered card animations
   ========================================== */
const cards = document.querySelectorAll('.project-card');

if (cards.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  cards.forEach(card => observer.observe(card));
}
