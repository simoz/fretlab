const METRONOME_STORAGE_KEY = "fretlab-metronome-v1";
const MIN_BPM = 30;
const MAX_BPM = 300;
const LOOKAHEAD_MS = 25;
const SCHEDULE_AHEAD_SECONDS = 0.1;

const metronomeState = {
  bpm: 100,
  beatsPerBar: 4,
  accentFirstBeat: true,
  playing: false,
  currentBeat: 0,
  nextBeatAt: 0,
  timerId: null,
  audioContext: null,
  tapTimes: []
};

const metronomeEls = {};

function clampBpm(value) {
  return Math.min(MAX_BPM, Math.max(MIN_BPM, Math.round(Number(value) || metronomeState.bpm)));
}

function saveMetronomeState() {
  localStorage.setItem(METRONOME_STORAGE_KEY, JSON.stringify({
    bpm: metronomeState.bpm,
    beatsPerBar: metronomeState.beatsPerBar,
    accentFirstBeat: metronomeState.accentFirstBeat
  }));
}

function loadMetronomeState() {
  try {
    const saved = JSON.parse(localStorage.getItem(METRONOME_STORAGE_KEY));
    if (!saved) return;
    metronomeState.bpm = clampBpm(saved.bpm);
    if ([2, 3, 4, 5, 6, 7].includes(Number(saved.beatsPerBar))) {
      metronomeState.beatsPerBar = Number(saved.beatsPerBar);
    }
    metronomeState.accentFirstBeat = saved.accentFirstBeat !== false;
  } catch (_error) {
    localStorage.removeItem(METRONOME_STORAGE_KEY);
  }
}

function renderBeatIndicators(activeBeat = -1) {
  metronomeEls.beatIndicators.innerHTML = "";
  for (let index = 0; index < metronomeState.beatsPerBar; index += 1) {
    const indicator = document.createElement("span");
    indicator.className = `beat-indicator${index === 0 ? " is-accent" : ""}${index === activeBeat ? " is-active" : ""}`;
    indicator.setAttribute("aria-hidden", "true");
    metronomeEls.beatIndicators.append(indicator);
  }
  const beatNumber = activeBeat < 0 ? 1 : activeBeat + 1;
  metronomeEls.beatIndicators.setAttribute("aria-label", `Beat ${beatNumber} of ${metronomeState.beatsPerBar}`);
}

function renderMetronome() {
  metronomeEls.bpmValue.value = String(metronomeState.bpm);
  metronomeEls.bpmValue.textContent = String(metronomeState.bpm);
  metronomeEls.bpmRange.value = String(metronomeState.bpm);
  metronomeEls.bpmInput.value = String(metronomeState.bpm);
  metronomeEls.beatsPerBar.value = String(metronomeState.beatsPerBar);
  metronomeEls.accentFirstBeat.checked = metronomeState.accentFirstBeat;
  metronomeEls.toggleMetronome.textContent = metronomeState.playing ? "Stop" : "Start";
  metronomeEls.toggleMetronome.classList.toggle("btn-dark", !metronomeState.playing);
  metronomeEls.toggleMetronome.classList.toggle("btn-danger", metronomeState.playing);
  metronomeEls.toggleMetronome.setAttribute("aria-pressed", String(metronomeState.playing));
  metronomeEls.metronomeStatus.textContent = `Metronome ${metronomeState.playing ? "running" : "stopped"} at ${metronomeState.bpm} BPM`;
}

function setBpm(value) {
  metronomeState.bpm = clampBpm(value);
  saveMetronomeState();
  renderMetronome();
}

function audioContext() {
  if (!metronomeState.audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    metronomeState.audioContext = new AudioContextClass();
  }
  return metronomeState.audioContext;
}

function scheduleClick(beat, time) {
  const context = audioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const accented = beat === 0 && metronomeState.accentFirstBeat;

  oscillator.frequency.setValueAtTime(accented ? 1200 : 800, time);
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime(accented ? 0.5 : 0.3, time + 0.002);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.045);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(time);
  oscillator.stop(time + 0.05);

  const delay = Math.max(0, (time - context.currentTime) * 1000);
  window.setTimeout(() => renderBeatIndicators(beat), delay);
}

