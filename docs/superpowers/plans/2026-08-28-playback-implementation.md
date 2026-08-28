# Playback Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add shared Web Audio playback for fretboard notes, scales, chord voicings, triad shapes, and progressions without adding a build step, backend, or dependency.

**Architecture:** Create `assets/audio.js` as the single audio engine. It will expose validated note-event scheduling, MIDI frequency conversion, cancellation, and playback status callbacks. `assets/app.js` will provide shared fretboard/scale integration, while the existing page-specific render paths will build chord, triad, and progression sequences from current state and data.

**Tech Stack:** Plain HTML, CSS, JavaScript, Web Audio API, existing vendored Bootstrap, browser `localStorage`.

---

## File map

- Create: `assets/audio.js` — reusable Web Audio engine and pure note-event helpers.
- Modify: `index.html`, `chords.html`, `triads.html`, `progressions.html` — load the audio engine before `app.js` and add page controls/status regions.
- Modify: `assets/app.js` — initialize audio state, play fretboard notes, retain scale playback through the shared engine, render chord/triad/progression controls, and cancel playback during state changes.
- Modify: `assets/app.css` — style shared playback controls, status text, active progression bars, and mobile layout.
- Modify: `README.md` — document playback capabilities and browser requirements.
- Validate: browser manually with `python3 -m http.server`; no test runner or package manifest exists, so use the browser console and a small Node-compatible helper check only if the pure helper surface is made exportable without adding tooling.

### Task 1: Create the shared audio engine

**Files:**
- Create: `assets/audio.js`
- Modify: `index.html`, `chords.html`, `triads.html`, `progressions.html`

- [ ] **Step 1: Define the engine contract before page wiring**

Implement a `window.FretLabAudio` object with these stable functions:

```js
window.FretLabAudio = {
  midiToFrequency(midi),
  normalizeEvents(events),
  createPlayer(options),
  isSupported()
};
```

`normalizeEvents` must accept `{ midi, start, duration, velocity }` objects, reject non-finite MIDI/start/duration values and durations `<= 0`, clamp velocity to `0..1`, sort by `start`, and return a new array. An empty input returns `[]`.

`createPlayer` must lazily instantiate `AudioContext`/`webkitAudioContext` only after `play(events)` is called. It must expose:

```js
{
  play(events, { onStart, onEvent, onEnd, onError } = {}),
  stop(),
  isPlaying()
}
```

Use one playback token per `play` call. `stop()` increments the token, clears the completion timer, stops and disconnects every tracked oscillator, and invokes no stale callbacks. Each oscillator uses a triangle wave, a short gain attack/release envelope, and the normalized velocity. If Web Audio is unavailable or context creation/resume fails, call `onError(error)` and leave the player idle.

- [ ] **Step 2: Add the script to every tool page**

Insert the audio script immediately before `assets/app.js` in all four pages:

```html
<script src="assets/data.js" defer></script>
<script src="assets/audio.js" defer></script>
<script src="assets/app.js" defer></script>
```

- [ ] **Step 3: Smoke-test the engine in the browser**

Run:

```sh
python3 -m http.server
```

Open `http://localhost:8000/index.html`, then run in DevTools:

```js
FretLabAudio.isSupported()
FretLabAudio.midiToFrequency(69)
FretLabAudio.normalizeEvents([{ midi: 69, start: 1, duration: 0.2 }])
```

Expected: support is `true` in a normal desktop browser, frequency is approximately `440`, and the normalized event is returned without mutation.

- [ ] **Step 4: Commit the engine**

```sh
git add assets/audio.js index.html chords.html triads.html progressions.html
git commit -m "Add shared Web Audio playback engine"
```

### Task 2: Integrate note clicks and scale playback

**Files:**
- Modify: `assets/app.js`
- Modify: `assets/app.css`
- Modify: `index.html`

- [ ] **Step 1: Replace scale-local audio state with shared player state**

Keep only page/UI playback metadata in `app.js`:

```js
const playbackState = {
  player: null,
  kind: null,
  keyIndex: null,
  tempo: 100,
  error: null
};
```

