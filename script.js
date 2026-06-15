// script.js — extracted and modularized JavaScript for tributo-bar-kblo

// Helper: format seconds to M:SS
function formatTime(seconds) {
  const m = Math.floor(seconds / 60) || 0;
  const s = Math.floor(seconds % 60) || 0;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// NAV / UI
function toggleMenu() {
  const nav = document.getElementById('navLinks');
  const icon = document.getElementById('menuIcon');
  nav.classList.toggle('active');
  if (icon) icon.classList.toggle('fa-times');
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// MODAL
function openModal(src) {
  const modal = document.getElementById('imageModal');
  const img = document.getElementById('modalImage');
  if (!modal || !img) return;
  img.src = src;
  modal.classList.add('active');
}

function closeModal(e) {
  const modal = document.getElementById('imageModal');
  if (!modal) return;
  modal.classList.remove('active');
}

// SIMPLE ADMIN / CONTACT (placeholder behaviour)
function contatarAdmin() {
  window.location.href = 'mailto:contato@example.com?subject=Contato%20-%20Tributo%20Bar%20do%20Kblo';
}

function promptAdmin() {
  const pwd = prompt('Painel administrativo — insira a senha (apenas demo)');
  if (pwd === null) return;
  if (pwd === 'admin') {
    alert('Acesso concedido (demo).');
  } else {
    alert('Senha incorreta.');
  }
}

// SHARING
function compartilharFacebook() {
  const url = encodeURIComponent(window.location.href);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
}
function compartilharWhatsApp() {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent('Tributo ao Bar do Kblo — confira! ' + window.location.href);
  window.open(`https://wa.me/?text=${text}`, '_blank');
}
function compartilharTwitter() {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent('Tributo ao Bar do Kblo');
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
}

// AUDIO PLAYER
const AudioPlayer = (function () {
  let audio, playBtn, slider, currentTimeEl, durationEl, volumeSlider, volumeIcon, contadorEl;

  function init() {
    audio = document.getElementById('meuAudio');
    playBtn = document.getElementById('playBtn');
    slider = document.getElementById('audioSlider');
    currentTimeEl = document.getElementById('currentTime');
    durationEl = document.getElementById('durationTime');
    volumeSlider = document.getElementById('volumeSlider');
    volumeIcon = document.getElementById('volumeIcon');
    contadorEl = document.getElementById('contadorReproducoes');

    if (!audio) return;

    if (volumeSlider) audio.volume = (volumeSlider.value || 80) / 100;

    audio.addEventListener('loadedmetadata', () => {
      if (durationEl) durationEl.textContent = formatTime(audio.duration);
      if (slider) slider.max = Math.floor(audio.duration);
    });

    audio.addEventListener('timeupdate', () => {
      if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
      if (slider && !slider.dragging) slider.value = Math.floor(audio.currentTime);
    });

    audio.addEventListener('ended', () => {
      setPlayIcon(false);
    });

    if (playBtn) playBtn.addEventListener('click', toggleAudio);
    if (slider) {
      slider.addEventListener('input', seekAudio);
      slider.addEventListener('mousedown', () => slider.dragging = true);
      slider.addEventListener('mouseup', () => slider.dragging = false);
    }
    if (volumeSlider) volumeSlider.addEventListener('input', changeVolume);
    if (volumeIcon) volumeIcon.addEventListener('click', toggleMute);
  }

  function setPlayIcon(isPlaying) {
    if (!playBtn) return;
    const i = playBtn.querySelector('i');
    if (!i) return;
    i.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
  }

  function toggleAudio() {
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {});
      setPlayIcon(true);
      incrementPlayCount();
    } else {
      audio.pause();
      setPlayIcon(false);
    }
  }

  function seekAudio() {
    if (!audio || !slider) return;
    audio.currentTime = Number(slider.value);
    if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
  }

  function changeVolume() {
    if (!audio || !volumeSlider) return;
    audio.volume = Number(volumeSlider.value) / 100;
    if (audio.volume === 0) {
      if (volumeIcon) volumeIcon.className = 'fas fa-volume-mute';
    } else {
      if (volumeIcon) volumeIcon.className = 'fas fa-volume-up';
    }
  }

  function toggleMute() {
    if (!audio) return;
    audio.muted = !audio.muted;
    if (volumeIcon) volumeIcon.className = audio.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
    if (volumeSlider) volumeSlider.value = audio.muted ? 0 : audio.volume * 100;
  }

  function incrementPlayCount() {
    try {
      const key = 'contadorReproducoes';
      let count = Number(localStorage.getItem(key) || '0');
      count += 1;
      localStorage.setItem(key, String(count));
      if (contadorEl) contadorEl.textContent = String(count);
    } catch (e) {}
  }

  function restoreCount() {
    try {
      const key = 'contadorReproducoes';
      const count = Number(localStorage.getItem(key) || '0');
      if (contadorEl) contadorEl.textContent = String(count);
    } catch (e) {}
  }

  return { init, toggleAudio, seekAudio, changeVolume, toggleMute, restoreCount };
})();

