const {
  NOTE_NAMES_SHARP,
  NOTE_NAMES_FLAT,
  KEY_OPTIONS,
  DEGREE_INTERVALS,
  CHORDS,
  TRIAD_QUALITY_OPTIONS,
  SCALES,
  PROGRESSIONS,
  VOCABULARY,
  DEFAULT_VOCABULARY,
  VOCABULARY_SUGGESTIONS,
  INSTRUMENTS,
  TUNINGS,
  FRET_POSITIONS,
  FRET_MARKERS,
  ALL_PROGRESSION_FAMILIES
} = window.FretLabData;

const STORAGE_KEY = "fretlab-state-v1";
const SCALE_KEYS = Object.keys(SCALES);
const DEFAULT_SCALE_LAYERS = {
  majorBlues: true,
  minorBlues: true
};
const SCALE_COLORS = [
  "#166534",
  "#6d28d9",
  "#be185d",
  "#0369a1",
  "#0f766e",
  "#b9472f",
  "#7c3aed",
  "#0f5f8f",
  "#be123c",
  "#c48a12",
  "#2563eb",
  "#475569"
];

const PAGE_CONFIGS = {
  scales: {
    defaultFocus: "all",
    focusModes: ["all"],
    allowedLayers: SCALE_KEYS,
    defaultLayers: DEFAULT_SCALE_LAYERS
  },
  progressions: {
    defaultFocus: "all",
    focusModes: ["all", "chordTones", "guideTones", "targetNotes", "rootFifth"],
    allowedLayers: ["arpeggio", "guideTones", "targets", "rootFifth"],
    defaultLayers: { arpeggio: true, targets: true }
  },
  triads: {
    defaultFocus: "all",
    focusModes: ["all", "triadTones", "rootFifth"],
    allowedLayers: ["triads", "rootFifth"],
    defaultLayers: { triads: true }
  }
};

const state = {
  instrument: "guitar",
  tuning: "standard",
  keyIndex: 0,
  progressionFamily: ALL_PROGRESSION_FAMILIES,
  progression: "major",
  currentBar: 0,
  labelMode: "notes",
  fretCount: 12,
  position: "full",
  focusMode: "all",
  triadQuality: "maj",
  layers: {
    ...Object.fromEntries(SCALE_KEYS.map((scaleKey) => [scaleKey, Boolean(DEFAULT_SCALE_LAYERS[scaleKey])])),
    arpeggio: true,
    triads: true,
    guideTones: false,
    rootFifth: false,
    targets: true
  },
  vocabulary: { ...DEFAULT_VOCABULARY }
};

const els = {};

function currentTool() {
  return document.body.dataset.tool || "scales";
}

function pageConfig() {
  return PAGE_CONFIGS[currentTool()] || PAGE_CONFIGS.scales;
}

function currentFocusMode() {
  const config = pageConfig();
  return config.focusModes.includes(state.focusMode) ? state.focusMode : config.defaultFocus;
}

function isLayerAllowed(layer) {
  return pageConfig().allowedLayers.includes(layer);
}

function isLayerActive(layer) {
  return isLayerAllowed(layer) && Boolean(state.layers[layer]);
}

function hasActiveScaleLayer() {
  return currentTool() === "scales" && SCALE_KEYS.some((scaleKey) => isLayerActive(scaleKey));
}

function setText(id, text) {
  if (els[id]) els[id].textContent = text;
}

function bindIfPresent(element, eventName, handler) {
  if (element) element.addEventListener(eventName, handler);
}

function pc(value) {
  return ((value % 12) + 12) % 12;
}

function currentKey() {
  return KEY_OPTIONS[state.keyIndex] || KEY_OPTIONS[0];
}

function currentInstrument() {
  return INSTRUMENTS[state.instrument] || INSTRUMENTS.guitar;
}

function currentTuningOptions() {
  return TUNINGS[state.instrument] || TUNINGS.guitar;
}

function currentTuningKey() {
  const tunings = currentTuningOptions();
  if (tunings[state.tuning]) return state.tuning;
  return currentInstrument().defaultTuning;
}

function currentTuning() {
  const tunings = currentTuningOptions();
  return tunings[currentTuningKey()] || Object.values(tunings)[0];
}

function currentPosition() {
  return FRET_POSITIONS[state.position] || FRET_POSITIONS.full;
}

function visibleFretRange() {
  const position = currentPosition();
  const maxFret = state.fretCount;
  const end = position.end === null ? maxFret : Math.min(position.end, maxFret);
  const start = Math.min(position.start, end);

  return { start, end, count: end - start + 1 };
}

function noteName(notePc) {
  const names = currentKey().flats ? NOTE_NAMES_FLAT : NOTE_NAMES_SHARP;
  return names[pc(notePc)];
}