function scheduler() {
  const context = audioContext();
  while (metronomeState.nextBeatAt < context.currentTime + SCHEDULE_AHEAD_SECONDS) {
    scheduleClick(metronomeState.currentBeat, metronomeState.nextBeatAt);
    metronomeState.nextBeatAt += 60 / metronomeState.bpm;
    metronomeState.currentBeat = (metronomeState.currentBeat + 1) % metronomeState.beatsPerBar;
  }
}

async function startMetronome() {
  const context = audioContext();
  await context.resume();
  metronomeState.playing = true;
  metronomeState.currentBeat = 0;
  metronomeState.nextBeatAt = context.currentTime + 0.05;
  metronomeState.timerId = window.setInterval(scheduler, LOOKAHEAD_MS);
  scheduler();
  renderMetronome();
}

function stopMetronome() {
  window.clearInterval(metronomeState.timerId);
  metronomeState.timerId = null;
  metronomeState.playing = false;
  renderBeatIndicators();
  renderMetronome();
}

function toggleMetronome() {
  if (metronomeState.playing) {
    stopMetronome();
  } else {
    startMetronome();
  }
}

function recordTap() {
  const now = performance.now();
  metronomeState.tapTimes = metronomeState.tapTimes.filter((time) => now - time < 2000);
  metronomeState.tapTimes.push(now);
  if (metronomeState.tapTimes.length < 2) return;

  const intervals = metronomeState.tapTimes.slice(1).map((time, index) => time - metronomeState.tapTimes[index]);
  const averageInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
  setBpm(60000 / averageInterval);
}

function bindMetronomeEvents() {
  metronomeEls.bpmRange.addEventListener("input", (event) => setBpm(event.target.value));
  metronomeEls.bpmInput.addEventListener("change", (event) => setBpm(event.target.value));
  metronomeEls.bpmInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setBpm(event.target.value);
      event.target.blur();
    }
  });
  metronomeEls.decreaseBpm.addEventListener("click", () => setBpm(metronomeState.bpm - 1));
  metronomeEls.increaseBpm.addEventListener("click", () => setBpm(metronomeState.bpm + 1));
  metronomeEls.toggleMetronome.addEventListener("click", toggleMetronome);
  metronomeEls.tapTempo.addEventListener("click", recordTap);
  metronomeEls.beatsPerBar.addEventListener("change", (event) => {
    metronomeState.beatsPerBar = Number(event.target.value);
    metronomeState.currentBeat = 0;
    saveMetronomeState();
    renderBeatIndicators();
  });
  metronomeEls.accentFirstBeat.addEventListener("change", (event) => {
    metronomeState.accentFirstBeat = event.target.checked;
    saveMetronomeState();
  });
  document.addEventListener("keydown", (event) => {
    if (["INPUT", "SELECT", "BUTTON"].includes(document.activeElement.tagName)) return;
    if (event.code === "Space") {
      event.preventDefault();
      toggleMetronome();
    } else if (event.key === "ArrowUp" || event.key === "ArrowRight") {
      event.preventDefault();
      setBpm(metronomeState.bpm + 1);
    } else if (event.key === "ArrowDown" || event.key === "ArrowLeft") {
      event.preventDefault();
      setBpm(metronomeState.bpm - 1);
    }
  });
  window.addEventListener("pagehide", stopMetronome);
}

function initMetronome() {
  [
    "bpmValue",
    "bpmRange",
    "bpmInput",
    "beatsPerBar",
    "accentFirstBeat",
    "beatIndicators",
    "decreaseBpm",
    "increaseBpm",
    "toggleMetronome",
    "tapTempo",
    "metronomeStatus"
  ].forEach((id) => {
    metronomeEls[id] = document.getElementById(id);
  });

  loadMetronomeState();
  renderBeatIndicators();
  renderMetronome();
  bindMetronomeEvents();
}

document.addEventListener("fretlab:localechange", () => {
  renderBeatIndicators(metronomeState.playing ? metronomeState.currentBeat : -1);
  renderMetronome();
});
initMetronome();
