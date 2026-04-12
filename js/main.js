/* IKIGAI AI-Intensive Landing — Interactions */

(function () {
  'use strict';

  /* --- Sticky Header --- */
  var header = document.getElementById('header');
  var scrollThreshold = 60;

  function onScroll() {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* --- Intersection Observer: fade-up animations --- */
  var fadeEls = document.querySelectorAll('.fade-up');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    fadeEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    fadeEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* --- Smooth scroll for anchor links --- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      var headerHeight = header.offsetHeight;
      var top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;

      window.scrollTo({
        top: top,
        behavior: 'smooth'
      });
    });
  });

  /* --- Neon Glow Effect (cursor-following) --- */
  var glowCards = document.querySelectorAll('.glow-card');

  glowCards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', x + 'px');
      card.style.setProperty('--mouse-y', y + 'px');
    });
  });

  /* --- Neural Network Canvas Animation --- */
  var canvas = document.getElementById('neuralCanvas');
  if (canvas) {
    var ctx = canvas.getContext('2d');
    var nodes = [];
    var nodeCount = 28;
    var animId;
    var dpr = window.devicePixelRatio || 1;

    function resizeCanvas() {
      var parent = canvas.parentElement;
      var w = parent.clientWidth;
      var h = parent.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.scale(dpr, dpr);
      return { w: w, h: h };
    }

    function initNodes() {
      var size = resizeCanvas();
      nodes = [];
      for (var i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * size.w,
          y: Math.random() * size.h,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          r: 3 + Math.random() * 4,
          pulse: Math.random() * Math.PI * 2
        });
      }
    }

    function drawFrame() {
      var w = canvas.width / dpr;
      var h = canvas.height / dpr;

      ctx.clearRect(0, 0, w, h);

      // Update positions
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += 0.02;

        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }

      // Draw connections
      var maxDist = 140;
      for (var i = 0; i < nodes.length; i++) {
        for (var j = i + 1; j < nodes.length; j++) {
          var dx = nodes[i].x - nodes[j].x;
          var dy = nodes[i].y - nodes[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            var alpha = (1 - dist / maxDist) * 0.35;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = 'rgba(124, 58, 237, ' + alpha + ')';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        var pulseR = n.r + Math.sin(n.pulse) * 1.5;

        // Glow
        ctx.beginPath();
        ctx.arc(n.x, n.y, pulseR + 6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(124, 58, 237, 0.08)';
        ctx.fill();

        // Node
        ctx.beginPath();
        ctx.arc(n.x, n.y, pulseR, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(124, 58, 237, ' + (0.5 + Math.sin(n.pulse) * 0.3) + ')';
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(n.x, n.y, pulseR * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fill();
      }

      animId = requestAnimationFrame(drawFrame);
    }

    initNodes();
    drawFrame();

    window.addEventListener('resize', function () {
      cancelAnimationFrame(animId);
      initNodes();
      drawFrame();
    });
  }

  /* --- FAQ Accordion --- */
  document.querySelectorAll('.faq__question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq__item');
      var isActive = item.classList.contains('active');

      // Close all
      document.querySelectorAll('.faq__item.active').forEach(function (el) {
        el.classList.remove('active');
      });

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  /* --- Modal Popup --- */
  var overlay = document.getElementById('modalOverlay');
  var modalClose = document.getElementById('modalClose');
  var modalForm = document.getElementById('modalForm');
  var modalSuccess = document.getElementById('modalSuccess');

  function openModal(e) {
    if (e) e.preventDefault();
    overlay.classList.add('active');
    modalForm.style.display = '';
    modalSuccess.style.display = 'none';
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Bind all "Записаться" buttons
  document.querySelectorAll('.open-modal').forEach(function (btn) {
    btn.addEventListener('click', openModal);
  });

  // Close on X
  modalClose.addEventListener('click', closeModal);

  // Close on overlay click
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  // Form submit — webhook
  // TODO: заменить на реальный n8n webhook URL
  // TODO: активировать workflow в n8n UI (тогл Active)
  var WEBHOOK_URL = 'https://ubuntu.tailfac63b.ts.net/webhook/intensive';

  modalForm.addEventListener('submit', function (e) {
    e.preventDefault();

    var name = document.getElementById('modalName').value.trim();
    var phone = document.getElementById('modalPhone').value.trim();

    // Send to webhook (fire-and-forget with fallback)
    fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name, phone: phone, source: 'intensive-landing' })
    }).catch(function () {
      // Webhook unavailable — still show success to user
    });

    // Show success immediately
    modalForm.style.display = 'none';
    modalSuccess.style.display = 'block';
    setTimeout(closeModal, 2500);
  });
  /* --- Testimonials: drag-to-scroll + arrows + click-to-play --- */
  var track = document.getElementById('testimonialsTrack');
  if (track) {
    var scrollAmount = 300;
    var isDragging = false;
    var dragStartX, dragScrollLeft, hasDragged;

    // Arrow buttons
    var leftBtn = document.getElementById('testimonialsLeft');
    var rightBtn = document.getElementById('testimonialsRight');

    if (leftBtn) {
      leftBtn.addEventListener('click', function () {
        track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      });
    }
    if (rightBtn) {
      rightBtn.addEventListener('click', function () {
        track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      });
    }

    // Drag-to-scroll (desktop)
    track.addEventListener('mousedown', function (e) {
      isDragging = true;
      hasDragged = false;
      track.style.cursor = 'grabbing';
      dragStartX = e.pageX;
      dragScrollLeft = track.scrollLeft;
    });

    track.addEventListener('mouseleave', function () { isDragging = false; track.style.cursor = 'grab'; });
    track.addEventListener('mouseup', function () { isDragging = false; track.style.cursor = 'grab'; });
    track.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      e.preventDefault();
      var dx = e.pageX - dragStartX;
      if (Math.abs(dx) > 5) hasDragged = true;
      track.scrollLeft = dragScrollLeft - dx;
    });

    // Click thumbnail → load iframe (skip if dragged)
    track.addEventListener('click', function (e) {
      if (hasDragged) return;
      var card = e.target.closest('.testimonials__video');
      if (!card || card.querySelector('iframe')) return;
      var videoId = card.dataset.videoId;
      if (!videoId) return;
      card.innerHTML = '<iframe src="https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0" allow="autoplay; encrypted-media" allowfullscreen></iframe>';
    });
  }

  /* --- Countdown Timer --- */
  var countdownEl = document.getElementById('countdown');
  if (countdownEl) {
    // 25 апреля 2026, 10:00 Алматы (UTC+5)
    var targetDate = new Date('2026-04-25T10:00:00+05:00').getTime();

    var daysEl = document.getElementById('countDays');
    var hoursEl = document.getElementById('countHours');
    var minsEl = document.getElementById('countMins');
    var secsEl = document.getElementById('countSecs');
    var labelEl = countdownEl.querySelector('.countdown__label');

    function pad(n) { return n < 10 ? '0' + n : String(n); }

    function updateCountdown() {
      var now = Date.now();
      var diff = targetDate - now;

      if (diff <= 0) {
        labelEl.textContent = 'Интенсив начался!';
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minsEl.textContent = '00';
        secsEl.textContent = '00';
        return;
      }

      var d = Math.floor(diff / 86400000);
      var h = Math.floor((diff % 86400000) / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var s = Math.floor((diff % 60000) / 1000);

      daysEl.textContent = pad(d);
      hoursEl.textContent = pad(h);
      minsEl.textContent = pad(m);
      secsEl.textContent = pad(s);
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }
})();
