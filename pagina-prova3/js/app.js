const mediaSlot = document.getElementById("mediaSlot");

const gallery = [
  { src: "assets/img/galleria_1.jpeg", label: "Galleria – immagine 1" },
  { src: "assets/img/galleria_2.jpeg", label: "Galleria – immagine 2" },
  { src: "assets/img/galleria_3.jpeg", label: "Galleria – immagine 3" },
  { src: "assets/img/galleria_4.png",  label: "Galleria – immagine 4" },
  { src: "assets/img/galleria_5.png",  label: "Galleria – immagine 5" }
];

function setMedia(html){
  mediaSlot.innerHTML = html;
}

function showCover(){
  setMedia(`<img src="assets/img/villaggio_cover.png" alt="Villaggio neolitico (copertina)"/>`);
}

function showGalleryCarousel(){
  const slides = gallery.map(g => `
    <div class="slide">
      <img src="${g.src}" alt="${g.label}">
    </div>
  `).join("");

  setMedia(`
    <div class="carousel" aria-label="Galleria immagini (scorri per cambiare)">
      ${slides}
    </div>
  `);
}

function showVideo(){
  const url = "https://www.youtube-nocookie.com/embed/jQPxf3NOF0w";
  setMedia(`<iframe class="frame" src="${url}" title="Video villaggio" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`);
}

function showSketchfab(){
  const src = "https://sketchfab.com/models/0a306cc6e14647f1960cd30c82fe0b2c/embed";
  setMedia(`<iframe class="frame" title="Villaggio Campi Diomedei - Foggia" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="${src}"></iframe>`);
}

function showMap(){
  const lat = 41.458024, lng = 15.563664;
  const mapSrc = `https://www.google.com/maps?q=${lat},${lng}&z=17&output=embed`;
  setMedia(`<iframe class="frame" title="Mappa Campi Diomedei" src="${mapSrc}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`);
}

async function loadText(){
  const out = document.getElementById("textContent");
  try{
    const res = await fetch("./txt/villaggio.txt", { cache: "no-store" });
    if(!res.ok) throw new Error("HTTP " + res.status);
    const t = await res.text();
    if(t && t.trim().length > 0){
      out.textContent = t.trim();
    }
  }catch(e){
    // Se apri in locale (file://) il fetch può fallire: resta il testo già presente nel DOM.
  }
}

function setup(){
  loadText();
  showCover();

  document.getElementById("openVideo").addEventListener("click", showVideo);
  document.getElementById("openGallery").addEventListener("click", showGalleryCarousel);
  document.getElementById("openSketchfab").addEventListener("click", showSketchfab);
  document.getElementById("openMap").addEventListener("click", showMap);
  document.getElementById("backCover").addEventListener("click", showCover);
}

document.addEventListener("DOMContentLoaded", setup);