function noteNameForRole(notePc, role = "") {
  if (role.includes("#")) return NOTE_NAMES_SHARP[pc(notePc)];
  if (role.includes("b")) return NOTE_NAMES_FLAT[pc(notePc)];
  return noteName(notePc);
}

function noteNameForDegree(notePc, degree = "") {
  if (degree.includes("#")) return NOTE_NAMES_SHARP[pc(notePc)];
  if (degree.includes("b")) return NOTE_NAMES_FLAT[pc(notePc)];
  return noteName(notePc);
}

function displayTone(tone) {
  return `${noteNameForRole(tone.pc, tone.role)} ${tone.role}`;
}

function scaleColor(scaleKey) {
  const index = Math.max(0, SCALE_KEYS.indexOf(scaleKey));
  return SCALE_COLORS[index % SCALE_COLORS.length];
}

function progressionFamilies() {
  return [...new Set(Object.values(PROGRESSIONS).map((progression) => progression.family || "Other"))];
}

function progressionEntriesForFamily(family = state.progressionFamily) {
  return Object.entries(PROGRESSIONS).filter(([, progression]) => (
    family === ALL_PROGRESSION_FAMILIES || progression.family === family
  ));
}

function ensureProgressionVisible() {
  const progressions = progressionEntriesForFamily();
  if (!progressions.some(([value]) => value === state.progression)) {
    state.progression = progressions[0]?.[0] || "major";
    state.currentBar = 0;
  }
}

function currentProgression() {
  return PROGRESSIONS[state.progression] || PROGRESSIONS.major;
}

function currentBarData() {
  return currentProgression().bars[state.currentBar] || currentProgression().bars[0];
}

function chordForBar(barData) {
  const rootPc = pc(currentKey().pc + DEGREE_INTERVALS[barData.degree]);
  const chord = CHORDS[barData.quality];
  const tones = chord.intervals.map((interval, index) => ({
    pc: pc(rootPc + interval),
    role: chord.roles[index],
    target: chord.targets.includes(index)
  }));

  return {
    rootPc,
    quality: barData.quality,
    roman: barData.roman,
    name: `${noteNameForDegree(rootPc, barData.degree)}${chord.suffix ?? barData.quality}`,
    functionName: chord.name,
    tones,
    targets: tones.filter((tone) => tone.target)
  };
}

function triadForSelection() {
  const rootPc = currentKey().pc;
  const chord = CHORDS[state.triadQuality] || CHORDS.maj;
  const tones = chord.intervals.map((interval, index) => ({
    pc: pc(rootPc + interval),
    role: chord.roles[index],
    target: chord.targets.includes(index)
  }));

  return {
    rootPc,
    quality: state.triadQuality,
    roman: "",
    name: `${noteName(rootPc)}${chord.suffix ?? state.triadQuality}`,
    functionName: chord.name,
    tones,
    targets: tones.filter((tone) => tone.target)
  };
}

function scaleReference() {
  const key = currentKey();

  return {
    rootPc: key.pc,
    quality: "scale",
    roman: "",
    name: key.label,
    functionName: "scale root",
    tones: [],
    targets: []
  };
}

function currentChord() {
  if (currentTool() === "triads") return triadForSelection();
  if (currentTool() === "scales") return scaleReference();
  return chordForBar(currentBarData());
}

function voicingFretRange() {
  const range = visibleFretRange();
  if (state.position === "full") {
    return { start: 0, end: Math.min(5, state.fretCount) };
  }

  return { start: range.start, end: Math.min(range.end, range.start + 6) };
}

function chordToneForPc(chord, notePc) {
  return chord.tones.find((tone) => tone.pc === notePc);
}

function chordTabFor(chord) {
  const tuning = currentTuning();
  const range = voicingFretRange();
  const stringCount = tuning.tuning.length;
  const minPlayed = stringCount >= 6 ? 3 : 2;
  const candidateLists = tuning.tuning.map((string) => {
    const candidates = [];

    for (let fret = range.start; fret <= range.end; fret += 1) {
      const tone = chordToneForPc(chord, pc(string.pc + fret));
      if (tone) {
        candidates.push({
          fret,
          role: tone.role,
          pc: tone.pc
        });
      }
    }

    candidates.push({ fret: null, role: "x", pc: null });
    return candidates;
  });

  let best = null;
  const walk = (stringIndex, current) => {
    if (stringIndex === candidateLists.length) {
      const scored = scoreVoicing(current, chord, minPlayed);
      if (scored && (!best || scored.score < best.score)) best = scored;
      return;
    }

    candidateLists[stringIndex].forEach((candidate) => {
      walk(stringIndex + 1, [...current, candidate]);
    });
  };

  walk(0, []);
  const frets = best ? best.voicing.map((item) => item.fret) : tuning.tuning.map(() => null);

  return {
    strings: tuning.tuning.map((string) => string.label),
    frets,
    range
  };
}

