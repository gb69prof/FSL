
const CHATBOT_URL = "https://chatgpt.com/g/g-PWnQHYd8S-leopardi-s-echo";
const MAP_LAT = 41.458024;
const MAP_LNG = 15.563664;
const YT_VIDEO_ID = "jQPxf3NOF0w";

const MEDIA_LABEL = document.getElementById("media-label");
const MEDIA_BODY  = document.getElementById("media2-body");
const RESET_BTN   = document.getElementById("media-reset");

const COVER_SRC = document.getElementById("cover-img").getAttribute("src");

const GALLERY_IMAGES = [
  "../assets/img/IMG_4125.png",
  "../assets/img/IMG_4123.jpeg",
  "../assets/img/IMG_4122.png",
  "../assets/img/IMG_4121.png",
  "../assets/img/IMG_4120.png",
  "../assets/img/IMG_4118.jpeg",
  "../assets/img/IMG_4117.jpeg",
  "../assets/img/IMG_4116.jpeg"
].filter(Boolean);

function setMediaLabel(t){ MEDIA_LABEL.textContent = t; }

function setCover(){
  destroyPlayer();
  setMediaLabel("Copertina");
  MEDIA_BODY.innerHTML = `<img class="media-img" id="cover-img" src="${COVER_SRC}" alt="copertina">`;
}

RESET_BTN.addEventListener("click", setCover);

// chatbot
document.getElementById("btn-guide").addEventListener("click", () => {
  window.open(CHATBOT_URL, "_blank", "noopener");
});

// ===== YouTube (ended => back to cover, no autoplay) =====
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
async function openVideo(){
  destroyPlayer();
  setMediaLabel("Video");
  MEDIA_BODY.innerHTML = `<div style="width:100%;height:100%" id="yt-player"></div>`;
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
          setCover(); // cover without autoplay
        }
      }
    }
  });
}
document.getElementById("btn-video").addEventListener("click", openVideo);

// ===== Gallery (sequenza) =====
let galleryIndex = 0;

function buildThumbs() {
  return GALLERY_IMAGES.map((src, i) => {
    const cls = i === galleryIndex ? "active" : "";
    return `<img src="${src}" data-i="${i}" class="${cls}" alt="thumb">`;
  }).join("");
}

function renderGallery(){
  setMediaLabel("Galleria");
  const img = GALLERY_IMAGES[galleryIndex] || COVER_SRC;
  MEDIA_BODY.innerHTML = `
    <div class="gallery-ui">
      <img class="media-img" id="gal-img" src="${img}" alt="immagine galleria">
      <div class="gal-controls">
        <button class="gal-btn" id="gal-prev" aria-label="precedente">◀</button>
        <button class="gal-btn" id="gal-next" aria-label="successiva">▶</button>
      </div>
      <div class="thumb-strip" id="thumb-strip">${buildThumbs()}</div>
    </div>
  `;

  document.getElementById("gal-prev").onclick = () => {
    galleryIndex = (galleryIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
    renderGallery();
  };
  document.getElementById("gal-next").onclick = () => {
    galleryIndex = (galleryIndex + 1) % GALLERY_IMAGES.length;
    renderGallery();
  };
  document.querySelectorAll("#thumb-strip img").forEach((t) => {
    t.onclick = () => { galleryIndex = Number(t.dataset.i); renderGallery(); };
  });

  // swipe mobile
  const galImg = document.getElementById("gal-img");
  let x0 = null;
  galImg.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, {passive:true});
  galImg.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const x1 = e.changedTouches[0].clientX;
    const dx = x1 - x0;
    x0 = null;
    if (Math.abs(dx) < 40) return;
    if (dx < 0) galleryIndex = (galleryIndex + 1) % GALLERY_IMAGES.length;
    else galleryIndex = (galleryIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
    renderGallery();
  }, {passive:true});
}

document.getElementById("btn-gallery").addEventListener("click", () => {
  destroyPlayer();
  galleryIndex = 0;
  renderGallery();
});

// ===== Sketchfab (3D) =====
function open3D(){
  destroyPlayer();
  setMediaLabel("3D");
  MEDIA_BODY.innerHTML = `
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
  `;
}
document.getElementById("btn-3d").addEventListener("click", open3D);

// ===== Google Maps =====
function openMap(){
  destroyPlayer();
  setMediaLabel("Mappa");
  const src = `https://www.google.com/maps?q=${MAP_LAT},${MAP_LNG}&z=16&output=embed`;
  MEDIA_BODY.innerHTML = `
    <iframe class="media-frame"
      title="Mappa Campi Diomedei"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
      src="${src}">
    </iframe>
  `;
}
document.getElementById("btn-map").addEventListener("click", openMap);

// ===== Text loader (villaggio.txt) =====
function escapeHtml(s){
  return s.replace(/[&<>"']/g, (c) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}

async function loadText(){
  const tb = document.getElementById("textbox");
  tb.innerHTML = `<div class="loading">Caricamento testo…</div>`;
  try{
    const res = await fetch("../assets/text/villaggio.txt");
    const txt = await res.text();
    const parts = txt.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
    const html = parts.map(p => `<p>${escapeHtml(p).replace(/\n/g,"<br>")}</p>`).join("");
    tb.innerHTML = `<h2>Villaggio neolitico</h2>${html}`;
    tb.scrollTop = 0;
  }catch(e){
    tb.innerHTML = `<div class="loading">Testo non disponibile.</div>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setCover();
  loadText();
});