Create the player once through `FretLabAudio.createPlayer`, and use its callbacks to update controls. Remove the scale-specific oscillator creation, source set, timer, and audio-context helpers.

- [ ] **Step 2: Add fretboard note playback**

In `renderFretCell`, make each available cell a keyboard-accessible button-like control without changing the fretboard grid geometry:

```js
cell.tabIndex = 0;
cell.setAttribute("role", "button");
cell.setAttribute("aria-label", `${noteName(notePc)} at fret ${fret} on ${string.label}`);
const playNote = () => playSingleNote(string, fret);
cell.addEventListener("click", playNote);
cell.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    playNote();
  }
});
```

`playSingleNote(string, fret)` must calculate `string.midi + fret` (or the equivalent existing tuning pitch field); do not infer octave from pitch class alone. Add an `.is-playing` class and remove it when playback ends or is replaced.

- [ ] **Step 3: Rewire scale playback to shared events**

Build scale events from the existing `scale.intervals` and `currentKey().pc`: ascending intervals through `12`, followed by the reversed scale back to root. Use `tempo` to calculate a fixed eighth-note step duration, and set `kind`, `keyIndex`, and `scaleKey` metadata before calling `player.play`.

Preserve the existing palette labels and `aria-pressed` behavior, but route Stop through `player.stop()` and display an error message in a dedicated `#playbackStatus` region if audio is unsupported.

- [ ] **Step 4: Add shared scale-page controls**

In `index.html`, add a compact tempo select/input and status region near the scale palette heading:

```html
<div class="playback-controls">
  <label for="playbackTempo">Tempo</label>
  <input id="playbackTempo" type="number" min="40" max="240" step="1" value="100">
  <button id="stopPlayback" type="button" class="btn btn-outline-secondary btn-sm">Stop</button>
</div>
<p id="playbackStatus" class="playback-status" role="status" aria-live="polite"></p>
```

Bind tempo changes with integer clamping to `40..240`, persist the value in the existing state object only if the current storage schema supports it, and bind Stop to the shared player.

- [ ] **Step 5: Commit note and scale playback**

```sh
git add assets/app.js assets/app.css index.html
git commit -m "Add fretboard note and scale playback"
```

### Task 3: Add chord voicing playback

**Files:**
- Modify: `chords.html`
- Modify: `assets/app.js`
- Modify: `assets/app.css`

- [ ] **Step 1: Add controls to the current-chord panel**

Add `#playCurrentChord` and `#stopPlayback` buttons plus the shared `#playbackStatus` region to the current-chord panel. The Play button must be disabled when no selected/library voicing is available.

- [ ] **Step 2: Preserve the selected library voicing**

When rendering each chord-library voicing, attach its existing voicing object to the play button or row using a closure/event listener. The selected/current voicing must be the one shown by the control; do not regenerate a different voicing at click time.

- [ ] **Step 3: Build simultaneous chord events**

Convert each played voicing item into a MIDI event using its string's open MIDI pitch plus fret. Exclude muted strings and invalid frets. Use `start: 0` for every chord tone and a duration derived from tempo, so all tones begin together. If no playable tones remain, report the explicit empty-voicing message and do not start audio.

- [ ] **Step 4: Cancel stale chord playback**

Call the shared stop operation before rerendering after instrument, tuning, key, chord-quality, inversion, fret-range, or position changes. Update Play/Stop pressed states after every render.

- [ ] **Step 5: Commit chord playback**

```sh
git add chords.html assets/app.js assets/app.css
git commit -m "Add chord voicing playback"
```

### Task 4: Add triad shape and arpeggio playback

**Files:**
- Modify: `triads.html`
- Modify: `assets/app.js`
- Modify: `assets/app.css`

- [ ] **Step 1: Add triad playback controls**

Place Play/Stop controls beside the triad trainer actions and expose `#playbackStatus` with `role="status"`. The control label must identify the selected shape, string group, inversion, and current key where available.

- [ ] **Step 2: Select the correct triad source**

