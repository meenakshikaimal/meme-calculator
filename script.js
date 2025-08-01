// DOM refs & state
const displayEl = document.getElementById("display");
const memeContainer = document.getElementById("meme-container");
const memeImg = document.getElementById("meme-image");
const loader = document.getElementById("loader");
const resetBtn = document.getElementById("reset-btn");
const chaosBtn = document.getElementById("chaos-btn");
const themeToggle = document.getElementById("theme-toggle");
const proMeme = "memes/pro_meme.jpg"; // or whatever filename you want

let current = "";
let memeMode = true;
let chaosActive = false;
let chaosSpawner = null;
let currentTheme = "neon"; // or "pastel"


function safeEvaluate(expr) {
  // allow only digits, operators, parentheses, decimal point, and spaces
  if (!/^[0-9+\-*/%. ()]+$/.test(expr)) return null;
  try {
    // eslint-disable-next-line no-new-func
    let result = Function(`"use strict"; return (${expr})`)();
    if (typeof result === "number" && isFinite(result)) {
      // trim unnecessary decimals
      result = Math.round((result + Number.EPSILON) * 1e12) / 1e12;
      return result.toString();
    }
  } catch {
    return null;
  }
  return null;
}


// Meme sources
const memes = [
  "memes/meme1.jpg",
  "memes/meme2.gif",
  "memes/meme3.jpg",
  "memes/meme4.jpg",
    "memes/meme5.jpg",
    "memes/meme6.jpg",
    "memes/meme7.jpg",
    "memes/meme8.gif",
];

const easterEggs = {
  "69": "memes/meme1.jpg",
  "420": "memes/meme2.gif",
  "666": "memes/meme1.jpg",
};

// Helpers
function pickMeme(input) {
  if (easterEggs[input]) return easterEggs[input];
  return memes[Math.floor(Math.random() * memes.length)];
}

function updateDisplay(text) {
  displayEl.textContent = text || "0";
  displayEl.setAttribute("data-text", text || "0");
}

function reset() {
  current = "";
  updateDisplay("0");
  memeContainer.classList.add("hidden");
}

// Meme show
function showMeme(input) {
  memeContainer.classList.remove("hidden");
  memeImg.style.display = "none";
  loader.textContent = "Calculating...";
 


  setTimeout(() => {
    loader.textContent = "Finalizing answer...";
    setTimeout(() => {
      // 🔽 USE fixed meme in Professional Mode
      const selected = professionalMode ? proMeme : pickMeme(input);
      memeImg.src = selected;
      
      memeImg.onload = () => {
      loader.textContent = "";
      memeImg.style.display = "block";
      moodLabel.innerHTML = `🧠 Mood Detected: <b>${mood}</b><br><span style="font-size:0.8rem; opacity:0.7;">${getMoodComment(mood)}</span>`;
    };
      memeImg.onerror = () => {
        loader.textContent = "Couldn't load meme. Here's a fallback.";
        memeImg.src = "https://via.placeholder.com/300?text=No+Meme";
        memeImg.style.display = "block";
      };
    }, 800);
  }, 800);
}

const proToggle = document.getElementById("pro-toggle");
let professionalMode = false;

proToggle.addEventListener("click", () => {
  professionalMode = !professionalMode;
  if (professionalMode) {
    document.body.classList.add("professional");
    proToggle.textContent = "Pro Mode";
  } else {
    document.body.classList.remove("professional");
    proToggle.textContent = "Professional";
  }
});


// Theme toggle
themeToggle.addEventListener("click", () => {
  if (currentTheme === "neon") {
    document.body.classList.add("pastel");
    currentTheme = "pastel";
    themeToggle.textContent = "Pastel";
  } else {
    document.body.classList.remove("pastel");
    currentTheme = "neon";
    themeToggle.textContent = "Neon";
  }
});

// Ripple + calculator input handling
document.querySelectorAll("button").forEach(btn => {
  btn.addEventListener("click", (e) => {
    // ripple effect
    const rect = btn.getBoundingClientRect();
    const circle = document.createElement("div");
    const size = Math.max(rect.width, rect.height);
    circle.classList.add("ripple");
    circle.style.width = circle.style.height = `${size}px`;
    circle.style.left = `${e.clientX - rect.left - size/2}px`;
    circle.style.top = `${e.clientY - rect.top - size/2}px`;
    btn.appendChild(circle);
    setTimeout(() => circle.remove(), 600);

    const val = btn.dataset.val;
    const op = btn.dataset.op;
    if (val !== undefined) {
      if (current === "0") current = val;
      else current += val;
      updateDisplay(current);
      return;
    }
    if (op) {
      if (op === "clear") {
        reset();
        return;
      }
      if (op === "back") {
        current = current.slice(0, -1);
        updateDisplay(current || "0");
        return;
      }
      if (op === "=") {
  if (professionalMode) {
    // show fake real result briefly
    const real = safeEvaluate(current.trim());
    if (real !== null) {
      updateDisplay(real);
      // after short pause glitch into meme
      setTimeout(() => {
        // small “corruption” visual
        displayEl.classList.add("shake");
        setTimeout(() => displayEl.classList.remove("shake"), 300);
        showMeme(current.trim());
      }, 1000); // 1 second of “real” before meme
    } else {
      // invalid expression fallback straight to meme
      showMeme(current.trim());
    }
  } else {
    showMeme(current.trim());
  }
  return;
}

      if (op === "meme-mode") {
        memeMode = !memeMode;
        btn.textContent = memeMode ? "Meme Mode" : "Real Mode";
        return;
      }
      if (["+", "-", "*", "/", "%"].includes(op)) {
        current += ` ${op} `;
        updateDisplay(current);
      }
    }
  });
});

