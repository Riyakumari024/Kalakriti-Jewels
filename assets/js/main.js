'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('siteHeader');
  const backToTop = document.getElementById('backToTop');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main section[id]');

  const onScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle('scrolled', y > 40);
    backToTop?.classList.toggle('show', y > 600);

    let current = 'home';
    sections.forEach(section => {
      if (y >= section.offsetTop - 150) current = section.id;
    });
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  document.querySelectorAll('.mobile-nav a').forEach(link => {
    link.addEventListener('click', () => {
      const menu = document.getElementById('mobileMenu');
      const instance = bootstrap.Offcanvas.getInstance(menu);
      instance?.hide();
    });
  });

  AOS.init({ duration: 850, once: true, offset: 70, easing: 'ease-out-cubic' });

  new Swiper('.testimonialSwiper', {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    speed: 750,
    autoplay: { delay: 5200, disableOnInteraction: false },
    pagination: { el: '.swiper-pagination', clickable: true },
    breakpoints: { 768: { slidesPerView: 2 }, 1200: { slidesPerView: 3 } }
  });

  const counterSection = document.querySelector('.stats-section');
  let countersStarted = false;
  const animateCounters = () => {
    if (countersStarted) return;
    countersStarted = true;
    document.querySelectorAll('[data-counter]').forEach(el => {
      const target = Number(el.dataset.counter);
      const suffix = el.dataset.suffix || '';
      const duration = 1600;
      const start = performance.now();
      const tick = now => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = `${Math.floor(target * eased).toLocaleString('en-IN')}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  };
  if ('IntersectionObserver' in window && counterSection) {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { animateCounters(); observer.disconnect(); }
    }, { threshold: .3 });
    observer.observe(counterSection);
  } else animateCounters();

  const appointmentForm = document.getElementById('appointmentForm');
  appointmentForm?.addEventListener('submit', event => {
    event.preventDefault();
    if (!appointmentForm.checkValidity()) {
      event.stopPropagation();
      appointmentForm.classList.add('was-validated');
      return;
    }
    document.getElementById('formStatus').textContent = 'Thank you. Our concierge will contact you shortly.';
    appointmentForm.reset();
    appointmentForm.classList.remove('was-validated');
  });

  const newsletterForm = document.getElementById('newsletterForm');
  newsletterForm?.addEventListener('submit', event => {
    event.preventDefault();
    const email = document.getElementById('newsletterEmail');
    if (!email.checkValidity()) { email.reportValidity(); return; }
    document.getElementById('newsletterStatus').textContent = 'You are now on our private list.';
    newsletterForm.reset();
  });

  document.getElementById('year').textContent = new Date().getFullYear();

  document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(event) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `position:absolute;width:${size}px;height:${size}px;border-radius:50%;background:rgba(255,255,255,.28);left:${event.clientX - rect.left - size / 2}px;top:${event.clientY - rect.top - size / 2}px;transform:scale(0);animation:ripple .65s linear;pointer-events:none`;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  const style = document.createElement('style');
  style.textContent = '@keyframes ripple{to{transform:scale(2.5);opacity:0}}';
  document.head.appendChild(style);
});

// Premium pointer and subtle 3D interaction
(() => {
  const ring = document.querySelector('.cursor-ring');
  if (ring && window.matchMedia('(pointer:fine)').matches) {
    window.addEventListener('pointermove', e => {
      ring.style.left = `${e.clientX}px`;
      ring.style.top = `${e.clientY}px`;
    }, { passive: true });
    document.querySelectorAll('a,button,.collection-card,.gallery-piece').forEach(el => {
      el.addEventListener('pointerenter', () => ring.classList.add('active'));
      el.addEventListener('pointerleave', () => ring.classList.remove('active'));
    });
  }

  const card = document.querySelector('.hero-jewel-card');
  if (card && window.matchMedia('(pointer:fine)').matches) {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const rx = ((e.clientY-r.top)/r.height-.5)*-5;
      const ry = ((e.clientX-r.left)/r.width-.5)*7;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-7px)`;
    });
    card.addEventListener('pointerleave', () => card.style.transform = '');
  }
})();
