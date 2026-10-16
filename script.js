
/* =====================================
   HOLY YOUTH MOVEMENT — 2027
   GLITCH LAB / EXPERIMENT 001
   ===================================== */

document.addEventListener("DOMContentLoaded", () => {

  const body = document.body;
  const root = document.documentElement;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  let touching = false;
  let lastTouchY = 0;
  let lastScrollY = window.scrollY;
  let lastScrollTime = performance.now();

  let intensity = 0;
  let lastInteraction = 0;
  let lastFrame = 0;

  const MAX_INTENSITY = 35;
  const RELEASE_DELAY = 120;
  const FADE_SPEED = 0.88;

  // Apply horizontal RGB displacement

  function updateGlitch() {

    const amount = intensity;

    const random = (range) =>
      (Math.random() * 2 - 1) * range;

    root.style.setProperty(
      "--glitch-x",
      `${random(amount).toFixed(2)}px`
    );

    root.style.setProperty(
      "--glitch-x-alt",
      `${random(amount).toFixed(2)}px`
    );

    root.style.setProperty(
      "--glitch-y",
      `${random(amount * 0.25).toFixed(2)}px`
    );

    root.style.setProperty(
      "--glitch-y-alt",
      `${random(amount * 0.25).toFixed(2)}px`
    );
  }

  // Increase distortion intensity

  function triggerGlitch(amount) {

    if (reducedMotion.matches) return;

    intensity = Math.min(
      MAX_INTENSITY,
      Math.max(intensity, amount)
    );

    lastInteraction = performance.now();

    body.classList.add("is-glitching");
  }

  // Touch movement

  window.addEventListener("touchstart", (event) => {

    touching = true;

    lastTouchY = event.touches[0].clientY;

  }, { passive: true });

  window.addEventListener("touchmove", (event) => {

    if (!touching) return;

    const currentY = event.touches[0].clientY;

    const movement = Math.abs(
      currentY - lastTouchY
    );

    lastTouchY = currentY;

    triggerGlitch(
      Math.min(MAX_INTENSITY, movement * 2)
    );

  }, { passive: true });

  window.addEventListener("touchend", () => {

    touching = false;
    lastInteraction = performance.now();

  }, { passive: true });

  window.addEventListener("touchcancel", () => {

    touching = false;
    lastInteraction = performance.now();

  }, { passive: true });

  // Scroll velocity detection

  window.addEventListener("scroll", () => {

    const now = performance.now();

    const distance = Math.abs(
      window.scrollY - lastScrollY
    );

    const elapsed = Math.max(
      1,
      now - lastScrollTime
    );

    const velocity = distance / elapsed;

    lastScrollY = window.scrollY;
    lastScrollTime = now;

    triggerGlitch(
      Math.min(MAX_INTENSITY, velocity * 12)
    );

  }, { passive: true });

  // Animation loop

  function animate(timestamp) {

    requestAnimationFrame(animate);

    if (reducedMotion.matches) {
      body.classList.remove("is-glitching");
      intensity = 0;
      return;
    }

    // Limit glitch updates to roughly 30fps

    if (timestamp - lastFrame < 33) return;
    lastFrame = timestamp;

    const timeSinceInteraction =
      timestamp - lastInteraction;

    if (
      !touching &&
      timeSinceInteraction > RELEASE_DELAY
    ) {
      intensity *= FADE_SPEED;
    }

    if (intensity < 0.5) {

      intensity = 0;

      body.classList.remove("is-glitching");

    } else {

      body.classList.add("is-glitching");

      updateGlitch();
    }
  }

  requestAnimationFrame(animate);

});
