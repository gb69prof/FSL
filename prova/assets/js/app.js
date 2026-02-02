// load text
fetch('assets/text/villaggio.txt')
  .then(r => r.text())
  .then(t => document.getElementById('textContent').textContent = t);

const media = document.getElementById('media');

function resetMedia(html) {
  media.innerHTML = html;
}

function openVideo() {
  resetMedia(`<iframe src="https://www.youtube.com/embed/jQPxf3NOF0w"
    allowfullscreen></iframe>`);
}

function openGallery() {
  const imgs = Array.from(document.querySelectorAll('.gallery-img'));
  let i = 0;
  resetMedia(`<img src="assets/images/IMG_4125.png" id="gimg">`);
}

function open3D() {
  resetMedia(`<iframe src="https://sketchfab.com/models/0a306cc6e14647f1960cd30c82fe0b2c/embed"
    allowfullscreen></iframe>`);
}

function openMap() {
  resetMedia(`<iframe
    src="https://www.google.com/maps?q=41.458024,15.563664&z=16&output=embed"></iframe>`);
}
