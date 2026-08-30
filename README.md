# FretLab

FretLab is a static browser app for studying scales, chords, progressions, and triads on guitar, bass, banjo, and ukulele fretboards. It combines interactive fingering maps, music-theory references, contextual listening examples, and browser-based audio in six focused practice tools.

Live app: [https://simoz.github.io/fretlab/](https://simoz.github.io/fretlab/)

## Run Locally

No build step, package manager, backend, or installation is required. Clone or download the repository and open `index.html` in a modern browser.

Some browsers apply stricter policies to pages opened directly from disk. In that case, serve the directory locally:

```sh
python3 -m http.server
```

Then open [http://localhost:8000/](http://localhost:8000/).

## Tools

The navigation bar links six pages:

- `index.html` — scale layers and contextual listening
- `chords.html` — practical chord-voicing library
- `progressions.html` — progression analysis and chord-relative vocabulary
- `triads.html` — triad maps, compact shapes, and quizzes
- `repertoire.html` — searchable index of every scale listening example
- `metronome.html` — visual and audible practice pulse

### Scales

The scales tool can display multiple key-relative scale layers on the same fretboard. Minor blues is active by default. Each selected scale has a colour-coded palette entry containing:

- quality and distinguishing intervallic character
- common musical uses
- notes and interval roles in the selected key
- its own ascending-and-descending playback control

The descriptions explain intervallic colour and typical use, not a fixed emotional meaning. Enharmonic key choices share the same pitch class while retaining the chosen sharp or flat spelling in the interface.

When a sufficiently reliable match exists, **Hear it in context** associates the active scale with recordings in the selected tonic. Each example identifies the artist, track, tonal context, and a specific detail to listen for. Links open a YouTube search or the Spotify app. Ambiguous or unverified scale-and-key matches are intentionally omitted.

Included scale families:

- Common: major, natural minor, melodic minor, harmonic minor
- Pentatonic / blues: major pentatonic, minor pentatonic, blues / minor blues, major blues, rock and roll
- Modes: Ionian, Dorian, Phrygian, Lydian, Mixolydian, Aeolian, Locrian
- Bebop / symmetric: Dorian bebop, Mixolydian bebop, whole tone, half-whole diminished, whole-half diminished
- World / exotic: Phrygian dominant / Flamenco, Spanish, Persian, double harmonic major, Hungarian minor

### Chords

The chord library generates practical voicings for the selected instrument, tuning, root, chord type, fret range, and position. Results are grouped by the lowest sounding chord tone, so root position and every available inversion can be selected directly.

The selected voicing is summarized in a compact details panel and can be heard as a sustained chord from its separate playback panel. Individual visible fretboard notes are also playable.

Included chord types:

- Major, minor, power chord, diminished, augmented
- Suspended 2 and suspended 4
- Major 6 and minor 6
- Major 7, dominant 7, minor 7, minor-major 7, dominant 7sus4, half-diminished 7, diminished 7
- Add 9, minor add 9, major 9, dominant 9, minor 9

### Progressions

The progressions tool combines a family filter, progression selector, interactive bar grid, current-chord analysis, combinable fretboard layers, chord-relative vocabulary suggestions, and contextual song references.

The inline player beside the progression supports tempos from 40 to 240 BPM. During playback the active bar advances visually; when playback stops or completes, the previously selected bar is restored.

Fretboard layers:

- Chord tones
- Guide tones
- Target notes — characteristic melodic landing tones, commonly the 3rd and 7th rather than the key tonic or chord root
- Root + fifth

Every progression includes a compact song-reference card below the fretboard. It identifies the artist, recording key, actual chord sequence, and the part of the song where the progression occurs. A badge distinguishes an exact match from a section-only match or a useful variant, so similar harmonic movement is not presented as a note-for-note correspondence. Each card includes YouTube and Spotify search links.

Progression families:

- Blues: 12-bar major blues, quick change, minor blues, jazz blues, minor jazz blues
- Jazz cadences: ii-V-I major, ii-V-i minor, backdoor ii-V-I, tritone-substitution ii-bII-I
- Rhythm changes: rhythm changes A
- Turnarounds: I-VI-II-V, III-VI-II-V, Lady Bird turnaround
- Modal vamps: ii7-V7, Dorian i7-IV7, Aeolian i-bVII-bVI-bVII, Phrygian i-bII, suspended I-bVII
- Diatonic / pop: I-V-vi-IV, vi-IV-I-V, I-vi-IV-V, canon sequence, diatonic circle
- Minor harmony: i-iv-V, Andalusian cadence, i-bVI-bVII, minor circle cadence
- Advanced jazz: Coltrane cycle cell, Bird blues

Suggested vocabulary covers triads, common scales, modal and bebop choices, altered and diminished-dominant colours, and 7/9/13 arpeggios. Suggestions can be applied together or adjusted individually.

### Repertoire

The repertoire page collects every scale listening example into one searchable view. Tracks are grouped by artist and title while retaining all associated scale contexts. Filters can narrow the collection by free-text search, scale, or artist, and each entry links to YouTube and Spotify.

### Triads

The triads tool maps major, minor, diminished, and augmented triads across the fretboard. The full map can be limited to a three-string group, while the trainer offers three study modes:

- Full map — displays all available triad tones
- One shape — isolates a compact voicing for a chosen string group and inversion
- Quiz — generates a concealed exercise that must be revealed before playback

Shape mode reports the current shape and fret span. Circular previous/next navigation is enabled only when the selected fret range contains multiple shapes. Labels can show note names, intervals, or remain hidden.

The listening panel plays the complete map or current shape as an ordered arpeggio. Available fretboard layers and focus modes are triad tones and root + fifth.

### Metronome

The metronome provides a Web Audio pulse with:

- a 30–300 BPM range, controlled by slider, number input, or step buttons
- tap tempo
- two to seven beats per bar
- visual beat indicators
- optional first-beat accent
- keyboard controls: Space starts or stops; arrow keys adjust the tempo

Its tempo, meter, and accent settings are saved in the browser.

## Shared Fretboard Features

- Guitar, bass, banjo, and ukulele support
- Instrument-specific tuning selection
- Note-name and interval-label modes
- Enharmonic sharp/flat key spellings
- 12, 15, 17, 20, and 24 fret ranges
- Full range, open position, low, middle, upper, octave, and high position filters
- Clickable and keyboard-activatable notes with pitch playback
- Tool-specific layer controls and focused study modes where applicable
- Browser-local state persistence through `localStorage`
- Responsive Bootstrap-based controls and custom fretboard styling

## Audio

Fretboard notes, scales, chord voicings, triad shapes, and progressions use the shared Web Audio player in `assets/audio.js`. Scale, triad, and progression playback support tempos from 40 to 240 BPM. Controls switch between play and stop states, active notes or bars are highlighted, and short status or error notifications disappear automatically.

Playback starts only after a user gesture, as required by browser audio policies. Browsers without Web Audio support show an in-app error instead of failing silently. The synthesised playback is generated locally; only the optional YouTube and Spotify listening links leave the app.

## Localization

The complete interface is available in English and Italian, including dynamically rendered controls, scale descriptions, progression references, playback feedback, and every contextual listening note.

The language switch appears at the top right. On the first visit FretLab follows the browser language when it is Italian and otherwise uses English. The selection is then persisted in `localStorage` and shared by all six tools.

## Instruments and Tunings

### Guitar

- Standard
- Drop D
- DADGAD
- Open D
- Open G
- Open C
- Open E
- Half-step down
- All fourths

### Bass

- Standard (4-string)
- Standard (5-string, BEADG)
- Standard (6-string, BEADGC)
- Drop D
- BEAD
- Tenor
- Half-step down

### Banjo

- Open G
- G minor
- C tuning
- Double C
- Sawmill
- Double D
- Open D

Short fifth strings are rendered from their actual starting fret.

### Ukulele

- Standard (GCEA)
- Low G (GCEA)
- D tuning (ADF#B)
- Baritone (DGBE)

## Technical Overview

FretLab is written in plain HTML, CSS, and JavaScript. Bootstrap CSS is vendored locally, application data is declared in JavaScript, and no remote runtime dependency is required.

- `index.html` — scales tool
- `chords.html` — chord library
- `progressions.html` — progression tool
- `triads.html` — triad map and trainer
- `repertoire.html` — unified listening repertoire
- `metronome.html` — metronome
- `assets/data.js` — notes, keys, chords, scales, contextual examples, progressions, vocabulary, instruments, tunings, and fret positions
- `assets/app.js` — shared state, rendering, controls, fretboard interaction, chord generation, progression references, triad training, and playback integration
- `assets/repertoire.js` — repertoire aggregation, filtering, and listening links
- `assets/audio.js` — shared Web Audio event player
- `assets/i18n.js` — language detection, switching, persistence, and interface translations
- `assets/i18n-examples.js` — Italian translations for contextual listening descriptions
- `assets/metronome.js` — metronome timing, audio, controls, and persistence
- `assets/app.css` — application and responsive styles
- `assets/bootstrap.min.css` — vendored Bootstrap CSS

## License

MIT.
