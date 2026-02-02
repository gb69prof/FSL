
// Scopri – logica pagina (media nel drawer di sezione 1)

const SECTIONS = [
  {
    title: "Villaggio neolitico",
    cover: "assets/img/IMG_4125.png",
    textFile: "assets/text/villaggio.txt"
  },
  {
    title: "Primo nucleo medievale",
    cover: "assets/img/IMG_4123.jpeg",
    textFile: "assets/text/villaggio.txt" // placeholder: sostituisci quando avrai medievale.txt
  },
  {
    title: "Ricostruzione del Settecento",
    cover: "assets/img/IMG_4122.png",
    textFile: "assets/text/villaggio.txt"
  },
  {
    title: "Vie dell’Ottocento",
    cover: "assets/img/IMG_4121.png",
    textFile: "assets/text/villaggio.txt"
  },
  {
    title: "Nuovi parchi",
    cover: "assets/img/IMG_4120.png",
    textFile: "assets/text/villaggio.txt"
  }
];

// Galleria immagini (puoi aggiungerne/riordinarne liberamente)
const GALLERY_IMAGES = [
  "assets/img/IMG_4125.png",
  "assets/img/IMG_4123.jpeg",
  "assets/img/IMG_4122.png",
  "assets/img/IMG_4121.png",
  "assets/img/IMG_4120.png",
  "assets/img/IMG_4118.jpeg",
  "assets/img/IMG_4117.jpeg",
  "assets/img/IMG_4116.jpeg"
];

const CHATBOT_URL = "https://chatgpt.com/g/g-PWnQHYd8S-leopardi-s-echo";
const MAP_LAT = 41.458024;
const MAP_LNG = 15.563664;
const YT_VIDEO_ID = "jQPxf3NOF0w";

let currentIndex = 0;

// Drawer helpers
const drawer = () => document.getElementById("drawer");
const drawerBody = () => document.getElementById("drawer-body");
const drawerLabel = () => document.getElementById("drawer-label");

function openDrawer(label, html) {
  drawerLabel().textContent = label;
  drawerBody().innerHTML = html;
  drawer().hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function closeDrawer() {
  drawerBody().innerHTML = "";
  drawer().hidden = true;
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[c]));
}

// ===== YouTube (ended => restore cover without autoplay) =====
let ytPlayer = null;

function loadYouTubeAPI() {
  return new Promise((resolve) => {
    if (window.YT && window.YT.Player) { resolve(); return; }
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
    window.onYouTubeIframeAPIReady = () => resolve();
  });
}

function destroyPlayer() {
  if (ytPlayer) { try { ytPlayer.destroy(); } catch(e) {} ytPlayer = null; }
}

async function openVideo() {
  destroyPlayer();
  openDrawer("Video", `<div style="width:100%;height:100%" id="yt-player"></div>`);
  await loadYouTubeAPI();
  ytPlayer = new YT.Player("yt-player", {
    videoId: YT_VIDEO_ID,
    width: "100%",
    height: "100%",
    playerVars: { autoplay: 1, controls: 1, rel: 0, modestbranding: 1 },
    events: {
      onStateChange: (event) => {
        if (event.data === 0) { // ended
          destroyPlayer();
          const s = SECTIONS[currentIndex];
          openDrawer("Immagine", `<img class="media-img" src="${s.cover}" alt="copertina">`);
        }
      }
    }
  });
}

// ===== Sketchfab =====
function open3D() {
  destroyPlayer();
  openDrawer("3D", `
    <iframe class="media-frame"
      title="Villaggio Campi Diomedei - Foggia"
      frameborder="0"
      allowfullscreen
      mozallowfullscreen="true"
      webkitallowfullscreen="true"
      allow="autoplay; fullscreen; xr-spatial-tracking"
      xr-spatial-tracking
      execution-while-out-of-viewport
      execution-while-not-rendered
      web-share
      src="https://sketchfab.com/models/0a306cc6e14647f1960cd30c82fe0b2c/embed">
    </iframe>
  `);
}

// ===== Maps =====
function openMap() {
  destroyPlayer();
  const src = `https://www.google.com/maps?q=${MAP_LAT},${MAP_LNG}&z=16&output=embed`;
  openDrawer("Mappa", `
    <iframe class="media-frame"
      title="Mappa Campi Diomedei"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
      src="${src}">
    </iframe>
  `);
}