function scoreVoicing(voicing, chord, minPlayed) {
  const played = voicing.filter((item) => item.fret !== null);
  if (played.length < minPlayed) return null;

  const roles = new Set(played.map((item) => item.role));
  const frets = played.map((item) => item.fret);
  const span = Math.max(...frets) - Math.min(...frets);
  const muted = voicing.length - played.length;
  const firstPlayed = voicing.findIndex((item) => item.fret !== null);
  let lastPlayed = voicing.length - 1;
  while (lastPlayed >= 0 && voicing[lastPlayed].fret === null) lastPlayed -= 1;
  const innerMutes = voicing.slice(firstPlayed, lastPlayed + 1).filter((item) => item.fret === null).length;
  const lowestPlayed = [...voicing].reverse().find((item) => item.fret !== null);

  let score = 0;
  score += roles.has("R") ? 0 : 90;
  score += roles.has("3") || roles.has("b3") ? 0 : 90;
  score += roles.has("7") || roles.has("b7") || roles.has("bb7") ? 0 : 35;
  score += roles.has("5") || roles.has("b5") || roles.has("#5") ? 0 : 12;
  score += span * 8;
  score += frets.reduce((sum, fret) => sum + fret, 0) * 0.4;
  score += muted * 7;
  score += innerMutes * 18;
  score -= played.length * 2;
  if (lowestPlayed?.role === "R") score -= 10;

  return { score, voicing };
}

function chordTabMarkup(chord) {
  const tab = chordTabFor(chord);
  const aria = tab.strings.map((string, index) => `${string} ${tab.frets[index] ?? "x"}`).join(", ");
  const firstHighE = tab.strings.indexOf("E");
  const lastLowE = tab.strings.lastIndexOf("E");
  const lines = tab.strings.map((string, index) => `
    <span class="tab-standard-line">
      <span class="tab-standard-string">${index === firstHighE && firstHighE !== lastLowE ? "e" : string}</span><span class="tab-standard-staff">|--${tab.frets[index] ?? "x"}--</span>
    </span>
  `).join("");

  return `
    <span class="chord-tab" aria-label="${chord.name} tab: ${aria}">
      <span class="chord-tab-badge">tab</span>
      <span class="chord-tab-popover" aria-hidden="true">${lines}</span>
    </span>
  `;
}

function scaleNotes(scaleKey) {
  return SCALES[scaleKey].intervals.map((interval, index) => ({
    pc: pc(currentKey().pc + interval),
    role: SCALES[scaleKey].roles[index]
  }));
}

function activeScaleMatches(notePc) {
  return Object.entries(SCALES).flatMap(([scaleKey, scale]) => {
    if (!isLayerActive(scaleKey)) return [];

    const match = scaleNotes(scaleKey).find((note) => note.pc === notePc);
    if (!match) return [];

    return [{
      ...match,
      scaleKey,
      label: scale.label,
      color: scaleColor(scaleKey)
    }];
  });
}

function chordTonesByRole(chord, roles) {
  return chord.tones.filter((tone) => roles.includes(tone.role));
}

function guideTones(chord) {
  return chordTonesByRole(chord, ["3", "b3", "b7"]);
}

function rootFifthTones(chord) {
  return chordTonesByRole(chord, ["R", "5"]);
}

function triadTones(chord) {
  return chordTonesByRole(chord, ["R", "3", "b3", "5", "b5", "#5"]);
}

function suggestedVocabularyKeys(chord) {
  return VOCABULARY_SUGGESTIONS[chord.quality] || [];
}

function vocabularyNotesFor(chord, vocabularyKey) {
  const item = VOCABULARY[vocabularyKey];
  if (!item) return [];

  if (item.type === "currentTriad") {
    return triadTones(chord).map((tone) => ({
      pc: tone.pc,
      role: tone.role,
      vocabularyKey,
      label: item.label
    }));
  }

  if (item.type === "arpeggio") {
    const baseTones = chord.tones.map((tone) => ({
      pc: tone.pc,
      role: tone.role,
      vocabularyKey,
      label: item.label
    }));
    const extensions = item.extensions.map((extension) => ({
      pc: pc(chord.rootPc + extension.interval),
      role: extension.role,
      vocabularyKey,
      label: item.label
    }));

    return [...baseTones, ...extensions];
  }

  return item.intervals.map((interval, index) => ({
    pc: pc(chord.rootPc + interval),
    role: item.roles[index],
    vocabularyKey,
    label: item.label
  }));
}

function activeVocabularyItems() {
  return Object.entries(VOCABULARY).filter(([key]) => state.vocabulary[key]);
}

function activeVocabularyMatches(notePc, chord) {
  return activeVocabularyItems().flatMap(([key]) => vocabularyNotesFor(chord, key)).filter((note) => note.pc === notePc);
}

