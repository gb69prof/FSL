const viewer = document.getElementById("viewer");
const viewerTitle = document.getElementById("viewerTitle");
const viewerBody = document.getElementById("viewerBody");
const closeBtn = document.getElementById("viewerClose");

function openViewer(title, html) {
  viewerTitle.textContent = title;
  viewerBody.innerHTML = html;
  viewer.classList.add("open");
  // scroll to top so "sezione 1" is clearly visible
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function closeViewer(){
  viewer.classList.remove("open");
  viewerBody.innerHTML = "";
}

closeBtn.addEventListener("click", closeViewer);

async function loadText(){
  const out = document.getElementById("textContent");
  try{
    const res = await fetch("txt/villaggio.txt", { cache: "no-store" });
    if(!res.ok) throw new Error("HTTP " + res.status);
    const t = await res.text();
    out.textContent = t.trim();
  }catch(e){
    out.textContent = "Testo non disponibile. Controlla che txt/villaggio.txt sia presente nella cartella del sito.";
  }
}

function setup(){
  loadText();

  // Video
  document.getElementById("openVideo").addEventListener("click", () => {
    const url = "https://www.youtube-nocookie.com/embed/jQPxf3NOF0w";
    openViewer("Video", `<iframe class="frame" src="${url}" title="Video villaggio" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`);
  });

  // Sketchfab
  document.getElementById("openSketchfab").addEventListener("click", () => {
    const src = "https://sketchfab.com/models/0a306cc6e14647f1960cd30c82fe0b2c/embed";
    openViewer("Modello 3D (Sketchfab)", `<iframe class="frame" title="Villaggio Campi Diomedei - Foggia" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="${src}"></iframe>`);
  });

  // Map
  document.getElementById("openMap").addEventListener("click", () => {
    const lat = 41.458024, lng = 15.563664;
    const mapSrc = `https://www.google.com/maps?q=${lat},${lng}&z=17&output=embed`;
    openViewer("Mappa (Google Maps)", `<iframe class="frame" title="Mappa Campi Diomedei" src="${mapSrc}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`);
  });

  // Gallery thumbs (click any thumb)
  document.querySelectorAll("[data-gallery]").forEach(el => {
    el.addEventListener("click", () => {
      const src = el.getAttribute("data-gallery");
      const label = el.getAttribute("data-label") || "Immagine";
      openViewer(label, `<img class="image" src="${src}" alt="${label}">`);
    });
  });
}

document.addEventListener("DOMContentLoaded", setup);