// ===== Gallery (sequenza + thumbnails) =====
let galleryIndex = 0;

function buildThumbs() {
  return GALLERY_IMAGES.map((src, i) => {
    const cls = i === galleryIndex ? "active" : "";
    return `<img src="${src}" data-i="${i}" class="${cls}" alt="thumb">`;
  }).join("");
}

function renderGallery() {
  const img = GALLERY_IMAGES[galleryIndex];
  openDrawer("Galleria", `
    <div class="gallery-ui">
      <img class="media-img" id="gal-img" src="${img}" alt="immagine galleria">
      <div class="gal-controls">
        <button class="gal-btn" id="gal-prev" aria-label="precedente">◀</button>
        <button class="gal-btn" id="gal-next" aria-label="successiva">▶</button>
      </div>
      <div class="thumb-strip" id="thumb-strip">
        ${buildThumbs()}
      </div>
    </div>
  `);

  document.getElementById("gal-prev").onclick = () => { galleryIndex = (galleryIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length; renderGallery(); };
  document.getElementById("gal-next").onclick = () => { galleryIndex = (galleryIndex + 1) % GALLERY_IMAGES.length; renderGallery(); };
  document.querySelectorAll("#thumb-strip img").forEach((t) => {
    t.onclick = () => { galleryIndex = Number(t.dataset.i); renderGallery(); };
  });

  const galImg = document.getElementById("gal-img");
  let x0 = null;
  galImg.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, {passive:true});
  galImg.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const x1 = e.changedTouches[0].clientX;
    const dx = x1 - x0;
    x0 = null;
    if (Math.abs(dx) < 40) return;
    if (dx < 0) { galleryIndex = (galleryIndex + 1) % GALLERY_IMAGES.length; }
    else { galleryIndex = (galleryIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length; }
    renderGallery();
  }, {passive:true});
}

function openGallery() {
  destroyPlayer();
  galleryIndex = 0;
  renderGallery();
}

// ===== Text loader =====
async function loadText(file) {
  const res = await fetch(file);
  if (!res.ok) throw new Error("Errore caricamento testo");
  const txt = await res.text();
  const parts = txt.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  const html = parts.map(p => `<p>${escapeHtml(p).replace(/\n/g, "<br>")}</p>`).join("");
  return `<h2>${escapeHtml(SECTIONS[currentIndex].title)}</h2>${html}`;
}

// ===== Section render =====
async function renderSection(idx) {
  currentIndex = idx;
  const s = SECTIONS[currentIndex];

  document.getElementById("page-title").textContent = s.title;
  const cover = document.getElementById("cover-img");
  cover.src = s.cover;
  cover.alt = s.title;

  document.querySelectorAll(".tappa").forEach((b) => b.classList.toggle("active", Number(b.dataset.idx) === idx));

  const tb = document.getElementById("textbox");
  tb.innerHTML = `<div class="loading">Caricamento testo…</div>`;
  try {
    tb.innerHTML = await loadText(s.textFile);
    tb.scrollTop = 0;
  } catch (e) {
    tb.innerHTML = `<div class="loading">Testo non disponibile.</div>`;
  }

  if (!drawer().hidden && drawerLabel().textContent === "Immagine") {
    openDrawer("Immagine", `<img class="media-img" src="${s.cover}" alt="copertina">`);
  }
}

function init() {
  document.getElementById("drawer-close").addEventListener("click", () => {
    destroyPlayer();
    closeDrawer();
  });

  document.getElementById("btn-guide").addEventListener("click", () => {
    window.open(CHATBOT_URL, "_blank", "noopener");
  });

  document.getElementById("btn-video").addEventListener("click", openVideo);
  document.getElementById("btn-gallery").addEventListener("click", openGallery);
  document.getElementById("btn-3d").addEventListener("click", open3D);
  document.getElementById("btn-map").addEventListener("click", openMap);

  document.querySelectorAll(".tappa").forEach((b) => {
    b.addEventListener("click", () => renderSection(Number(b.dataset.idx)));
  });

  renderSection(0);
}

document.addEventListener("DOMContentLoaded", init);