function noteInfo(notePc, chord) {
  const scaleMatches = activeScaleMatches(notePc);
  const firstScaleMatch = scaleMatches[0] || null;
  const chordTone = chord.tones.find((tone) => tone.pc === notePc);
  const targetTone = chord.targets.find((tone) => tone.pc === notePc);
  const triadTone = triadTones(chord).find((tone) => tone.pc === notePc);
  const guideTone = guideTones(chord).find((tone) => tone.pc === notePc);
  const rootFifthTone = rootFifthTones(chord).find((tone) => tone.pc === notePc);
  const vocabularyMatches = activeVocabularyMatches(notePc, chord);
  const focus = currentFocusMode();
  const inScale = firstScaleMatch;
  const inArpeggio = isLayerActive("arpeggio") && chordTone;
  const inTriad = isLayerActive("triads") && triadTone;
  const inGuide = isLayerActive("guideTones") && guideTone;
  const inRootFifth = isLayerActive("rootFifth") && rootFifthTone;
  const inTarget = isLayerActive("targets") && targetTone;
  const inVocabulary = currentTool() === "progressions" && vocabularyMatches.length > 0;

  const focusMatches = {
    all: inScale || inArpeggio || inTriad || inGuide || inRootFifth || inTarget || inVocabulary,
    chordTones: chordTone,
    triadTones: triadTone,
    guideTones: guideTone,
    targetNotes: targetTone,
    rootFifth: rootFifthTone
  };

  if (!focusMatches[focus]) {
    return null;
  }

  let layerClass = "major";
  if (focus === "chordTones") {
    layerClass = "arpeggio";
  } else if (focus === "triadTones") {
    layerClass = "triad";
  } else if (focus === "guideTones") {
    layerClass = "guide";
  } else if (focus === "rootFifth") {
    layerClass = "root-fifth";
  } else if (focus === "targetNotes") {
    layerClass = "target";
  } else {
    if (inScale) layerClass = "scale-note";
    if (inVocabulary) layerClass = "vocabulary";
    if (inArpeggio) layerClass = "arpeggio";
    if (inTriad) layerClass = "triad";
    if (inGuide) layerClass = "guide";
    if (inRootFifth) layerClass = "root-fifth";
    if (inTarget) layerClass = "target";
  }

  const visibleScaleTone = inScale;
  const visibleChordTone = focus === "all" ? inArpeggio : chordTone;
  const visibleTargetTone = focus === "all" ? inTarget : targetTone;
  const visibleTriadTone = focus === "all" ? inTriad : triadTone;
  const visibleGuideTone = focus === "all" ? inGuide : guideTone;
  const visibleRootFifthTone = focus === "all" ? inRootFifth : rootFifthTone;
  const visibleVocabularyTone = focus === "all" && inVocabulary ? vocabularyMatches[0] : null;
  const displayRole = visibleTargetTone?.role || visibleGuideTone?.role || visibleChordTone?.role || visibleTriadTone?.role || visibleRootFifthTone?.role || visibleVocabularyTone?.role || visibleScaleTone?.role || "";
  let label = noteNameForRole(notePc, displayRole);
  if (state.labelMode === "intervals") {
    label = displayRole;
  }

  const layerNames = [];
  scaleMatches.forEach((match) => layerNames.push(match.label));
  if (inArpeggio || focus === "chordTones") layerNames.push("chord tone");
  if (inTriad || focus === "triadTones") layerNames.push("triad");
  if (inGuide || focus === "guideTones") layerNames.push("guide tone");
  if (inTarget || focus === "targetNotes") layerNames.push("target");
  if (inRootFifth || focus === "rootFifth") layerNames.push("root + fifth");
  if (inVocabulary) vocabularyMatches.forEach((match) => layerNames.push(match.label));

  return {
    label,
    layerClass,
    scaleColor: inScale ? (scaleMatches.length > 1 ? "var(--blend)" : firstScaleMatch.color) : null,
    root: notePc === currentKey().pc || notePc === chord.rootPc,
    title: `${noteNameForRole(notePc, displayRole)} - ${layerNames.join(", ")}`
  };
}

function renderProgression() {
  if (!els.progressionGrid && !els.barSelect && !els.progressionSummary) return;

  const progression = currentProgression();
  setText("progressionSummary", progression.summary);
  if (els.progressionGrid) els.progressionGrid.innerHTML = "";
  if (els.barSelect) els.barSelect.innerHTML = "";

  progression.bars.forEach((barData, index) => {
    const chord = chordForBar(barData);

    if (els.barSelect) {
      const option = document.createElement("option");
      option.value = String(index);
      option.textContent = `${index + 1}: ${barData.roman} - ${chord.name}`;
      els.barSelect.append(option);
    }

    if (!els.progressionGrid) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = `progression-bar${index === state.currentBar ? " is-active" : ""}`;
    button.setAttribute("aria-pressed", index === state.currentBar ? "true" : "false");
    button.dataset.bar = String(index);
    button.innerHTML = `
      <span class="bar-number">Bar ${index + 1}</span>
      <span class="bar-roman">${barData.roman}</span>
      <span class="bar-chord">${chord.name}</span>
      ${chordTabMarkup(chord)}
    `;
    button.addEventListener("click", () => {
      state.currentBar = index;
      saveState();
      render();
    });
    els.progressionGrid.append(button);
  });

  if (els.barSelect) els.barSelect.value = String(state.currentBar);
}

