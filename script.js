// Scroll-reveal animation
const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        observer.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// Company logos: local asset → company favicon → monogram initials.
// Drop your own images into assets/logos/ to override everything.
document.querySelectorAll(".logo").forEach((box) => {
  const img = box.querySelector("img");
  if (!img) return;
  const domain = box.dataset.domain;
  const initials = box.dataset.initials || "•";
  let triedFavicon = false;

  const showInitials = () => {
    img.remove();
    box.textContent = initials;
  };

  const fallback = () => {
    if (domain && !triedFavicon) {
      triedFavicon = true;
      img.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    } else {
      showInitials();
    }
  };

  img.addEventListener("error", fallback);

  // The favicon service returns a tiny globe placeholder instead of erroring
  // when it has no icon — treat anything under 32px as "no logo".
  img.addEventListener("load", () => {
    if (triedFavicon && img.naturalWidth < 32) showInitials();
  });

  // The local asset may have already 404'd before these listeners attached
  // (the error event doesn't re-fire), so check the current state too.
  if (img.complete && img.naturalWidth === 0) fallback();
});