// TESTIMONIALS & PHOTOS (local demo store)
const StorageApp = (function () {
  const TEST_KEY = 'kblo_testimonials';
  const PHOTOS_KEY = 'kblo_photos';

  function saveTestimonial(t) {
    const arr = loadTestimonials();
    arr.unshift(t);
    localStorage.setItem(TEST_KEY, JSON.stringify(arr));
  }

  function loadTestimonials() {
    try {
      return JSON.parse(localStorage.getItem(TEST_KEY) || '[]');
    } catch (e) { return []; }
  }

  function savePhoto(p) {
    const arr = loadPhotos();
    arr.unshift(p);
    localStorage.setItem(PHOTOS_KEY, JSON.stringify(arr));
  }

  function loadPhotos() {
    try { return JSON.parse(localStorage.getItem(PHOTOS_KEY) || '[]'); } catch (e) { return []; }
  }

  return { saveTestimonial, loadTestimonials, savePhoto, loadPhotos };
})();

function renderTestimonials() {
  const grid = document.getElementById('testimonialsGrid');
  if (!grid) return;
  grid.innerHTML = '';
  const items = StorageApp.loadTestimonials();
  if (items.length === 0) {
    grid.innerHTML = '<div class="loading">Seja o primeiro a deixar uma homenagem.</div>';
    return;
  }
  items.forEach(it => {
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    card.innerHTML = `
      <div class="testimonial-author">${escapeHtml(it.nome)}</div>
      <div class="testimonial-text">${escapeHtml(it.texto)}</div>
      <div class="testimonial-date">${new Date(it.createdAt).toLocaleString()}</div>
    `;
    grid.appendChild(card);
  });
}

function renderPhotos() {
  const grid = document.getElementById('fotosGrid');
  if (!grid) return;
  grid.innerHTML = '';
  const items = StorageApp.loadPhotos();
  if (items.length === 0) {
    grid.innerHTML = '<div class="loading">Nenhuma foto ainda.</div>';
    return;
  }
  items.forEach(it => {
    const card = document.createElement('div');
    card.className = 'foto-card';
    card.innerHTML = `
      <img src="${escapeHtml(it.src)}" alt="${escapeHtml(it.name)}" loading="lazy" class="responsive-img" onclick="openModal('${escapeHtml(it.src)}')">
      <div class="foto-overlay">
        <div class="foto-nome">${escapeHtml(it.name)}</div>
        <div class="foto-data">${new Date(it.createdAt).toLocaleDateString()}</div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// FORM: enviarDepoimento
function enviarDepoimento() {
  const nome = document.getElementById('nomeDepoimento');
  const texto = document.getElementById('textoDepoimento');
  const msg = document.getElementById('msgSucessoDepoimento');
  const btn = document.getElementById('btnDepoimento');
  if (!nome || !texto) return;

  const nomeVal = nome.value.trim();
  const textoVal = texto.value.trim();
  if (!nomeVal || !textoVal) {
    alert('Por favor preencha seu nome e a história antes de enviar.');
    return;
  }

  if (textoVal.length > 1000) {
    alert('O depoimento excede o limite de 1000 caracteres.');
    return;
  }

  btn.disabled = true;
  setTimeout(() => {
    const item = { nome: nomeVal, texto: textoVal, createdAt: new Date().toISOString() };
    StorageApp.saveTestimonial(item);
    if (msg) {
      msg.style.display = 'block';
      setTimeout(() => { msg.style.display = 'none'; }, 3500);
    }
    nome.value = '';
    texto.value = '';
    const charCount = document.getElementById('charCount');
    if (charCount) charCount.textContent = '0';
    renderTestimonials();
    btn.disabled = false;
  }, 700);
}

function setupCharCounter() {
  const texto = document.getElementById('textoDepoimento');
  const charCount = document.getElementById('charCount');
  if (!texto || !charCount) return;
  texto.addEventListener('input', () => {
    charCount.textContent = texto.value.length;
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function setupNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) navbar.classList.add('scrolled'); else navbar.classList.remove('scrolled');
  });
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Supabase if available (safe scaffold)
  const sb = window.getSupabase ? window.getSupabase() : null;
  if (sb) {
    // Example: you could fetch testimonials from Supabase here instead of localStorage
    // sb.from('testimonials').select('*').then(...)
    console.info('Supabase client available — consider migrating storage to backend.');
  }

  AudioPlayer.init();
  AudioPlayer.restoreCount();

  setupCharCounter();
  renderTestimonials();
  renderPhotos();
  setupNavbarScroll();

  const modal = document.getElementById('imageModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('modal-close')) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  if (StorageApp.loadTestimonials().length === 0) {
    StorageApp.saveTestimonial({ nome: 'Comunidade', texto: 'Memórias que permanecem.', createdAt: new Date().toISOString() });
  }

  if (StorageApp.loadPhotos().length === 0) {
    StorageApp.savePhoto({ name: 'Fachada do Bar', src: 'bar.jpg', createdAt: new Date().toISOString() });
    StorageApp.savePhoto({ name: 'Tributo', src: 'kblo.jpg', createdAt: new Date().toISOString() });
  }

  renderTestimonials();
  renderPhotos();
});