function renderFretboard() {
  if (!els.fretboard) return;

  const chord = currentChord();
  const tuning = currentTuning();
  const fretRange = visibleFretRange();
  const hasOpenStrings = fretRange.start === 0;
  const firstFretted = hasOpenStrings ? 1 : fretRange.start;
  const frettedCount = Math.max(0, fretRange.end - firstFretted + 1);
  els.fretboard.innerHTML = "";
  els.fretboard.classList.toggle("has-open-strings", hasOpenStrings);
  els.fretboard.style.setProperty("--fret-columns", String(frettedCount));
  els.fretboard.style.setProperty("--fret-min-width", `${Math.max(32, 3.4 + (hasOpenStrings ? 2.65 : 0) + frettedCount * 4.4)}rem`);
  const rangeSummary = hasOpenStrings ? `Open strings + frets ${firstFretted}-${fretRange.end}.` : `Frets ${fretRange.start}-${fretRange.end}.`;
  setText("fretboardSummary", `${tuning.summary} ${rangeSummary}`);

  const corner = document.createElement("div");
  corner.className = "fret-label";
  corner.textContent = "";
  els.fretboard.append(corner);

  if (hasOpenStrings) {
    const openLabel = document.createElement("div");
    openLabel.className = "fret-label fret-label-open";
    openLabel.textContent = "";
    els.fretboard.append(openLabel);
  }

  for (let fret = firstFretted; fret <= fretRange.end; fret += 1) {
    const label = document.createElement("div");
    label.className = "fret-label";
    label.textContent = String(fret);
    els.fretboard.append(label);
  }

  tuning.tuning.forEach((string) => {
    const stringLabel = document.createElement("div");
    stringLabel.className = "string-label";
    stringLabel.textContent = string.label;
    els.fretboard.append(stringLabel);

    if (hasOpenStrings) {
      els.fretboard.append(renderFretCell(string, 0, chord, true, false));
    }

    for (let fret = firstFretted; fret <= fretRange.end; fret += 1) {
      els.fretboard.append(renderFretCell(string, fret, chord, false, hasOpenStrings && fret === firstFretted));
    }
  });
}

function renderFretCell(string, fret, chord, isOpenString, isNutAdjacent) {
  const notePc = pc(string.pc + fret);
  const info = noteInfo(notePc, chord);
  const cell = document.createElement("div");
  const markerClass = !isOpenString && FRET_MARKERS.has(fret) ? ` has-marker fret-marker-${fret}` : "";
  cell.className = `fret-cell${isOpenString ? " is-open-string" : ""}${isNutAdjacent ? " is-nut-adjacent" : ""}${markerClass}`;
  cell.dataset.note = noteName(notePc);

  if (info) {
    const marker = document.createElement("span");
    marker.className = `note-marker ${info.layerClass}${info.root ? " root" : ""}`;
    if (info.scaleColor) marker.style.setProperty("--scale-color", info.scaleColor);
    marker.textContent = info.label;
    marker.title = info.title;
    cell.append(marker);
  }

  return cell;
}

function renderDetails() {
  const key = currentKey();
  const chord = currentChord();
  const instrument = currentInstrument();
  const tuning = currentTuning();

  setText("sessionInstrument", instrument.label);
  setText("sessionTuning", tuning.label);
  setText("sessionKey", key.label);
  setText("sessionBar", String(state.currentBar + 1));
  setText("sessionChord", chord.name);
  setText("currentRoman", chord.roman || "Triad");
  setText("currentChordName", chord.name);
  setText("currentChordFunction", chord.roman ? `${chord.roman} in ${key.label} - ${chord.functionName}` : `${chord.functionName} on ${key.label}`);
  setText("chordToneList", chord.tones.map(displayTone).join("  "));
  setText("triadToneList", triadTones(chord).map(displayTone).join("  "));
  setText("targetNoteList", chord.targets.map(displayTone).join("  "));
  setText("guideToneList", guideTones(chord).map(displayTone).join("  "));
  setText("rootFifthList", rootFifthTones(chord).map(displayTone).join("  "));
  renderScalePalette();
  setText("suggestedVocabularySummary", suggestedVocabularyKeys(chord).map((key) => VOCABULARY[key].label).join(", ") || "None");
  setText("vocabularySummary", activeVocabularyItems().map(([, item]) => item.label).join(", ") || "None selected");
}

