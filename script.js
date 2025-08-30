/* =============================
   Numera — Site JavaScript
============================= */
'use strict';

function onReady(fn){
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn, { once: true });
  } else {
    fn();
  }
}

/* Mobile menu */
onReady(() => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
});

/* Smooth in-page scroll */
onReady(() => {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
      document.querySelector('.site-nav')?.classList.remove('open');
      document.querySelector('.nav-toggle')?.setAttribute('aria-expanded', 'false');
    });
  });
});

/* Footer year */
onReady(() => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});

/* Stat counters */
onReady(() => {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  let started = false;

  const animate = () => {
    counters.forEach(el => {
      const target = +el.getAttribute('data-target') || 0;
      const duration = 1200;
      const start = performance.now();
      const tick = now => {
        const p = Math.min((now - start) / duration, 1);
        el.textContent = Math.floor(target * p).toLocaleString();
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  };

  const section = document.querySelector('.stats');
  if ('IntersectionObserver' in window && section) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !started) {
          started = true;
          animate();
          io.disconnect();
        }
      });
    }, { threshold: 0.4 });
    io.observe(section);
  } else {
    animate();
  }
});

/* Inline SVG icon placeholders */
const ICON_MAP = {
  '{%FACEBOOK%}':'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.5 22v-8h2.7l.4-3h-3.1V8.3c0-.9.3-1.5 1.7-1.5h1.5V4.1c-.7-.1-1.5-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8V11H8v3h2.8v8h2.7z"/></svg>',
  '{%INSTAGRAM%}':'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 3.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zm6-.2a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z"/></svg>',
  '{%X%}':'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 3l7.5 9.3L4 21h3l6-6.9L18.5 21H22l-8-9.7L21 3h-3l-5.7 6.6L6 3H4z"/></svg>',
  '{%YOUTUBE%}':'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M22 8.2s-.2-1.5-.8-2.1c-.8-.8-1.7-.8-2.1-.9C16.5 5 12 5 12 5s-4.5 0-7.1.2c-.4 0-1.3.1-2.1.9C2.2 6.7 2 8.2 2 8.2S1.8 10 1.8 11.7v.6C1.8 14 2 15.8 2 15.8s.2 1.5.8 2.1c.8.8 1.8.8 2.2.9 1.6.1 7 .2 7 .2s4.5 0 7.1-.2c.4 0 1.3-.1 2.1-.9.6-.6.8-2.1.8-2.1s.2-1.8.2-3.5v-.6c0-1.7-.2-3.5-.2-3.5zM10 14.7V7.9l6 3.4-6 3.4z"/></svg>',
  '{%PHONE%}':'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.6 10.8a15.4 15.4 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.2 1.2.5 2.6.8 4 .8.6 0 1 .4 1 .9v3.7c0 .6-.4 1-1 1C10.7 21.4 2.6 13.3 2.6 3.5c0-.6.4-1 1-1H7.3c.6 0 1 .4 1 1 0 1.4.3 2.8.8 4 .1.4 0 .8-.3 1.1l-2.2 2.2z"/></svg>',
  '{%PIN%}':'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>',
  '{%MAIL%}':'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 4.5L4 8V6l8 4.5L20 6v2z"/></svg>',
};
onReady(() => {
  document.querySelectorAll('.social-icon, .contact-line, .ct-list-item, .ct-info').forEach(el => {
    let html = el.innerHTML;
    for (const [token, svg] of Object.entries(ICON_MAP)) {
      html = html.split(token).join(svg);
    }
    el.innerHTML = html;
  });
});

/* Auto-advance for .hc-slider (with controls highlight) */
onReady(() => {
  document.querySelectorAll('.hc-slider').forEach(slider => {
    const radios = Array.from(slider.querySelectorAll('.hc-radio'));
    const controlBar = slider.querySelector('.hc-controls');
    if (!radios.length || !controlBar) return;

    const controls = radios
      .map(r => controlBar.querySelector(`label.hc-tab[for="${r.id}"]`))
      .filter(Boolean);

    let idx = Math.max(0, radios.findIndex(r => r.checked));
    radios[idx].checked = true;

    const updateControls = () => {
      controls.forEach((t, i) => {
        const active = i === idx;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
      });
    };

    let timer = null;
    const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
    const start = () => {
      stop();
      timer = setInterval(() => {
        idx = (idx + 1) % radios.length;
        radios[idx].checked = true;
        updateControls();
      }, 3000);
    };

    controls.forEach((tab, i) => {
      tab.addEventListener('click', () => {
        idx = i;
        radios[idx].checked = true;
        updateControls();
        start();
      });
    });

    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    slider.addEventListener('focusin', stop);
    slider.addEventListener('focusout', start);
    document.addEventListener('visibilitychange', () => {
      document.hidden ? stop() : start();
    });

    updateControls();
    start();
  });
});

/* Services modals */
onReady(() => {
  const bodyLock = (lock) => {
    document.documentElement.classList.toggle('no-scroll', lock);
    document.body.classList.toggle('no-scroll', lock);
  };

  const openModal = (modal, trigger) => {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    bodyLock(true);
    if (trigger && trigger instanceof HTMLElement) modal.__trigger = trigger;
    modal.querySelector('.modal__dialog')?.focus();
  };

  const closeModal = (modal) => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    bodyLock(false);
    if (modal.__trigger) { modal.__trigger.focus(); modal.__trigger = null; }
  };

  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-modal]');
    if (!opener) return;
    const id = opener.getAttribute('data-modal');
    const modal = document.getElementById(id);
    if (!modal) return;
    e.preventDefault();
    openModal(modal, opener);
  });

  document.addEventListener('click', (e) => {
    const modal = e.target.closest('.modal');
    if (!modal) return;
    if (e.target.classList.contains('modal__backdrop') || e.target.classList.contains('modal__close')) {
      closeModal(modal);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.modal.is-open').forEach(closeModal);
  });
});

/* Simple auto slider (no controls) */
onReady(() => {
  document.querySelectorAll('.strip-slider .strip-track').forEach(track => {
    const slides = Array.from(track.children);
    if (slides.length < 2) return;

    const firstClone = slides[0].cloneNode(true);
    firstClone.setAttribute('aria-hidden', 'true');
    track.appendChild(firstClone);

    const stepMs = Number(track.dataset.interval) || 1000;
    const durMs  = Number(track.dataset.duration) || 450;
    track.style.transition = `transform ${durMs}ms ease`;

    let i = 0;
    let timer = null;

    const go = (n) => {
      i = n;
      track.style.transform = `translateX(-${i * 100}%)`;
    };

    const start = () => { stop(); timer = setInterval(() => go(i + 1), stepMs); };
    const stop  = () => { if (timer) { clearInterval(timer); timer = null; } };

    track.addEventListener('transitionend', () => {
      const total = track.children.length;
      if (i === total - 1) {
        track.style.transition = 'none';
        track.style.transform = 'translateX(0)';
        i = 0;
        track.offsetHeight; // reflow
        track.style.transition = `transform ${durMs}ms ease`;
      }
    });

    start();
    document.addEventListener('visibilitychange', () => {
      document.hidden ? stop() : start();
    });
  });
});
