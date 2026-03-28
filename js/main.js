  function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const pg = document.getElementById('page-' + id);
    if (pg) pg.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'instant' });
    lastScrollY = 0;
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.classList.toggle('active', a.dataset.page === id);
    });
    const nav = document.getElementById('mainNav');
    nav.classList.remove('nav-hidden');
    if (id !== 'home') { nav.classList.add('scrolled'); }
    else { nav.classList.remove('scrolled'); }
    const links = document.getElementById('navLinks');
    if (links) links.classList.remove('open');
  }

  function toggleMenu() {
    const links = document.getElementById('navLinks');
    if (links) links.classList.toggle('open');
  }
  function closeMenu() {
  const links = document.getElementById('navLinks');
  if (links) links.classList.remove('open');
  }

  let lastScrollY = 0;
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('mainNav');
    const currentY = window.scrollY;
    if (currentY > 80) { nav.classList.add('scrolled'); }
    else { nav.classList.remove('scrolled'); }
    if (currentY > lastScrollY && currentY > 200) { nav.classList.add('nav-hidden'); }
    else { nav.classList.remove('nav-hidden'); }
    lastScrollY = currentY;
  });

  function toggleFaq(btn) {
    const item = btn.closest('.faq-item');
    const icon = btn.querySelector('.faq-icon');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(el => {
      el.classList.remove('open');
      const ic = el.querySelector('.faq-icon');
      if (ic) ic.textContent = '+';
    });
    if (!isOpen) {
      item.classList.add('open');
      if (icon) icon.textContent = '×';
    }
  }

  function openDonateModal() {
    document.getElementById('donateModal').classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeDonateModal(e) {
    if (!e || e.target === document.getElementById('donateModal') || !e.target) {
      document.getElementById('donateModal').classList.remove('open');
      document.body.style.overflow = '';
    }
  }
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeDonateModal();
  });

  function handleSignup(btn) {
    btn.textContent = 'Thank you!';
    btn.disabled = true;
  }

  function setModelStep(idx) {
    for (var i = 0; i < 3; i++) {
      var tab   = document.getElementById('model-tab-'   + i);
      var panel = document.getElementById('model-panel-' + i);
      if (!tab || !panel) continue;
      tab.classList.toggle('active', i === idx);
      panel.classList.toggle('active', i === idx);
    }
  }

  showPage('home');

  (function() {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    function attachObservers() {
      document.querySelectorAll('.reveal').forEach(function(el) {
        observer.observe(el);
      });
    }
    var origShowPage = window.showPage;
    window.showPage = function(id) {
      origShowPage(id);
      setTimeout(attachObservers, 80);
    };
    attachObservers();
  })();

  // -- SLOT MACHINE COUNTER --
  function runSlotCounter(slotId, target) {
    var digits = String(target).split('');
    while (digits.length < 4) digits.unshift('0');
    digits.forEach(function(finalDigit, idx) {
      var inner = document.getElementById('sd-' + idx + '-' + slotId);
      if (!inner) return;
      var finalNum = parseInt(finalDigit, 10);
      var reel = [];
      for (var pass = 0; pass < 2; pass++) {
        for (var d = 0; d <= 9; d++) reel.push(d);
      }
      reel.push(finalNum);
      inner.innerHTML = reel.map(function(d) {
        return '<span class="slot-digit-char">' + d + '</span>';
      }).join('');
      inner.style.transform = 'translateY(0)';
      inner.style.transition = 'none';
      var stagger = 80 + (3 - idx) * 140;
      var dur = 0.5 + (3 - idx) * 0.2;
      setTimeout(function(el, d) {
        return function() {
          el.style.transition = 'transform ' + d + 's cubic-bezier(0.22,1,0.36,1)';
          el.style.transform = 'translateY(calc(-' + (reel.length - 1) + ' * 1em))';
        };
      }(inner, dur), stagger);
    });
  }

  function initSlotCounters() {
    document.querySelectorAll('[data-slot-id]').forEach(function(el) {
      var slotId  = el.getAttribute('data-slot-id');
      var target  = parseInt(el.getAttribute('data-target'), 10);
      var fired   = false;
      var obs = new IntersectionObserver(function(entries) {
          if (entries[0].isIntersecting && !fired) {
          fired = true;
          obs.unobserve(el);
          runSlotCounter(slotId, target);
        }
      }, { threshold: 0.3 });
      obs.observe(el);
    });
  }

  initSlotCounters();