function renderScalePalette() {
  if (!els.scalePaletteList) return;

  const shouldShowPalette = hasActiveScaleLayer();
  if (els.scalePalettePanel) els.scalePalettePanel.hidden = !shouldShowPalette;
  if (!shouldShowPalette) {
    els.scalePaletteList.innerHTML = "";
    return;
  }

  els.scalePaletteList.innerHTML = "";
  let currentFamily = "";

  Object.entries(SCALES).filter(([scaleKey]) => isLayerActive(scaleKey)).forEach(([scaleKey, scale]) => {
    if (scale.family !== currentFamily) {
      currentFamily = scale.family;
      const heading = document.createElement("div");
      heading.className = "scale-family-heading";
      heading.textContent = currentFamily;
      els.scalePaletteList.append(heading);
    }

    const row = document.createElement("div");
    const label = document.createElement("span");
    const notes = document.createElement("strong");
    label.textContent = scale.label;
    notes.textContent = scaleNotes(scaleKey).map(displayTone).join("  ");
    row.append(label, notes);
    els.scalePaletteList.append(row);
  });
}

function render() {
  renderProgression();
  renderFretboard();
  renderDetails();
  renderVocabulary();
  syncControls();
}

function renderVocabulary() {
  if (!els.vocabularyGrid) return;

  const chord = currentChord();
  const suggested = new Set(suggestedVocabularyKeys(chord));

  document.querySelectorAll(".vocabulary-toggle").forEach((input) => {
    const label = document.querySelector(`label[for="${input.id}"]`);
    if (!label) return;

    const isSuggested = suggested.has(input.dataset.vocabulary);
    label.classList.toggle("is-suggested", isSuggested);
    const existingBadge = label.querySelector(".suggestion-badge");

    if (isSuggested && !existingBadge) {
      const badge = document.createElement("span");
      badge.className = "suggestion-badge";
      badge.textContent = "Suggested";
      label.append(badge);
    } else if (!isSuggested && existingBadge) {
      existingBadge.remove();
    }
  });
}

