
// ===== Data =====
const SECTIONS = [
  {
    id: "neolitico",
    name: "Villaggio neolitico",
    title: "Villaggio neolitico",
    textHtml: `<p>Nel cuore della moderna Foggia, sotto il verde del nuovo Parco dei Campi Diomedei, dorme un segreto antico di oltre ottomila anni.</p><p>Qui, molto prima dei Dauni, prima dei Romani, prima ancora della scrittura… vivevano i primi abitanti del Tavoliere. Genti silenziose, agricoltori e allevatori, costruirono un villaggio: circondato da fossati, fatto di capanne in legno e fango, di pietre levigate e fuochi accesi all’alba.</p><p>In queste terre fertili, coltivavano grano antico, raccoglievano legumi, curavano il fuoco, e seppellivano i loro morti con rispetto e riti antichi. Come “Siro”, l’uomo più antico della Daunia, ritrovato proprio qui, con il suo corredo funebre, sdraiato sotto la terra che lo aveva nutrito in vita.</p><p>Questa è la Foggia neolitica. Invisibile agli occhi, ma profondamente viva nella memoria del suolo. Un villaggio trincerato, testimone del passaggio dalla preistoria alla civiltà.</p><p>Oggi passeggiamo tra viali alberati e piazze verdi… ma sotto i nostri passi pulsa la prima storia di questa città. Ogni pietra, ogni ciottolo, ogni seme racconta una vita vissuta millenni fa.</p><p>I Campi Diomedei non sono solo un parco: sono un ponte nel tempo. Un luogo dove la Foggia di oggi incontra le sue origini, dove il presente abbraccia il mistero delle sue radici.</p><p>Scopri la prima Foggia. Ascolta la sua voce antica.</p>`,
    heroImage: "assets/images/IMG_4125.png"
  },
  {
    id: "medievale",
    name: "Primo nucleo medievale",
    title: "Primo nucleo medievale",
    textHtml: `<p>Contenuti in preparazione.</p><p>Qui inseriremo immagini, testo, video e materiali per il percorso medievale.</p>`,
    heroImage: "assets/images/IMG_4125.png"
  },
  {
    id: "settecento",
    name: "Ricostruzione del Settecento",
    title: "Ricostruzione del Settecento",
    textHtml: `<p>Contenuti in preparazione.</p>`,
    heroImage: "assets/images/IMG_4125.png"
  },
  {
    id: "ottocento",
    name: "Le vie dell’Ottocento",
    title: "Le vie dell’Ottocento",
    textHtml: `<p>Contenuti in preparazione.</p>`,
    heroImage: "assets/images/IMG_4125.png"
  },
  {
    id: "parchi",
    name: "I nuovi parchi",
    title: "I nuovi parchi",
    textHtml: `<p>Contenuti in preparazione.</p>`,
    heroImage: "assets/images/IMG_4125.png"
  },
];

const GALLERY_IMAGES = ["assets/images/IMG_4125.png", "assets/images/IMG_4123.jpeg", "assets/images/IMG_4122.png", "assets/images/IMG_4121.png", "assets/images/IMG_4120.png", "assets/images/IMG_4118.jpeg", "assets/images/IMG_4117.jpeg", "assets/images/IMG_4116.jpeg"];

// ===== YouTube =====
// ===== YouTube =====
const YT_VIDEO_ID = "jQPxf3NOF0w";
let ytPlayer = null;
let ytReady = false;

function loadYouTubeAPI() {
  return new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      ytReady = true;
      resolve();
      return;
    }
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
    window.onYouTubeIframeAPIReady = () => {
      ytReady = true;
      resolve();
    };
  });
}

function destroyPlayer() {
  if (ytPlayer) {
    try { ytPlayer.destroy(); } catch(e){}
    ytPlayer = null;
  }
}

function hideGalleryStrip() {
  const strip = document.getElementById("gallery-strip");
  strip.style.display = "none";
}

function showGalleryStrip() {
  const strip = document.getElementById("gallery-strip");
  strip.style.display = "block";
}

function showImage(src, keepStrip = false) {
  destroyPlayer();
  const media = document.getElementById("media-inner");
  media.innerHTML = `<img src="${src}" alt="immagine sezione">`;
  if (!keepStrip) hideGalleryStrip();
}

