document.body.classList.add("mecha-cursor");

const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");
const hoverTargets = document.querySelectorAll(
  "a, button, .frame-box, .timeline-card, .record-card, .future-card, .soft-panel, .section-header"
);
const transitionLinks = document.querySelectorAll(".transition-link, .nav-btn");
const doorTransition = document.querySelector(".door-transition");
const soundToggle = document.getElementById("soundToggle");

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let ringX = mouseX;
let ringY = mouseY;
let soundEnabled = true;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (cursorDot) {
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  }
});

function animateCursor() {
  ringX += (mouseX - ringX) * 0.18;
  ringY += (mouseY - ringY) * 0.18;
  if (cursorRing) {
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();

hoverTargets.forEach((el) => {
  el.addEventListener("mouseenter", () => {
    cursorRing?.classList.add("is-hover");
    playHoverSound();
  });

  el.addEventListener("mouseleave", () => {
    cursorRing?.classList.remove("is-hover");
  });
});

document.addEventListener("mousedown", () => {
  if (cursorRing) {
    cursorRing.classList.remove("is-click");
    void cursorRing.offsetWidth;
    cursorRing.classList.add("is-click");
  }
  playClickSound();
});

transitionLinks.forEach((link) => {
  link.addEventListener("click", async (e) => {
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#")) return;

    e.preventDefault();
    await playDoorTransition();

    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    document.querySelectorAll(".nav-btn").forEach((btn) => btn.classList.remove("active"));
    if (link.classList.contains("nav-btn")) {
      link.classList.add("active");
    }
  });
});

if (soundToggle) {
  soundToggle.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    soundToggle.textContent = soundEnabled ? "🔊" : "🔇";
    playToggleSound();
  });
}

function playDoorTransition() {
  return new Promise((resolve) => {
    if (!doorTransition) {
      resolve();
      return;
    }

    doorTransition.classList.remove("active");
    void doorTransition.offsetWidth;
    doorTransition.classList.add("active");

    playDoorSound();

    setTimeout(() => {
      doorTransition.classList.remove("active");
      resolve();
    }, 1000);
  });
}

function audioContextSafe() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;

  if (!window.__ctx) {
    window.__ctx = new AudioContextClass();
  }

  return window.__ctx;
}

function tone({
  frequency = 440,
  type = "sine",
  duration = 0.08,
  volume = 0.03,
  startTime = 0,
  endFrequency = null
}) {
  if (!soundEnabled) return;

  const ctx = audioContextSafe();
  if (!ctx) return;

  if (ctx.state === "suspended") {
    ctx.resume();
  }

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime + startTime);

  if (endFrequency) {
    osc.frequency.exponentialRampToValueAtTime(
      endFrequency,
      ctx.currentTime + startTime + duration
    );
  }

  gain.gain.setValueAtTime(0.0001, ctx.currentTime + startTime);
  gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + startTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime + startTime);
  osc.stop(ctx.currentTime + startTime + duration + 0.02);
}

function playHoverSound() {
  tone({
    frequency: 720,
    type: "triangle",
    duration: 0.05,
    volume: 0.018,
    endFrequency: 860
  });
}

function playClickSound() {
  tone({
    frequency: 180,
    type: "square",
    duration: 0.06,
    volume: 0.03,
    endFrequency: 140
  });
  tone({
    frequency: 620,
    type: "triangle",
    duration: 0.08,
    volume: 0.02,
    startTime: 0.012,
    endFrequency: 740
  });
}

function playToggleSound() {
  tone({
    frequency: 520,
    type: "triangle",
    duration: 0.05,
    volume: 0.02,
    endFrequency: 680
  });
  tone({
    frequency: 780,
    type: "triangle",
    duration: 0.06,
    volume: 0.018,
    startTime: 0.03,
    endFrequency: 980
  });
}

function playDoorSound() {
  tone({
    frequency: 110,
    type: "sawtooth",
    duration: 0.22,
    volume: 0.03,
    endFrequency: 70
  });
  tone({
    frequency: 260,
    type: "triangle",
    duration: 0.15,
    volume: 0.024,
    startTime: 0.12,
    endFrequency: 180
  });
  tone({
    frequency: 820,
    type: "square",
    duration: 0.05,
    volume: 0.02,
    startTime: 0.28,
    endFrequency: 620
  });
  tone({
    frequency: 420,
    type: "triangle",
    duration: 0.14,
    volume: 0.02,
    startTime: 0.56,
    endFrequency: 620
  });
}