function syncControls() {
  if (els.instrumentSelect) els.instrumentSelect.value = state.instrument;
  if (els.tuningSelect) els.tuningSelect.value = currentTuningKey();
  if (els.keySelect) els.keySelect.value = String(state.keyIndex);
  if (els.progressionFamily) els.progressionFamily.value = state.progressionFamily;
  if (els.progressionSelect) els.progressionSelect.value = state.progression;
  if (els.triadQualitySelect) els.triadQualitySelect.value = state.triadQuality;
  if (els.labelMode) els.labelMode.value = state.labelMode;
  if (els.fretCount) els.fretCount.value = String(state.fretCount);
  if (els.positionSelect) els.positionSelect.value = state.position;
  if (els.focusMode) els.focusMode.value = currentFocusMode();
  document.querySelectorAll(".layer-toggle").forEach((input) => {
    input.checked = state.layers[input.dataset.layer];
    input.disabled = !isLayerAllowed(input.dataset.layer);
  });
  document.querySelectorAll(".vocabulary-toggle").forEach((input) => {
    input.checked = state.vocabulary[input.dataset.vocabulary];
  });
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;

  try {
    const saved = JSON.parse(raw);
    state.instrument = INSTRUMENTS[saved.instrument] ? saved.instrument : state.instrument;
    state.tuning = typeof saved.tuning === "string" ? saved.tuning : state.tuning;
    if (!currentTuningOptions()[state.tuning]) state.tuning = currentInstrument().defaultTuning;
    state.keyIndex = Number.isInteger(saved.keyIndex) ? saved.keyIndex : state.keyIndex;
    state.progressionFamily = saved.progressionFamily === ALL_PROGRESSION_FAMILIES || progressionFamilies().includes(saved.progressionFamily) ? saved.progressionFamily : state.progressionFamily;
    state.progression = PROGRESSIONS[saved.progression] ? saved.progression : state.progression;
    ensureProgressionVisible();
    state.currentBar = Number.isInteger(saved.currentBar) ? saved.currentBar : state.currentBar;
    state.currentBar = Math.max(0, Math.min(state.currentBar, currentProgression().bars.length - 1));
    state.labelMode = saved.labelMode === "intervals" ? "intervals" : "notes";
    state.fretCount = [12, 15, 17, 20, 24].includes(saved.fretCount) ? saved.fretCount : state.fretCount;
    state.position = FRET_POSITIONS[saved.position] ? saved.position : state.position;
    state.focusMode = ["all", "chordTones", "triadTones", "guideTones", "targetNotes", "rootFifth"].includes(saved.focusMode) ? saved.focusMode : state.focusMode;
    state.triadQuality = CHORDS[saved.triadQuality] ? saved.triadQuality : state.triadQuality;
    state.layers = { ...state.layers, ...saved.layers };
    state.vocabulary = { ...DEFAULT_VOCABULARY, ...saved.vocabulary };
  } catch (_error) {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function applyPageDefaults() {
  const config = pageConfig();
  const hasAllowedLayer = config.allowedLayers.some((layer) => state.layers[layer]);
  state.focusMode = config.focusModes.includes(state.focusMode) ? state.focusMode : config.defaultFocus;
  Object.keys(state.layers).forEach((layer) => {
    state.layers[layer] = isLayerAllowed(layer) ? (hasAllowedLayer ? Boolean(state.layers[layer]) : Boolean(config.defaultLayers[layer])) : false;
  });
}

function populateControls() {
  if (els.instrumentSelect) {
    Object.entries(INSTRUMENTS).forEach(([value, instrument]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = instrument.label;
      els.instrumentSelect.append(option);
    });
  }

  populateTuningOptions();

  if (els.keySelect) {
    KEY_OPTIONS.forEach((key, index) => {
      const option = document.createElement("option");
      option.value = String(index);
      option.textContent = key.label;
      els.keySelect.append(option);
    });
  }

  populateProgressionFamilyOptions();
  populateProgressionOptions();
  populateScaleControls();

  if (els.triadQualitySelect) {
    TRIAD_QUALITY_OPTIONS.forEach((quality) => {
      const option = document.createElement("option");
      option.value = quality.value;
      option.textContent = quality.label;
      els.triadQualitySelect.append(option);
    });
  }

  if (els.positionSelect) {
    Object.entries(FRET_POSITIONS).forEach(([value, position]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = position.label;
      els.positionSelect.append(option);
    });
  }

  if (els.vocabularyGrid) {
    Object.entries(VOCABULARY).forEach(([value, item]) => {
      const checkbox = document.createElement("input");
      checkbox.className = "btn-check vocabulary-toggle";
      checkbox.type = "checkbox";
      checkbox.id = `vocabulary-${value}`;
      checkbox.dataset.vocabulary = value;

      const label = document.createElement("label");
      label.className = "btn btn-outline-dark layer-button";
      label.htmlFor = checkbox.id;
      label.innerHTML = `<span class="layer-dot vocabulary"></span>${item.label}`;

      els.vocabularyGrid.append(checkbox, label);
    });
  }
}

function populateScaleControls() {
  if (!els.scaleLayerGrid) return;

  els.scaleLayerGrid.innerHTML = "";
  let currentFamily = "";

  Object.entries(SCALES).forEach(([scaleKey, scale]) => {
    if (scale.family !== currentFamily) {
      currentFamily = scale.family;
      const heading = document.createElement("div");
      heading.className = "scale-layer-group-title";
      heading.textContent = currentFamily;
      els.scaleLayerGrid.append(heading);
    }

    const checkbox = document.createElement("input");
    checkbox.className = "btn-check layer-toggle";
    checkbox.type = "checkbox";
    checkbox.id = `scale-${scaleKey}`;
    checkbox.dataset.layer = scaleKey;

    const label = document.createElement("label");
    label.className = "btn btn-outline-dark layer-button";
    label.htmlFor = checkbox.id;
    label.innerHTML = `<span class="layer-dot scale-note"></span>${scale.label}`;
    label.style.setProperty("--scale-color", scaleColor(scaleKey));

    els.scaleLayerGrid.append(checkbox, label);
  });
}

function populateProgressionFamilyOptions() {
  if (!els.progressionFamily) return;

  els.progressionFamily.innerHTML = "";

  const allOption = document.createElement("option");
  allOption.value = ALL_PROGRESSION_FAMILIES;
  allOption.textContent = "All families";
  els.progressionFamily.append(allOption);

  progressionFamilies().forEach((family) => {
    const option = document.createElement("option");
    option.value = family;
    option.textContent = family;
    els.progressionFamily.append(option);
  });
}

function populateProgressionOptions() {
  if (!els.progressionSelect) return;

  ensureProgressionVisible();
  els.progressionSelect.innerHTML = "";

  const progressionGroups = {};
  progressionEntriesForFamily().forEach(([value, progression]) => {
    const family = progression.family || "Other";
    progressionGroups[family] ||= [];
    progressionGroups[family].push([value, progression]);
  });

  Object.entries(progressionGroups).forEach(([family, progressions]) => {
    const group = document.createElement("optgroup");
    group.label = family;

    progressions.forEach(([value, progression]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = progression.label;
      group.append(option);
    });

    els.progressionSelect.append(group);
  });

  els.progressionSelect.value = state.progression;
}

function populateTuningOptions() {
  if (!els.tuningSelect) return;

  els.tuningSelect.innerHTML = "";

  Object.entries(currentTuningOptions()).forEach(([value, tuning]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = tuning.label;
    els.tuningSelect.append(option);
  });
}

function bindEvents() {
  bindIfPresent(els.instrumentSelect, "change", (event) => {
    state.instrument = event.target.value;
    if (!currentTuningOptions()[state.tuning]) state.tuning = currentInstrument().defaultTuning;
    populateTuningOptions();
    saveState();
    render();
  });

  bindIfPresent(els.tuningSelect, "change", (event) => {
    state.tuning = event.target.value;
    saveState();
    render();
  });

  bindIfPresent(els.keySelect, "change", (event) => {
    state.keyIndex = Number(event.target.value);
    saveState();
    render();
  });

  bindIfPresent(els.progressionFamily, "change", (event) => {
    state.progressionFamily = event.target.value;
    const previousProgression = state.progression;
    populateProgressionOptions();
    if (state.progression !== previousProgression) {
      state.currentBar = 0;
    }
    saveState();
    render();
  });

  bindIfPresent(els.progressionSelect, "change", (event) => {
    state.progression = event.target.value;
    state.currentBar = Math.min(state.currentBar, currentProgression().bars.length - 1);
    saveState();
    render();
  });

  bindIfPresent(els.barSelect, "change", (event) => {
    state.currentBar = Number(event.target.value);
    saveState();
    render();
  });

  bindIfPresent(els.prevBar, "click", () => {
    state.currentBar = pc(state.currentBar - 1) % currentProgression().bars.length;
    saveState();
    render();
  });

  bindIfPresent(els.nextBar, "click", () => {
    state.currentBar = (state.currentBar + 1) % currentProgression().bars.length;
    saveState();
    render();
  });

  bindIfPresent(els.triadQualitySelect, "change", (event) => {
    state.triadQuality = event.target.value;
    saveState();
    render();
  });

  bindIfPresent(els.labelMode, "change", (event) => {
    state.labelMode = event.target.value;
    saveState();
    render();
  });

  bindIfPresent(els.fretCount, "change", (event) => {
    state.fretCount = Number(event.target.value);
    saveState();
    render();
  });

  bindIfPresent(els.positionSelect, "change", (event) => {
    state.position = event.target.value;
    const position = currentPosition();
    if (position.end !== null && state.fretCount < position.end) {
      state.fretCount = position.end;
    }
    saveState();
    render();
  });

  bindIfPresent(els.focusMode, "change", (event) => {
    state.focusMode = event.target.value;
    saveState();
    render();
  });

  bindIfPresent(els.applySuggestions, "click", () => {
    const chord = currentChord();
    const suggested = new Set(suggestedVocabularyKeys(chord));
    state.vocabulary = Object.fromEntries(Object.keys(VOCABULARY).map((key) => [key, suggested.has(key)]));
    saveState();
    render();
  });

  bindIfPresent(els.clearVocabulary, "click", () => {
    state.vocabulary = { ...DEFAULT_VOCABULARY };
    saveState();
    render();
  });

  document.querySelectorAll(".layer-toggle").forEach((input) => {
    input.addEventListener("change", (event) => {
      if (!isLayerAllowed(event.target.dataset.layer)) return;
      state.layers[event.target.dataset.layer] = event.target.checked;
      saveState();
      render();
    });
  });

  document.querySelectorAll(".vocabulary-toggle").forEach((input) => {
    input.addEventListener("change", (event) => {
      state.vocabulary[event.target.dataset.vocabulary] = event.target.checked;
      saveState();
      render();
    });
  });
}

function cacheElements() {
  [
    "instrumentSelect",
    "tuningSelect",
    "keySelect",
    "progressionFamily",
    "progressionSelect",
    "triadQualitySelect",
    "barSelect",
    "prevBar",
    "nextBar",
    "labelMode",
    "fretCount",
    "positionSelect",
    "focusMode",
    "applySuggestions",
    "clearVocabulary",
    "progressionSummary",
    "fretboardSummary",
    "scaleLayerGrid",
    "scalePalettePanel",
    "scalePaletteList",
    "vocabularyGrid",
    "suggestedVocabularySummary",
    "vocabularySummary",
    "progressionGrid",
    "fretboard",
    "sessionInstrument",
    "sessionTuning",
    "sessionKey",
    "sessionBar",
    "sessionChord",
    "currentRoman",
    "currentChordName",
    "currentChordFunction",
    "chordToneList",
    "triadToneList",
    "targetNoteList",
    "guideToneList",
    "rootFifthList"
  ].forEach((id) => {
    els[id] = document.getElementById(id);
  });
}

function init() {
  cacheElements();
  loadState();
  applyPageDefaults();
  populateControls();
  bindEvents();
  render();
}

init();