async function showVideo() {
  hideGalleryStrip();
  const media = document.getElementById("media-inner");
  media.innerHTML = `<div id="yt-player" style="width:100%;height:100%;"></div>`;
  await loadYouTubeAPI();
  ytPlayer = new YT.Player("yt-player", {
    videoId: YT_VIDEO_ID,
    width: "100%",
    height: "100%",
    playerVars: {
      autoplay: 1,
      controls: 1,
      rel: 0,
      modestbranding: 1
    },
    events: {
      onStateChange: (event) => {
        // 0 = ended
        if (event.data === 0) {
          // When video ends: go back to image, do NOT autoplay
          const s = getCurrentSection();
          showImage(s.heroImage);
        }
      }
    }
  });
}

function showSketchfab() {
  hideGalleryStrip();
  destroyPlayer();
  const media = document.getElementById("media-inner");
  media.innerHTML = `
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

function showMap() {
  hideGalleryStrip();
  destroyPlayer();
  const media = document.getElementById("media-inner");
  // Google Maps embed centered at given coordinates
  const lat = 41.458024;
  const lng = 15.563664;
  const src = `https://www.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
  media.innerHTML = `
    <iframe class="media-frame"
      title="Mappa Campi Diomedei"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
      src="${src}">
    </iframe>
  `;
}

function openGallery() {
  // Open images directly (no Sketchfab). Show the strip and set the media to the first image.
  showGalleryStrip();
  // Default: show section hero image as first (more coerente), then thumbnails can change it.
  const s = getCurrentSection();
  showImage(s.heroImage, true);
}

function showGalleryImage(src) {
  // Keep gallery strip visible while switching images
  showImage(src, true);
}

function open3D() {
  showSketchfab();
}

function openGuide() {
  window.open("https://chatgpt.com/g/g-PWnQHYd8S-leopardi-s-echo", "_blank", "noopener");
}

// ===== Section switching =====
let currentIndex = 0;

function getCurrentSection() {
  return SECTIONS[currentIndex];
}

function renderSection(index) {
  currentIndex = index;
  const s = getCurrentSection();

  // Update title + text
  document.getElementById("section-title").textContent = s.title;
  const box = document.getElementById("text-box");
  box.innerHTML = s.textHtml;
  box.scrollTop = 0;

  // Reset media to image
  showImage(s.heroImage);

  // Update sidebar active
  document.querySelectorAll(".side-item").forEach((el, i) => {
    el.classList.toggle("active", i === index);
  });

  // Update bottom pills active
  document.querySelectorAll(".pill").forEach((el, i) => {
    el.classList.toggle("active", i === index);
  });
}

function buildGalleryThumbnails() {
  const scroller = document.getElementById("scroller");
  scroller.innerHTML = "";
  GALLERY_IMAGES.forEach((src) => {
    const d = document.createElement("div");
    d.className = "thumb";
    d.innerHTML = `<img src="${src}" alt="immagine galleria">`;
    d.addEventListener("click", () => {
      showGalleryImage(src);
    });
    scroller.appendChild(d);
  });
}

function init() {
  // Sidebar click handlers
  document.querySelectorAll(".side-item").forEach((el) => {
    el.addEventListener("click", () => {
      const idx = Number(el.dataset.idx);
      renderSection(idx);
    });
  });

  // Bottom pills
  document.querySelectorAll(".pill").forEach((el) => {
    el.addEventListener("click", () => {
      const idx = Number(el.dataset.idx);
      renderSection(idx);
    });
  });

  // Actions
  document.getElementById("btn-video").addEventListener("click", showVideo);
  document.getElementById("btn-gallery").addEventListener("click", openGallery);
  document.getElementById("btn-3d").addEventListener("click", open3D);
  document.getElementById("btn-map").addEventListener("click", showMap);
  document.getElementById("btn-guide").addEventListener("click", openGuide);

  buildGalleryThumbnails();
  renderSection(0);
}

document.addEventListener("DOMContentLoaded", init);


let galleryIndex = 0;

function showGalleryControls() {
  const media = document.getElementById("media-inner");
  if (!document.getElementById("gallery-controls")) {
    const controls = document.createElement("div");
    controls.id = "gallery-controls";
    controls.innerHTML = `
      <button id="gal-prev" aria-label="precedente">◀</button>
      <button id="gal-next" aria-label="successiva">▶</button>
    `;
    media.appendChild(controls);

    document.getElementById("gal-prev").onclick = () => navigateGallery(-1);
    document.getElementById("gal-next").onclick = () => navigateGallery(1);
  }
}

function navigateGallery(step) {
  galleryIndex = (galleryIndex + step + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
  showGalleryImage(GALLERY_IMAGES[galleryIndex]);
  showGalleryControls();
}

// Override openGallery to enable sequence
const _openGallery = openGallery;
openGallery = function () {
  galleryIndex = 0;
  showGalleryStrip();
  showGalleryImage(GALLERY_IMAGES[galleryIndex]);
  showGalleryControls();
};
