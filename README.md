# FretLab

FretLab is a standalone browser prototype for exploring guitar and bass fretboards. It maps scales, progressions, triads, chord tones, guide tones, target notes, root-fifth shapes, and suggested vocabulary on one interactive fretboard.

The app is plain HTML, CSS, and JavaScript. There is no build step, package manager, backend, or remote runtime dependency. Bootstrap is vendored locally in `assets/bootstrap.min.css`; app data lives in `assets/data.js`, and the shared interaction logic lives in `assets/app.js`.

## Use

Open `index.html` in a browser.

The top navigation links to the three current tools:

- `index.html` - scale layers on a fretboard
- `progressions.html` - chord progressions, current-bar analysis, and chord-relative vocabulary
- `triads.html` - compact triad maps by root and quality

If a local server is preferred:

```sh
python3 -m http.server
```

Then open `http://localhost:8000/`.

## Current Features

- Guitar and bass fretboards.
- Key selection with sharp/flat spelling.
- Note-label and interval-label modes.
- 12, 15, 17, 20, and 24 fret ranges.
- Position filters: full range, open position, low box, middle box, upper box, octave box, and high range.
- Browser-local state persistence through `localStorage`.
- Local Bootstrap-based controls with custom fretboard styling.

## Tools

### Scales

The scales page lets you combine multiple key-relative scale layers on the same fretboard. The default view highlights major blues and minor blues, and an active scale palette shows the notes and interval roles for selected layers.

Included scale families:

- Common: major, natural minor, melodic minor, harmonic minor
- Pentatonic / blues: major pentatonic, minor pentatonic, blues / minor blues, major blues, rock and roll
- Modes: Ionian, Dorian, Phrygian, Lydian, Mixolydian, Aeolian, Locrian
- Bebop / symmetric: Dorian bebop, Mixolydian bebop, whole tone, half whole diminished, whole half diminished
- World / exotic: Spanish, Persian, Gypsy major, Gypsy minor

### Progressions

The progressions page combines a progression selector, family filter, interactive bar grid, current-chord details, fretboard layers, focus modes, and chord-relative vocabulary suggestions.

Fretboard layers:

- Chord tones
- Guide tones
- Target notes
- Root + fifth

Progression families:

- Blues: 12-bar major blues, 12-bar quick change, 12-bar minor blues, jazz blues, minor jazz blues
- Jazz cadences: ii-V-I major, ii-V-i minor, backdoor ii-V-I, tritone sub ii-bII-I
- Rhythm changes: rhythm changes A
- Turnarounds: I-VI-II-V, III-VI-II-V, Lady Bird turnaround
- Modal vamps: ii7-V7, Dorian i7-IV7, Aeolian i-bVII-bVI-bVII, Phrygian i-bII, suspended I-bVII
- Diatonic / pop: I-V-vi-IV, vi-IV-I-V, I-vi-IV-V, canon sequence, diatonic circle
- Minor harmony: i-iv-V, Andalusian cadence, i-bVI-bVII, minor circle cadence
- Advanced jazz: Coltrane cycle cell, Bird blues

Suggested vocabulary includes the current triad, major/minor/diminished/augmented triads, common scales, Mixolydian, Dorian, dominant bebop, diminished dominant, altered scale, and 7/9/13 arpeggios.

### Triads

The triads page maps a selected root and triad quality across the fretboard.

Included triad qualities:

- Major
- Minor
- Diminished
- Augmented

Available layers are triad tones and root + fifth, with focus modes for all active layers, triad tones, or root + fifth.

## Instruments and Tunings

Guitar tunings:

- Standard
- Drop D
- DADGAD
- Open D
- Open G
- Open C
- Open E
- Half-step down
- All fourths

Bass tunings:

- Standard
- Drop D
- BEAD
- Tenor
- Half-step down

## Project Layout

- `index.html` - scales tool
- `progressions.html` - progressions tool
- `triads.html` - triads tool
- `assets/data.js` - notes, chords, scales, progressions, vocabulary, instruments, tunings, and fret positions
- `assets/app.js` - shared rendering, state, controls, fretboard logic, tabs, and vocabulary behavior
- `assets/app.css` - application styles
- `assets/bootstrap.min.css` - vendored Bootstrap CSS

## License

MIT.