resetBtn.addEventListener("click", reset);

// Chaos & visual helpers
function applyChaosGlow(on) {
  const calc = document.querySelector(".calculator");
  if (on) calc.classList.add("glow");
  else calc.classList.remove("glow");
}

function spawnFallingMeme() {
  const img = document.createElement("img");
  const src = memes[Math.floor(Math.random() * memes.length)];
  img.src = src;
  img.className = "chaos-meme";

  const startX = Math.random() * (window.innerWidth - 80);
  img.style.left = `${startX}px`;
  img.style.top = `-100px`;

  const rotation = (Math.random() * 720 - 360) + "deg";
  img.style.setProperty("--r", rotation);
  const duration = 1 + Math.random() * 1;
  img.style.setProperty("--duration", `${duration}s`);

  const size = 60 + Math.random() * 60;
  img.style.width = `${size}px`;

  document.body.appendChild(img);
  setTimeout(() => {
    img.remove();
  }, (duration * 1000) + 200);
}

function startChaos() {
  if (chaosActive) return;
  chaosActive = true;
  chaosBtn.textContent = "Stop Chaos";
  document.getElementById("mode-label").textContent = "Chaos Mode";
  applyChaosGlow(true);
  chaosSpawner = setInterval(() => {
    const calc = document.querySelector(".calculator");
    calc.classList.add("shake");
    setTimeout(() => calc.classList.remove("shake"), 300);
    const count = 5 + Math.floor(Math.random() * 5);
    for (let i = 0; i < count; i++) {
      spawnFallingMeme();
    }
  }, 150);
}

function stopChaos() {
  chaosActive = false;
  chaosBtn.textContent = "Chaos Mode";
  document.getElementById("mode-label").textContent = "Meme Mode";
  applyChaosGlow(false);
  clearInterval(chaosSpawner);
}

chaosBtn.addEventListener("click", () => {
  if (chaosActive) stopChaos();
  else startChaos();
});

// initialize display reflection
updateDisplay("0");
let lastX = 0, lastY = 0, lastMoveTime = Date.now();
let mood = "Calm";
let lastMoodUpdate = 0;

const moodLabel = document.getElementById("mood-label");

function getFakeMood(speed) {
  if (speed > 2000) return "Overstimulated Genius 🤯";
  if (speed > 1000) return "Chaotic Energy ⚡";
  if (speed > 400)  return "Mildly Unstable 😵";
  if (speed > 100)  return "Thinking Too Hard 🧐";
  return "Zen Mode 🧘";
}

function getMoodComment(mood) {
  switch (mood) {
    case "Overstimulated Genius 🤯":
      return "Bro, slow down. You're about to invent time travel.";
    case "Chaotic Energy ⚡":
      return "Your mouse needs a seatbelt.";
    case "Mildly Unstable 😵":
      return "Math isn’t therapy, friend.";
    case "Thinking Too Hard 🧐":
      return "Calculator.exe has stopped responding.";
    case "Zen Mode 🧘":
      return "Wow. Inner peace achieved. But useless.";
    default:
      return "Mood? Undefined. Just like your math.";
  }
}


window.addEventListener("mousemove", (e) => {
  const now = Date.now();
  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;
  const dt = now - lastMoveTime;

  const dist = Math.sqrt(dx * dx + dy * dy);
  const speed = dt > 0 ? dist / dt * 1000 : 0; // pixels per second
function showMoodToast(mood, comment) {
  const container = document.getElementById("mood-toast-container");
  if (container.children.length >= 3) {
  container.removeChild(container.firstChild); // remove oldest
}

  const toast = document.createElement("div");
  toast.className = "mood-toast";
  toast.innerHTML = `🧠 <b>${mood}</b><br><span style="font-size:0.85rem; opacity:0.8;">${comment}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("fade-out");
  }, 3000);

  setTimeout(() => {
    toast.remove();
  }, 4000);
}

  // Update only every 1500ms (1.5s)
 if (now - lastMoodUpdate > 1500) {
  mood = getFakeMood(speed);
  showMoodToast(mood, getMoodComment(mood));

  lastMoodUpdate = now;
}


  lastX = e.clientX;
  lastY = e.clientY;
  lastMoveTime = now;
});