For map mode, use `triadForSelection()` tones in root-to-third-to-fifth order, using the selected key's root MIDI octave. For shape mode and revealed quiz mode, use `currentTriadShape()` and its concrete string/fret entries. Do not play hidden quiz solutions until the user reveals the solution; keep the Play button disabled while concealed.

- [ ] **Step 3: Build ordered arpeggio events**

Map each playable shape tone to its actual string/fret MIDI pitch, order by the selected inversion/shape order, and assign equal sequential starts based on tempo. Use one shared duration per tone with a short gap before the next tone. Report an empty-shape error instead of starting silence.

- [ ] **Step 4: Cancel playback on trainer changes**

Stop playback when changing study mode, string group, inversion, labels, shape navigation, exercise generation, key, instrument, tuning, or fret position. Re-render button state and status after each change.

- [ ] **Step 5: Commit triad playback**

```sh
git add triads.html assets/app.js assets/app.css
git commit -m "Add triad shape playback"
```

### Task 5: Add progression playback and active-bar timing

**Files:**
- Modify: `progressions.html`
- Modify: `assets/app.js`
- Modify: `assets/app.css`

- [ ] **Step 1: Add progression transport controls**

Add Play/Stop and tempo controls to the progression panel, plus `#playbackStatus`. Keep the existing bar buttons independently clickable for selection.

- [ ] **Step 2: Build one event group per progression bar**

For each `currentProgression().bars` entry, call `chordForBar(barData)` and convert its chord tones to a compact root-position voicing around middle C. Create simultaneous events for each bar at `start = barIndex * barDuration`, where `barDuration = 240 / tempo` for four beats per bar. Include `barIndex` metadata in the internal event list so `onEvent` can update `state.currentBar`.

- [ ] **Step 3: Wire progress and cancellation**

On playback start, set the first bar active. On each event/bar callback, update `state.currentBar`, save state only when the bar changes, and rerender only the progression grid/current details needed for visual feedback. On completion or stop, restore the previously selected bar or leave the final bar selected consistently; document the chosen behavior in code.

- [ ] **Step 4: Cancel when progression state changes**

Stop playback when family, progression, selected bar, key, tempo, instrument, tuning, or relevant layers change. Ensure stale callbacks compare their playback token before mutating `state.currentBar`.

- [ ] **Step 5: Commit progression playback**

```sh
git add progressions.html assets/app.js assets/app.css
git commit -m "Add progression playback"
```

### Task 6: Finish styling, documentation, and browser validation

**Files:**
- Modify: `assets/app.css`
- Modify: `README.md`

- [ ] **Step 1: Style shared controls and interactive fret cells**

Add styles for `.playback-controls`, `.playback-status`, `.playback-button`, and `.fret-cell:focus-visible`/`.fret-cell.is-playing`. Keep controls wrapping cleanly below 576px and preserve the existing panel visual language.

- [ ] **Step 2: Document the feature**

Update `README.md` to state that scales, individual notes, chord voicings, triad shapes, and progressions are playable in browsers with Web Audio support. Mention that audio begins after user interaction and that no backend or external dependency is required.

- [ ] **Step 3: Run the complete manual validation matrix**

Run:

```sh
python3 -m http.server
```

Check each page:

1. Click and keyboard-activate open, fretted, and unavailable fret cells.
2. Start/stop a scale, replace one scale with another, and change key/layers during playback.
3. Play a chord voicing and confirm all tones start together; change tuning during playback.
4. Play a visible triad shape, verify ordered notes, and confirm concealed quiz solutions cannot play.
5. Play a progression, verify bar highlighting advances at tempo, stop it, and change progression/key during playback.
6. Reload and verify tempo persistence if enabled.
7. In a browser without Web Audio support or with context creation forced to fail, verify the visible status message and no uncaught errors.

- [ ] **Step 4: Inspect final diff and commit**

```sh
git diff --check
git status --short
git add assets/audio.js assets/app.js assets/app.css index.html chords.html triads.html progressions.html README.md
git commit -m "Complete playback controls across FretLab"
```
