# Playback Design

## Goal

Add browser playback for the project's musical content: individual fretboard notes, scales, chord voicings, triad shapes, and chord progressions. The feature must preserve FretLab's standalone, zero-build architecture and work without a backend or external runtime dependency.

## User experience

- Clicking a fretboard note plays that note. The same action must be usable from keyboard focus with Enter or Space.
- Scale palette entries expose Play/Stop controls for ascending and descending playback.
- Chord voicings expose Play/Stop controls. Chord tones sound together.
- Triad shapes expose Play/Stop controls. Triad tones play as an ordered arpeggio.
- Progressions expose Play/Stop and tempo controls. Each chord is scheduled as a timed bar, and the active bar is reflected in the existing progression UI where practical.
- A compact tempo control is available for sequences that need timing. The default is a moderate fixed tempo.
- Playback uses a quiet synthesized triangle-wave voice with a short envelope.
- Controls expose accessible pressed, disabled, and stop states and remain usable on mobile.

## Architecture

Create a shared `assets/audio.js` module used by all tools. It owns:

- Lazy creation and resumption of one browser `AudioContext`.
- MIDI-note-to-frequency conversion.
- Scheduling of individual notes and note sequences.
- Active oscillator tracking and cleanup.
- A cancellable playback token so starting new content stops prior content.
- Explicit handling for unavailable audio contexts and empty or invalid sequences.

`assets/app.js` will use this module for fretboard note clicks and scale palette playback. Chord, triad, and progression rendering will add page-specific sequence builders and controls while reusing the shared scheduling and cancellation behavior. Existing musical data remains the source of truth; playback adapters translate selected voicings, shapes, and bars into note events.

Playback is cancelled when a new sequence starts and when musical selections change, including instrument, tuning, key, layer, or relevant page state. No audio is created before a user gesture. If Web Audio is unavailable, the UI shows a concise unavailable-audio message rather than silently failing.

## Data flow

1. Existing state and rendered controls identify the selected notes or musical object.
2. A page-specific adapter validates and converts that object into ordered note events, including pitch, start offset, duration, and optional bar/index metadata.
3. `assets/audio.js` resumes the context after the user gesture, schedules the events, and reports the active playback token.
4. UI controls update their pressed/playing state and, for progressions, update the active bar while the token remains current.
5. Stop, replacement playback, or state changes invalidate the token, clear timers, stop active voices, and restore idle controls.

Scales play the selected key's scale ascending through the octave and descending back to the root. Chords play simultaneous tones. Triads play selected tones in order. Progressions schedule each bar according to tempo and use the selected chord tones or voicing data available on the page.

## Error handling and compatibility

- Do not catch broad errors or convert failures into successful playback.
- Treat missing Web Audio support as an explicit, user-visible unsupported state.
- Ignore no invalid input silently: sequence builders should return a clear empty/invalid result that the UI can report consistently.
- Repeated clicks and rapid replacement must be safe; stale timers and oscillator callbacks must not alter current controls.
- Keep browser-local persistence limited to playback preferences such as tempo if persistence is added.

## Testing and validation

Add or update the smallest existing test coverage available for:

- MIDI frequency conversion and sequence normalization.
- Empty and invalid sequence handling.
- Playback cancellation and replacement.
- Chord simultaneity versus triad ordered playback.
- Progression timing and active-bar updates.
- Control wiring and accessible pressed/stop states.

Validate manually in a browser because Web Audio scheduling and user-gesture behavior cannot be fully verified by pure helpers: click fretboard notes, play scales, play chord and triad content, play progressions, stop and replace playback, change selections during playback, and exercise unsupported/suspended audio behavior where available.

## Scope boundaries

This version does not add MIDI output, recorded samples, external instrument integrations, looping practice modes, or a backend. It also does not redesign the existing musical data model; it adds playback adapters around the current state and data.
