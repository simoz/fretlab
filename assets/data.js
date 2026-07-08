(() => {
  "use strict";

const NOTE_NAMES_SHARP = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const NOTE_NAMES_FLAT = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

const KEY_OPTIONS = [
  { label: "C", pc: 0, flats: false },
  { label: "C#", pc: 1, flats: false },
  { label: "Db", pc: 1, flats: true },
  { label: "D", pc: 2, flats: false },
  { label: "Eb", pc: 3, flats: true },
  { label: "E", pc: 4, flats: false },
  { label: "F", pc: 5, flats: true },
  { label: "F#", pc: 6, flats: false },
  { label: "Gb", pc: 6, flats: true },
  { label: "G", pc: 7, flats: false },
  { label: "Ab", pc: 8, flats: true },
  { label: "A", pc: 9, flats: false },
  { label: "Bb", pc: 10, flats: true },
  { label: "B", pc: 11, flats: false }
];

const DEGREE_INTERVALS = {
  I: 0,
  bII: 1,
  II: 2,
  bIII: 3,
  III: 4,
  IV: 5,
  "#IV": 6,
  V: 7,
  bVI: 8,
  VI: 9,
  bVII: 10,
  VII: 11
};

const CHORDS = {
  maj: {
    name: "major triad",
    suffix: "",
    intervals: [0, 4, 7],
    roles: ["R", "3", "5"],
    targets: [1]
  },
  m: {
    name: "minor triad",
    intervals: [0, 3, 7],
    roles: ["R", "b3", "5"],
    targets: [1]
  },
  dim: {
    name: "diminished triad",
    suffix: "dim",
    intervals: [0, 3, 6],
    roles: ["R", "b3", "b5"],
    targets: [1, 2]
  },
  aug: {
    name: "augmented triad",
    suffix: "aug",
    intervals: [0, 4, 8],
    roles: ["R", "3", "#5"],
    targets: [1, 2]
  },
  sus4: {
    name: "suspended fourth",
    intervals: [0, 5, 7],
    roles: ["R", "4", "5"],
    targets: [1]
  },
  maj7: {
    name: "major seventh",
    intervals: [0, 4, 7, 11],
    roles: ["R", "3", "5", "7"],
    targets: [1, 3]
  },
  "7": {
    name: "dominant seventh",
    intervals: [0, 4, 7, 10],
    roles: ["R", "3", "5", "b7"],
    targets: [1, 3]
  },
  m7: {
    name: "minor seventh",
    intervals: [0, 3, 7, 10],
    roles: ["R", "b3", "5", "b7"],
    targets: [1, 3]
  },
  m7b5: {
    name: "half-diminished seventh",
    intervals: [0, 3, 6, 10],
    roles: ["R", "b3", "b5", "b7"],
    targets: [1, 3]
  },
  dim7: {
    name: "diminished seventh",
    intervals: [0, 3, 6, 9],
    roles: ["R", "b3", "b5", "bb7"],
    targets: [1, 3]
  }
};

const TRIAD_QUALITY_OPTIONS = [
  { value: "maj", label: "Major" },
  { value: "m", label: "Minor" },
  { value: "dim", label: "Diminished" },
  { value: "aug", label: "Augmented" }
];

const SCALES = {
  major: {
    label: "Major scale",
    family: "Common",
    intervals: [0, 2, 4, 5, 7, 9, 11],
    roles: ["1", "2", "3", "4", "5", "6", "7"]
  },
  naturalMinor: {
    label: "Natural minor",
    family: "Common",
    intervals: [0, 2, 3, 5, 7, 8, 10],
    roles: ["1", "2", "b3", "4", "5", "b6", "b7"]
  },
  melodicMinor: {
    label: "Melodic minor",
    family: "Common",
    intervals: [0, 2, 3, 5, 7, 9, 11],
    roles: ["1", "2", "b3", "4", "5", "6", "7"]
  },
  harmonicMinor: {
    label: "Harmonic minor",
    family: "Common",
    intervals: [0, 2, 3, 5, 7, 8, 11],
    roles: ["1", "2", "b3", "4", "5", "b6", "7"]
  },
  majorPentatonic: {
    label: "Major pentatonic",
    family: "Pentatonic / blues",
    intervals: [0, 2, 4, 7, 9],
    roles: ["1", "2", "3", "5", "6"]
  },
  minorPentatonic: {
    label: "Minor pentatonic",
    family: "Pentatonic / blues",
    intervals: [0, 3, 5, 7, 10],
    roles: ["1", "b3", "4", "5", "b7"]
  },
  minorBlues: {
    label: "Blues / minor blues",
    family: "Pentatonic / blues",
    intervals: [0, 3, 5, 6, 7, 10],
    roles: ["1", "b3", "4", "b5", "5", "b7"]
  },
  majorBlues: {
    label: "Major blues",
    family: "Pentatonic / blues",
    intervals: [0, 2, 3, 4, 7, 9],
    roles: ["1", "2", "b3", "3", "5", "6"]
  },
  rockAndRoll: {
    label: "Rock and roll",
    family: "Pentatonic / blues",
    intervals: [0, 2, 3, 4, 5, 6, 7, 9, 10],
    roles: ["1", "2", "b3", "3", "4", "b5", "5", "6", "b7"]
  },
  ionian: {
    label: "Ionian",
    family: "Modes",
    intervals: [0, 2, 4, 5, 7, 9, 11],
    roles: ["1", "2", "3", "4", "5", "6", "7"]
  },
  dorian: {
    label: "Dorian",
    family: "Modes",
    intervals: [0, 2, 3, 5, 7, 9, 10],
    roles: ["1", "2", "b3", "4", "5", "6", "b7"]
  },
  phrygian: {
    label: "Phrygian",
    family: "Modes",
    intervals: [0, 1, 3, 5, 7, 8, 10],
    roles: ["1", "b2", "b3", "4", "5", "b6", "b7"]
  },
  lydian: {
    label: "Lydian",
    family: "Modes",
    intervals: [0, 2, 4, 6, 7, 9, 11],
    roles: ["1", "2", "3", "#4", "5", "6", "7"]
  },
  mixolydian: {
    label: "Mixolydian",
    family: "Modes",
    intervals: [0, 2, 4, 5, 7, 9, 10],
    roles: ["1", "2", "3", "4", "5", "6", "b7"]
  },
  aeolian: {
    label: "Aeolian",
    family: "Modes",
    intervals: [0, 2, 3, 5, 7, 8, 10],
    roles: ["1", "2", "b3", "4", "5", "b6", "b7"]
  },
  locrian: {
    label: "Locrian",
    family: "Modes",
    intervals: [0, 1, 3, 5, 6, 8, 10],
    roles: ["1", "b2", "b3", "4", "b5", "b6", "b7"]
  },
  dorianBebop: {
    label: "Dorian bebop",
    family: "Bebop / symmetric",
    intervals: [0, 2, 3, 4, 5, 7, 9, 10],
    roles: ["1", "2", "b3", "3", "4", "5", "6", "b7"]
  },
  mixolydianBebop: {
    label: "Mixolydian bebop",
    family: "Bebop / symmetric",
    intervals: [0, 2, 4, 5, 7, 9, 10, 11],
    roles: ["1", "2", "3", "4", "5", "6", "b7", "7"]
  },
  wholeTone: {
    label: "Whole tone",
    family: "Bebop / symmetric",
    intervals: [0, 2, 4, 6, 8, 10],
    roles: ["1", "2", "3", "#4", "#5", "b7"]
  },
  halfWholeDiminished: {
    label: "Half whole diminished",
    family: "Bebop / symmetric",
    intervals: [0, 1, 3, 4, 6, 7, 9, 10],
    roles: ["1", "b2", "#2", "3", "b5", "5", "6", "b7"]
  },
  wholeHalfDiminished: {
    label: "Whole half diminished",
    family: "Bebop / symmetric",
    intervals: [0, 2, 3, 5, 6, 8, 9, 11],
    roles: ["1", "2", "b3", "4", "b5", "#5", "6", "7"]
  },
  spanish: {
    label: "Spanish",
    family: "World / exotic",
    intervals: [0, 1, 3, 4, 5, 6, 8, 10],
    roles: ["1", "b2", "b3", "3", "4", "b5", "b6", "b7"]
  },
  persian: {
    label: "Persian",
    family: "World / exotic",
    intervals: [0, 1, 4, 5, 6, 8, 11],
    roles: ["1", "b2", "3", "4", "b5", "b6", "7"]
  },
  gypsyMajor: {
    label: "Gypsy major",
    family: "World / exotic",
    intervals: [0, 1, 4, 5, 7, 8, 11],
    roles: ["1", "b2", "3", "4", "5", "b6", "7"]
  },
  gypsyMinor: {
    label: "Gypsy minor",
    family: "World / exotic",
    intervals: [0, 2, 3, 6, 7, 8, 11],
    roles: ["1", "2", "b3", "#4", "5", "b6", "7"]
  }
};

const PROGRESSIONS = {
  major: {
    label: "12-bar major blues",
    family: "Blues",
    summary: "Classic I7-IV7-V7 form with the V chord in bar 12.",
    bars: [
      bar("I", "7", "I7"),
      bar("I", "7", "I7"),
      bar("I", "7", "I7"),
      bar("I", "7", "I7"),
      bar("IV", "7", "IV7"),
      bar("IV", "7", "IV7"),
      bar("I", "7", "I7"),
      bar("I", "7", "I7"),
      bar("V", "7", "V7"),
      bar("IV", "7", "IV7"),
      bar("I", "7", "I7"),
      bar("V", "7", "V7")
    ]
  },
  quickChange: {
    label: "12-bar quick change",
    family: "Blues",
    summary: "Major blues with IV7 in bar 2 for an earlier harmonic lift.",
    bars: [
      bar("I", "7", "I7"),
      bar("IV", "7", "IV7"),
      bar("I", "7", "I7"),
      bar("I", "7", "I7"),
      bar("IV", "7", "IV7"),
      bar("IV", "7", "IV7"),
      bar("I", "7", "I7"),
      bar("I", "7", "I7"),
      bar("V", "7", "V7"),
      bar("IV", "7", "IV7"),
      bar("I", "7", "I7"),
      bar("V", "7", "V7")
    ]
  },
  minor: {
    label: "12-bar minor blues",
    family: "Blues",
    summary: "Minor i7 and iv7 colors with a dominant V7 turnaround.",
    bars: [
      bar("I", "m7", "i7"),
      bar("I", "m7", "i7"),
      bar("I", "m7", "i7"),
      bar("I", "m7", "i7"),
      bar("IV", "m7", "iv7"),
      bar("IV", "m7", "iv7"),
      bar("I", "m7", "i7"),
      bar("I", "m7", "i7"),
      bar("V", "7", "V7"),
      bar("IV", "m7", "iv7"),
      bar("I", "m7", "i7"),
      bar("V", "7", "V7")
    ]
  },
  jazzBlues: {
    label: "Jazz blues",
    family: "Blues",
    summary: "A 12-bar blues with diminished passing harmony and a ii-V turnaround.",
    bars: [
      bar("I", "7", "I7"),
      bar("IV", "7", "IV7"),
      bar("I", "7", "I7"),
      bar("I", "7", "I7"),
      bar("IV", "7", "IV7"),
      bar("#IV", "dim7", "#IVdim7"),
      bar("I", "7", "I7"),
      bar("VI", "7", "VI7"),
      bar("II", "m7", "ii7"),
      bar("V", "7", "V7"),
      bar("I", "7", "I7"),
      bar("V", "7", "V7")
    ]
  },
  minorJazzBlues: {
    label: "Minor jazz blues",
    family: "Blues",
    summary: "Minor blues with a diminished passing chord, bVI7, and a minor ii-V.",
    bars: [
      bar("I", "m7", "i7"),
      bar("IV", "m7", "iv7"),
      bar("I", "m7", "i7"),
      bar("I", "m7", "i7"),
      bar("IV", "m7", "iv7"),
      bar("#IV", "dim7", "#IVdim7"),
      bar("I", "m7", "i7"),
      bar("bVI", "7", "bVI7"),
      bar("II", "m7b5", "iim7b5"),
      bar("V", "7", "V7"),
      bar("I", "m7", "i7"),
      bar("V", "7", "V7")
    ]
  },
  iiVI: {
    label: "ii-V-I major",
    family: "Jazz cadences",
    summary: "Major ii-V-I cadence with an extra tonic bar for resolution.",
    bars: [
      bar("II", "m7", "ii7"),
      bar("V", "7", "V7"),
      bar("I", "maj7", "Imaj7"),
      bar("I", "maj7", "Imaj7")
    ]
  },
  iiViMinor: {
    label: "ii-V-i minor",
    family: "Jazz cadences",
    summary: "Minor ii-V-i cadence using half-diminished ii and minor tonic.",
    bars: [
      bar("II", "m7b5", "iim7b5"),
      bar("V", "7", "V7"),
      bar("I", "m7", "i7"),
      bar("I", "m7", "i7")
    ]
  },
  rhythmChangesA: {
    label: "Rhythm changes A",
    family: "Rhythm changes",
    summary: "Eight-bar A-section turnaround movement through I, VI, ii, and V.",
    bars: [
      bar("I", "maj7", "Imaj7"),
      bar("VI", "7", "VI7"),
      bar("II", "m7", "ii7"),
      bar("V", "7", "V7"),
      bar("III", "m7", "iii7"),
      bar("VI", "7", "VI7"),
      bar("II", "m7", "ii7"),
      bar("V", "7", "V7")
    ]
  },
  turnaround: {
    label: "Turnaround I-VI-II-V",
    family: "Turnarounds",
    summary: "Four-bar turnaround with secondary dominants into V.",
    bars: [
      bar("I", "maj7", "Imaj7"),
      bar("VI", "7", "VI7"),
      bar("II", "7", "II7"),
      bar("V", "7", "V7")
    ]
  },
  modalVamp: {
    label: "Modal vamp ii7-V7",
    family: "Modal vamps",
    summary: "Two-chord Dorian/Mixolydian vamp, like Dm7 to G7 in C.",
    bars: [
      bar("II", "m7", "ii7"),
      bar("V", "7", "V7")
    ]
  },
  dorianVamp: {
    label: "Dorian vamp i7-IV7",
    family: "Modal vamps",
    summary: "Minor tonic vamp with a dominant IV color for Dorian practice.",
    bars: [
      bar("I", "m7", "i7"),
      bar("IV", "7", "IV7")
    ]
  },
  aeolianVamp: {
    label: "Aeolian vamp i-bVII-bVI-bVII",
    family: "Modal vamps",
    summary: "Natural minor rock/modal loop centered on i, bVII, and bVI.",
    bars: [
      bar("I", "m", "i"),
      bar("bVII", "maj", "bVII"),
      bar("bVI", "maj", "bVI"),
      bar("bVII", "maj", "bVII")
    ]
  },
  phrygianVamp: {
    label: "Phrygian vamp i-bII",
    family: "Modal vamps",
    summary: "Dark minor vamp emphasizing the bII Phrygian color.",
    bars: [
      bar("I", "m", "i"),
      bar("bII", "maj", "bII")
    ]
  },
  susVamp: {
    label: "Suspended vamp I-bVII",
    family: "Modal vamps",
    summary: "Open suspended sound for modal comping and pedal-tone phrasing.",
    bars: [
      bar("I", "sus4", "Isus4"),
      bar("bVII", "sus4", "bVIIsus4")
    ]
  },
  popAxis: {
    label: "I-V-vi-IV",
    family: "Diatonic / pop",
    summary: "Common four-chord major-key loop for pop, rock, and worship contexts.",
    bars: [
      bar("I", "maj", "I"),
      bar("V", "maj", "V"),
      bar("VI", "m", "vi"),
      bar("IV", "maj", "IV")
    ]
  },
  popAxisMinorStart: {
    label: "vi-IV-I-V",
    family: "Diatonic / pop",
    summary: "Relative-minor start on the axis progression, useful for melodic sequencing.",
    bars: [
      bar("VI", "m", "vi"),
      bar("IV", "maj", "IV"),
      bar("I", "maj", "I"),
      bar("V", "maj", "V")
    ]
  },
  dooWop: {
    label: "I-vi-IV-V",
    family: "Diatonic / pop",
    summary: "Classic doo-wop loop with a dominant V for a stronger cadence.",
    bars: [
      bar("I", "maj", "I"),
      bar("VI", "m", "vi"),
      bar("IV", "maj", "IV"),
      bar("V", "7", "V7")
    ]
  },
  canonSequence: {
    label: "Canon sequence",
    family: "Diatonic / pop",
    summary: "Eight-bar descending sequence: I-V-vi-iii-IV-I-IV-V.",
    bars: [
      bar("I", "maj", "I"),
      bar("V", "maj", "V"),
      bar("VI", "m", "vi"),
      bar("III", "m", "iii"),
      bar("IV", "maj", "IV"),
      bar("I", "maj", "I"),
      bar("IV", "maj", "IV"),
      bar("V", "maj", "V")
    ]
  },
  diatonicCircle: {
    label: "Diatonic circle",
    family: "Diatonic / pop",
    summary: "Major-key circle movement through I, IV, vii, iii, vi, ii, V, and I.",
    bars: [
      bar("I", "maj7", "Imaj7"),
      bar("IV", "maj7", "IVmaj7"),
      bar("VII", "m7b5", "viim7b5"),
      bar("III", "m7", "iii7"),
      bar("VI", "m7", "vi7"),
      bar("II", "m7", "ii7"),
      bar("V", "7", "V7"),
      bar("I", "maj7", "Imaj7")
    ]
  },
  minorOneFourFive: {
    label: "i-iv-V",
    family: "Minor harmony",
    summary: "Essential minor-key cadence with a harmonic-minor dominant V.",
    bars: [
      bar("I", "m", "i"),
      bar("IV", "m", "iv"),
      bar("V", "7", "V7"),
      bar("I", "m", "i")
    ]
  },
  andalusian: {
    label: "Andalusian cadence",
    family: "Minor harmony",
    summary: "Descending minor loop: i-bVII-bVI-V.",
    bars: [
      bar("I", "m", "i"),
      bar("bVII", "maj", "bVII"),
      bar("bVI", "maj", "bVI"),
      bar("V", "7", "V7")
    ]
  },
  minorRock: {
    label: "i-bVI-bVII",
    family: "Minor harmony",
    summary: "Minor rock loop for Aeolian melodies and power-chord vocabulary.",
    bars: [
      bar("I", "m", "i"),
      bar("bVI", "maj", "bVI"),
      bar("bVII", "maj", "bVII"),
      bar("I", "m", "i")
    ]
  },
  minorCircle: {
    label: "Minor circle cadence",
    family: "Minor harmony",
    summary: "Long minor-key circle movement ending with a ii-V-i resolution.",
    bars: [
      bar("I", "m7", "i7"),
      bar("IV", "m7", "iv7"),
      bar("bVII", "7", "bVII7"),
      bar("bIII", "maj7", "bIIImaj7"),
      bar("bVI", "maj7", "bVImaj7"),
      bar("II", "m7b5", "iim7b5"),
      bar("V", "7", "V7"),
      bar("I", "m7", "i7")
    ]
  },
  backdoorCadence: {
    label: "Backdoor ii-V-I",
    family: "Jazz cadences",
    summary: "Minor iv to bVII7 resolving into Imaj7.",
    bars: [
      bar("IV", "m7", "iv7"),
      bar("bVII", "7", "bVII7"),
      bar("I", "maj7", "Imaj7"),
      bar("I", "maj7", "Imaj7")
    ]
  },
  tritoneSubCadence: {
    label: "Tritone sub ii-bII-I",
    family: "Jazz cadences",
    summary: "ii7 into bII7 as a tritone substitution for V7.",
    bars: [
      bar("II", "m7", "ii7"),
      bar("bII", "7", "bII7"),
      bar("I", "maj7", "Imaj7"),
      bar("I", "maj7", "Imaj7")
    ]
  },
  secondaryDominants: {
    label: "III-VI-II-V",
    family: "Turnarounds",
    summary: "Dominant-chain turnaround moving by fifths back to I.",
    bars: [
      bar("III", "7", "III7"),
      bar("VI", "7", "VI7"),
      bar("II", "7", "II7"),
      bar("V", "7", "V7")
    ]
  },
  ladyBirdTurnaround: {
    label: "Lady Bird turnaround",
    family: "Turnarounds",
    summary: "Chromatic-color turnaround: Imaj7, bIII7, bVImaj7, bII7.",
    bars: [
      bar("I", "maj7", "Imaj7"),
      bar("bIII", "7", "bIII7"),
      bar("bVI", "maj7", "bVImaj7"),
      bar("bII", "7", "bII7")
    ]
  },
  coltraneCycle: {
    label: "Coltrane cycle cell",
    family: "Advanced jazz",
    summary: "Major-third cycle cell for practicing fast key-center shifts.",
    bars: [
      bar("I", "maj7", "Imaj7"),
      bar("bIII", "7", "bIII7"),
      bar("bVI", "maj7", "bVImaj7"),
      bar("VII", "7", "VII7"),
      bar("III", "maj7", "IIImaj7"),
      bar("V", "7", "V7"),
      bar("I", "maj7", "Imaj7")
    ]
  },
  birdBlues: {
    label: "Bird blues",
    family: "Advanced jazz",
    summary: "Bebop blues variant with faster ii-V motion through the form.",
    bars: [
      bar("I", "maj7", "Imaj7"),
      bar("VI", "m7b5", "vim7b5"),
      bar("II", "m7", "ii7"),
      bar("V", "7", "V7"),
      bar("I", "m7", "i7"),
      bar("IV", "7", "IV7"),
      bar("bVII", "m7", "bVIIm7"),
      bar("bIII", "7", "bIII7"),
      bar("VI", "m7", "vi7"),
      bar("II", "7", "II7"),
      bar("II", "m7", "ii7"),
      bar("V", "7", "V7")
    ]
  }
};

const VOCABULARY = {
  currentTriad: {
    label: "Current triad",
    type: "currentTriad"
  },
  majorTriad: {
    label: "Major triad",
    type: "structure",
    intervals: [0, 4, 7],
    roles: ["1", "3", "5"]
  },
  minorTriad: {
    label: "Minor triad",
    type: "structure",
    intervals: [0, 3, 7],
    roles: ["1", "b3", "5"]
  },
  diminishedTriad: {
    label: "Diminished triad",
    type: "structure",
    intervals: [0, 3, 6],
    roles: ["1", "b3", "b5"]
  },
  augmentedTriad: {
    label: "Augmented triad",
    type: "structure",
    intervals: [0, 4, 8],
    roles: ["1", "3", "#5"]
  },
  majorScale: {
    label: "Major scale",
    type: "scale",
    intervals: [0, 2, 4, 5, 7, 9, 11],
    roles: ["1", "2", "3", "4", "5", "6", "7"]
  },
  naturalMinorScale: {
    label: "Natural minor",
    type: "scale",
    intervals: [0, 2, 3, 5, 7, 8, 10],
    roles: ["1", "2", "b3", "4", "5", "b6", "b7"]
  },
  harmonicMinorScale: {
    label: "Harmonic minor",
    type: "scale",
    intervals: [0, 2, 3, 5, 7, 8, 11],
    roles: ["1", "2", "b3", "4", "5", "b6", "7"]
  },
  melodicMinorScale: {
    label: "Melodic minor",
    type: "scale",
    intervals: [0, 2, 3, 5, 7, 9, 11],
    roles: ["1", "2", "b3", "4", "5", "6", "7"]
  },
  majorPentatonic: {
    label: "Major pentatonic",
    type: "scale",
    intervals: [0, 2, 4, 7, 9],
    roles: ["1", "2", "3", "5", "6"]
  },
  minorPentatonic: {
    label: "Minor pentatonic",
    type: "scale",
    intervals: [0, 3, 5, 7, 10],
    roles: ["1", "b3", "4", "5", "b7"]
  },
  mixolydian: {
    label: "Mixolydian",
    type: "scale",
    intervals: [0, 2, 4, 5, 7, 9, 10],
    roles: ["1", "2", "3", "4", "5", "6", "b7"]
  },
  dorian: {
    label: "Dorian",
    type: "scale",
    intervals: [0, 2, 3, 5, 7, 9, 10],
    roles: ["1", "2", "b3", "4", "5", "6", "b7"]
  },
  dominantBebop: {
    label: "Dominant bebop",
    type: "scale",
    intervals: [0, 2, 4, 5, 7, 9, 10, 11],
    roles: ["1", "2", "3", "4", "5", "6", "b7", "7"]
  },
  diminishedDominant: {
    label: "Diminished dominant",
    type: "scale",
    intervals: [0, 1, 3, 4, 6, 7, 9, 10],
    roles: ["1", "b9", "#9", "3", "b5", "5", "13", "b7"]
  },
  altered: {
    label: "Altered scale",
    type: "scale",
    intervals: [0, 1, 3, 4, 6, 8, 10],
    roles: ["1", "b9", "#9", "3", "b5", "#5", "b7"]
  },
  arpeggio7: {
    label: "Arpeggio 7",
    type: "arpeggio",
    extensions: []
  },
  arpeggio9: {
    label: "Arpeggio 9",
    type: "arpeggio",
    extensions: [{ interval: 14, role: "9" }]
  },
  arpeggio13: {
    label: "Arpeggio 13",
    type: "arpeggio",
    extensions: [
      { interval: 14, role: "9" },
      { interval: 21, role: "13" }
    ]
  }
};

const DEFAULT_VOCABULARY = Object.fromEntries(Object.keys(VOCABULARY).map((key) => [key, false]));

const VOCABULARY_SUGGESTIONS = {
  maj: ["currentTriad", "majorTriad", "majorScale", "majorPentatonic", "arpeggio7"],
  m: ["currentTriad", "minorTriad", "naturalMinorScale", "minorPentatonic", "dorian"],
  sus4: ["majorPentatonic", "mixolydian"],
  maj7: ["currentTriad", "majorTriad", "majorScale", "majorPentatonic", "arpeggio7", "arpeggio9", "arpeggio13"],
  "7": ["currentTriad", "majorTriad", "mixolydian", "dominantBebop", "diminishedDominant", "altered", "arpeggio7", "arpeggio9", "arpeggio13"],
  m7: ["currentTriad", "minorTriad", "naturalMinorScale", "minorPentatonic", "dorian", "arpeggio7", "arpeggio9"],
  m7b5: ["currentTriad", "diminishedTriad", "arpeggio7"],
  dim7: ["currentTriad", "diminishedTriad", "arpeggio7"]
};

const INSTRUMENTS = {
  guitar: {
    label: "Guitar",
    defaultTuning: "standard"
  },
  bass: {
    label: "Bass",
    defaultTuning: "standard"
  }
};

const TUNINGS = {
  guitar: {
    standard: {
      label: "Standard",
      summary: "Standard tuning, high E on top.",
      tuning: notes("E", "B", "G", "D", "A", "E")
    },
    dropD: {
      label: "Drop D",
      summary: "Drop D tuning, high E on top.",
      tuning: notes("E", "B", "G", "D", "A", "D")
    },
    dadgad: {
      label: "DADGAD",
      summary: "DADGAD tuning, high D on top.",
      tuning: notes("D", "A", "G", "D", "A", "D")
    },
    openD: {
      label: "Open D",
      summary: "Open D tuning, high D on top.",
      tuning: notes("D", "A", "F#", "D", "A", "D")
    },
    openG: {
      label: "Open G",
      summary: "Open G tuning, high D on top.",
      tuning: notes("D", "B", "G", "D", "G", "D")
    },
    openC: {
      label: "Open C",
      summary: "Open C tuning, high E on top.",
      tuning: notes("E", "C", "G", "C", "G", "C")
    },
    openE: {
      label: "Open E",
      summary: "Open E tuning, high E on top.",
      tuning: notes("E", "B", "G#", "E", "B", "E")
    },
    halfStepDown: {
      label: "Half-step down",
      summary: "Half-step down tuning, high Eb on top.",
      tuning: notes("Eb", "Bb", "Gb", "Db", "Ab", "Eb")
    },
    allFourths: {
      label: "All fourths",
      summary: "All-fourths tuning, high F on top.",
      tuning: notes("F", "C", "G", "D", "A", "E")
    }
  },
  bass: {
    standard: {
      label: "Standard",
      summary: "4-string standard tuning, G on top.",
      tuning: notes("G", "D", "A", "E")
    },
    dropD: {
      label: "Drop D",
      summary: "4-string drop D tuning, G on top.",
      tuning: notes("G", "D", "A", "D")
    },
    bead: {
      label: "BEAD",
      summary: "BEAD tuning, high D on top.",
      tuning: notes("D", "A", "E", "B")
    },
    tenor: {
      label: "Tenor",
      summary: "Tenor bass tuning, high C on top.",
      tuning: notes("C", "G", "D", "A")
    },
    halfStepDown: {
      label: "Half-step down",
      summary: "4-string half-step down tuning, high Gb on top.",
      tuning: notes("Gb", "Db", "Ab", "Eb")
    }
  }
};

const FRET_POSITIONS = {
  full: {
    label: "Full range",
    start: 0,
    end: null
  },
  open: {
    label: "Open position",
    start: 0,
    end: 5
  },
  low: {
    label: "Low box",
    start: 3,
    end: 7
  },
  middle: {
    label: "Middle box",
    start: 5,
    end: 9
  },
  upper: {
    label: "Upper box",
    start: 7,
    end: 12
  },
  octave: {
    label: "Octave box",
    start: 12,
    end: 17
  },
  high: {
    label: "High range",
    start: 17,
    end: 24
  }
};

const FRET_MARKERS = new Set([3, 5, 7, 9, 12, 15, 17]);
const ALL_PROGRESSION_FAMILIES = "all";

function bar(degree, quality, roman) {
  return { degree, quality, roman };
}

function notes(...labels) {
  return labels.map((label) => ({ label, pc: notePcFromLabel(label) }));
}

function notePcFromLabel(label) {
  const sharpIndex = NOTE_NAMES_SHARP.indexOf(label);
  if (sharpIndex >= 0) return sharpIndex;
  const flatIndex = NOTE_NAMES_FLAT.indexOf(label);
  if (flatIndex >= 0) return flatIndex;
  return 0;
}

window.FretLabData = {
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
};
})();
