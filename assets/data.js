(() => {
  "use strict";

const NOTE_NAMES_SHARP = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const NOTE_NAMES_FLAT = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

const KEY_OPTIONS = [
  { label: "C", pc: 0, flats: false },
  { label: "C# / Db", pc: 1, flats: false },
  { label: "D", pc: 2, flats: false },
  { label: "D# / Eb", pc: 3, flats: true },
  { label: "E", pc: 4, flats: false },
  { label: "F", pc: 5, flats: true },
  { label: "F# / Gb", pc: 6, flats: false },
  { label: "G", pc: 7, flats: false },
  { label: "G# / Ab", pc: 8, flats: true },
  { label: "A", pc: 9, flats: false },
  { label: "A# / Bb", pc: 10, flats: true },
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
    suffix: "m",
    intervals: [0, 3, 7],
    roles: ["R", "b3", "5"],
    targets: [1]
  },
  "5": {
    name: "power chord",
    suffix: "5",
    intervals: [0, 7],
    roles: ["R", "5"],
    targets: [0]
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
  sus2: {
    name: "suspended second",
    suffix: "sus2",
    intervals: [0, 2, 7],
    roles: ["R", "2", "5"],
    targets: [1]
  },
  sus4: {
    name: "suspended fourth",
    suffix: "sus4",
    intervals: [0, 5, 7],
    roles: ["R", "4", "5"],
    targets: [1]
  },
  "6": {
    name: "major sixth",
    suffix: "6",
    intervals: [0, 4, 7, 9],
    roles: ["R", "3", "5", "6"],
    targets: [1, 3]
  },
  m6: {
    name: "minor sixth",
    suffix: "m6",
    intervals: [0, 3, 7, 9],
    roles: ["R", "b3", "5", "6"],
    targets: [1, 3]
  },
  maj7: {
    name: "major seventh",
    suffix: "maj7",
    intervals: [0, 4, 7, 11],
    roles: ["R", "3", "5", "7"],
    targets: [1, 3]
  },
  "7": {
    name: "dominant seventh",
    suffix: "7",
    intervals: [0, 4, 7, 10],
    roles: ["R", "3", "5", "b7"],
    targets: [1, 3]
  },
  m7: {
    name: "minor seventh",
    suffix: "m7",
    intervals: [0, 3, 7, 10],
    roles: ["R", "b3", "5", "b7"],
    targets: [1, 3]
  },
  mMaj7: {
    name: "minor major seventh",
    suffix: "mMaj7",
    intervals: [0, 3, 7, 11],
    roles: ["R", "b3", "5", "7"],
    targets: [1, 3]
  },
  "7sus4": {
    name: "dominant suspended fourth",
    suffix: "7sus4",
    intervals: [0, 5, 7, 10],
    roles: ["R", "4", "5", "b7"],
    targets: [1, 3]
  },
  m7b5: {
    name: "half-diminished seventh",
    suffix: "m7b5",
    intervals: [0, 3, 6, 10],
    roles: ["R", "b3", "b5", "b7"],
    targets: [1, 3]
  },
  dim7: {
    name: "diminished seventh",
    suffix: "dim7",
    intervals: [0, 3, 6, 9],
    roles: ["R", "b3", "b5", "bb7"],
    targets: [1, 3]
  },
  add9: {
    name: "add ninth",
    suffix: "add9",
    intervals: [0, 4, 7, 14],
    roles: ["R", "3", "5", "9"],
    targets: [1, 3]
  },
  madd9: {
    name: "minor add ninth",
    suffix: "madd9",
    intervals: [0, 3, 7, 14],
    roles: ["R", "b3", "5", "9"],
    targets: [1, 3]
  },
  maj9: {
    name: "major ninth",
    suffix: "maj9",
    intervals: [0, 4, 7, 11, 14],
    roles: ["R", "3", "5", "7", "9"],
    targets: [1, 3, 4]
  },
  "9": {
    name: "dominant ninth",
    suffix: "9",
    intervals: [0, 4, 7, 10, 14],
    roles: ["R", "3", "5", "b7", "9"],
    targets: [1, 3, 4]
  },
  m9: {
    name: "minor ninth",
    suffix: "m9",
    intervals: [0, 3, 7, 10, 14],
    roles: ["R", "b3", "5", "b7", "9"],
    targets: [1, 3, 4]
  }
};

const TRIAD_QUALITY_OPTIONS = [
  { value: "maj", label: "Major" },
  { value: "m", label: "Minor" },
  { value: "dim", label: "Diminished" },
  { value: "aug", label: "Augmented" }
];

const CHORD_LIBRARY_OPTIONS = [
  { value: "maj", label: "Major" },
  { value: "m", label: "Minor" },
  { value: "5", label: "Power chord" },
  { value: "dim", label: "Diminished" },
  { value: "aug", label: "Augmented" },
  { value: "sus2", label: "Suspended 2" },
  { value: "sus4", label: "Suspended 4" },
  { value: "6", label: "Major 6" },
  { value: "m6", label: "Minor 6" },
  { value: "maj7", label: "Major 7" },
  { value: "7", label: "Dominant 7" },
  { value: "m7", label: "Minor 7" },
  { value: "mMaj7", label: "Minor major 7" },
  { value: "7sus4", label: "Dominant 7sus4" },
  { value: "m7b5", label: "Half-diminished 7" },
  { value: "dim7", label: "Diminished 7" },
  { value: "add9", label: "Add 9" },
  { value: "madd9", label: "Minor add 9" },
  { value: "maj9", label: "Major 9" },
  { value: "9", label: "Dominant 9" },
  { value: "m9", label: "Minor 9" }
];

const SCALES = {
  major: {
    label: "Major scale",
    family: "Common",
    quality: "Major quality",
    character: "Reference seven-note major collection",
    usage: "Tonal major harmony and melodies",
    examples: [
      { title: "Let It Be", artist: "The Beatles", key: "C major / Ionian", tonics: [0], focus: "Clear major-key harmony and melody" },
      { title: "Clair de lune", artist: "Claude Debussy", key: "Db major / Ionian", tonics: [1], focus: "Db major is the principal tonal centre, with contrasting sections" },
      { title: "Thinking Out Loud", artist: "Ed Sheeran", key: "D major / Ionian", tonics: [2], focus: "D major pop harmony with a strong tonic centre" },
      { title: "Your Song", artist: "Elton John", key: "Eb major / Ionian", tonics: [3], focus: "Eb major piano-led tonal harmony" },
      { title: "Don't Stop Believin'", artist: "Journey", key: "E major / Ionian", tonics: [4], focus: "E major harmony built around a repeating progression" },
      { title: "Hey Jude", artist: "The Beatles", key: "F major / Ionian", tonics: [5], focus: "F major song form before the extended closing vamp" },
      { title: "Free Fallin'", artist: "Tom Petty", key: "F major / Ionian", tonics: [5], focus: "The repeating F–Bbsus2–F–Csus loop keeps the complete song anchored in F major" },
      { title: "I Wanna Dance with Somebody", artist: "Whitney Houston", key: "Gb major / Ionian", tonics: [6], focus: "Begins in Gb major and later modulates to Ab major" },
      { title: "Knockin' on Heaven's Door", artist: "Bob Dylan", key: "G major / Ionian", tonics: [7], focus: "A compact repeating progression in G major" },
      { title: "Viva la Vida", artist: "Coldplay", key: "Ab major / Ionian", tonics: [8], focus: "Ab major harmony with a recurring four-chord loop" },
      { title: "Someone Like You", artist: "Adele", key: "A major / Ionian", tonics: [9], focus: "A major harmony used in a restrained, melancholic setting" },
      { title: "Rocket Man", artist: "Elton John", key: "Bb major / Ionian", tonics: [10], focus: "Bb major tonal framework with colourful borrowed harmony" },
      { title: "Yellow", artist: "Coldplay", key: "B major / Ionian", tonics: [11], focus: "B major guitar harmony centred on B, F# and E" }
    ],
    intervals: [0, 2, 4, 5, 7, 9, 11],
    roles: ["1", "2", "3", "4", "5", "6", "7"]
  },
  naturalMinor: {
    label: "Natural minor",
    family: "Common",
    quality: "Minor quality",
    character: "b3, b6 and b7 distinguish it from major",
    usage: "Tonal minor harmony without a raised leading tone",
    examples: [
      { title: "Enjoy the Silence", artist: "Depeche Mode", key: "C natural minor / Aeolian", tonics: [0], focus: "C minor synth-pop harmony centred on an Aeolian loop" },
      { title: "All Along the Watchtower", artist: "The Jimi Hendrix Experience", key: "C# natural minor / Aeolian", tonics: [1], focus: "A repeating Aeolian minor loop" },
      { title: "Sultans of Swing", artist: "Dire Straits", key: "D natural minor / Aeolian", tonics: [2], focus: "D minor framework, with dominant colour in the turnaround" },
      { title: "Berimbau", artist: "Baden Powell & Vinícius de Moraes", key: "D minor modal centre", tonics: [2], focus: "An open-D drone anchors the main figure before the harmony expands through chromatic minor colours" },
      { title: "Canto de Ossanha", artist: "Baden Powell & Vinícius de Moraes", key: "D minor modal centre", tonics: [2], focus: "The repeating figure is anchored by an open-D drone; later sections broaden the minor centre with major and chromatic harmony" },
      { title: "Samba em Prelúdio", artist: "Baden Powell & Vinícius de Moraes", key: "D minor", tonics: [2], focus: "The lyrical theme and accompaniment establish D minor, then enrich it with chromatic voice leading and changing dominant colours" },
      { title: "Superstition", artist: "Stevie Wonder", key: "Eb minor", tonics: [3], focus: "Minor-pentatonic riff inside an Eb minor context" },
      { title: "Nothing Else Matters", artist: "Metallica", key: "E natural minor / Aeolian", tonics: [4], focus: "E minor harmony, with a raised leading tone in some cadences" },
      { title: "Smells Like Teen Spirit", artist: "Nirvana", key: "F natural minor / Aeolian", tonics: [5], focus: "Power-chord riff outlining an F minor tonal centre" },
      { title: "Billie Jean", artist: "Michael Jackson", key: "F# minor", tonics: [6], focus: "Minor-key groove built around an F# minor bass line" },
      { title: "bad guy", artist: "Billie Eilish", key: "G minor", tonics: [7], focus: "Sparse G minor groove with a strong tonic centre" },
      { title: "Tainted Love", artist: "Soft Cell", key: "G# minor", tonics: [8], focus: "G# minor synth-pop harmony and melody" },
      { title: "Poker Face", artist: "Lady Gaga", key: "A minor", tonics: [9], focus: "A minor dance-pop harmony centred on a repeating loop" },
      { title: "Samba Triste", artist: "Baden Powell & Billy Blanco", key: "A minor", tonics: [9], focus: "A minor is the principal centre, coloured by descending chromatic harmony and functional dominant movement" },
      { title: "Rhiannon", artist: "Fleetwood Mac", key: "A natural minor / Aeolian", tonics: [9], focus: "The recurring Am–F movement and vocal melody keep A as the minor centre, with F natural supplying Aeolian's b6" },
      { title: "Believer", artist: "Imagine Dragons", key: "Bb minor", tonics: [10], focus: "Bb minor framework, with a major dominant adding harmonic-minor colour" },
      { title: "Rasputin", artist: "Boney M.", key: "B natural minor / Aeolian", tonics: [11], focus: "Natural-minor framework, with harmonic-minor colour at the dominant" }
    ],
    intervals: [0, 2, 3, 5, 7, 8, 10],
    roles: ["1", "2", "b3", "4", "5", "b6", "b7"]
  },
  melodicMinor: {
    label: "Melodic minor",
    family: "Common",
    quality: "Minor quality",
    character: "Natural 6 and 7 distinguish it from natural minor",
    usage: "Minor-key melodies and modern jazz harmony",
    examples: [
      { title: "Possibly Maybe", artist: "Björk", key: "C# melodic minor", tonics: [1], focus: "The chorus and long outro use C# jazz melodic minor" },
      { title: "Yesterday", artist: "The Beatles", key: "D melodic minor", tonics: [2], focus: "The ascending phrase on ‘all my troubles seemed so far away’" },
      { title: "Carol of the Bells", artist: "Mike Campese", key: "E melodic minor", tonics: [4], focus: "The third bar raises scale degrees 6 and 7 in an E minor setting" },
      { title: "Eye of the Hurricane", artist: "Herbie Hancock", key: "F melodic minor solo passage", tonics: [5], focus: "A transcribed passage from Hancock's piano solo explicitly uses the F melodic-minor collection alongside altered-scale language" },
      { title: "Sister Moon", artist: "Sting", key: "F# melodic minor", tonics: [6], focus: "The opening foregrounds the major 7 over an F# minor tonic" },
      { title: "Sorry Seems to Be the Hardest Word", artist: "Elton John", key: "G melodic minor", tonics: [7], focus: "Ascending melodic-minor movement within the G minor melody" },
      { title: "Nica's Dream", artist: "Horace Silver", key: "Ab melodic minor", tonics: [8], focus: "The opening alternates AbmMaj7 and BbmMaj7 melodic-minor harmony" },
      { title: "Greensleeves", artist: "Traditional", key: "A melodic minor", tonics: [9], focus: "Measures 13–16 in the common A minor setting raise scale degrees 6 and 7" },
      { title: "Nica's Dream", artist: "Horace Silver", key: "Bb melodic minor", tonics: [10], focus: "The opening alternates BbmMaj7 and AbmMaj7 melodic-minor harmony" }
    ],
    intervals: [0, 2, 3, 5, 7, 9, 11],
    roles: ["1", "2", "b3", "4", "5", "6", "7"]
  },
  harmonicMinor: {
    label: "Harmonic minor",
    family: "Common",
    quality: "Minor quality",
    character: "Major 7 creates a strong leading tone above b6",
    usage: "Minor harmony with a dominant V chord",
    examples: [
      { title: "Piano Sonata No. 14 ‘Moonlight’, I", artist: "Ludwig van Beethoven", key: "C# harmonic minor cadence", tonics: [1], focus: "In measures 49–51, G#7 contains B# as the raised leading tone and resolves directly to C# minor" },
      { title: "Bourrée in E minor, BWV 996", artist: "Johann Sebastian Bach", key: "E harmonic minor passages", tonics: [4], focus: "B7–Em cadences introduce D# as the leading tone, making the shift from natural to harmonic minor easy to hear" },
      { title: "Bust Your Windows", artist: "Jazmine Sullivan", key: "F harmonic minor", tonics: [5], focus: "Fm–Db–Bbm–C harmony makes the major dominant central to the loop" },
      { title: "Far Beyond the Sun", artist: "Yngwie Malmsteen", key: "F# harmonic minor", tonics: [6], focus: "Fast scalar runs make the raised 7 and the augmented-second pull of F# harmonic minor especially exposed" },
      { title: "bury a friend", artist: "Billie Eilish", key: "G harmonic minor", tonics: [7], focus: "The G minor centre repeatedly uses F# as a leading tone, giving the sparse bass and vocal material a harmonic-minor pull" },
      { title: "Smooth", artist: "Santana feat. Rob Thomas", key: "A harmonic minor", tonics: [9], focus: "Minor harmony moving to the major dominant E" },
      { title: "Minor Swing", artist: "Django Reinhardt & Stéphane Grappelli", key: "A minor", tonics: [9], focus: "The A-minor progression and dominant E7 invite characteristic A harmonic-minor phrases" },
      { title: "Easy Please Me", artist: "Katy B", key: "Bb harmonic minor", tonics: [10], focus: "A rare pop example built consistently around Bb harmonic minor" },
      { title: "Hotel California", artist: "Eagles", key: "B harmonic minor passages", tonics: [11], focus: "The B-minor solo follows the changing chords and repeatedly uses A# over F#7, exposing harmonic minor's raised leading tone" }
    ],
    intervals: [0, 2, 3, 5, 7, 8, 11],
    roles: ["1", "2", "b3", "4", "5", "b6", "7"]
  },
  majorPentatonic: {
    label: "Major pentatonic",
    family: "Pentatonic / blues",
    quality: "Major quality",
    character: "Major scale without the 4 and 7",
    usage: "Major-key melodies, country, folk and pop",
    examples: [
      { title: "My Girl", artist: "The Temptations", key: "C major pentatonic", tonics: [0], focus: "Major-pentatonic guitar hook and vocal language before the modulation" },
      { title: "You Can Get It If You Really Want", artist: "Desmond Dekker", key: "Db major pentatonic", tonics: [1], focus: "The chorus melody gradually completes the Db major-pentatonic collection; the verse later adds C as a leading tone" },
      { title: "Maggie May", artist: "Rod Stewart", key: "D major pentatonic", tonics: [2], focus: "The guitar solo is based on D major pentatonic, with a small number of additional notes" },
      { title: "Today", artist: "The Smashing Pumpkins", key: "Eb major pentatonic", tonics: [3], focus: "The bright opening guitar figure outlines Eb-major-pentatonic colour before the fuller alternative-rock arrangement enters" },
      { title: "Yellow Ledbetter", artist: "Pearl Jam", key: "E major pentatonic", tonics: [4], focus: "Mike McCready's guitar solo stays closely inside E major pentatonic over the E–B–A progression" },
      { title: "Blue Sky", artist: "The Allman Brothers Band", key: "E major pentatonic", tonics: [4], focus: "Duane Allman's solo is based mainly on E major pentatonic, with A added as a melodic colour" },
      { title: "Amazing Grace", artist: "Traditional", key: "F major pentatonic", tonics: [5], focus: "The customary F setting uses only F, G, A, C and D" },
      { title: "Étude Op. 10 No. 5 (Black Key)", artist: "Frédéric Chopin", key: "Gb major pentatonic", tonics: [6], focus: "The right-hand material foregrounds the five black keys, which form Gb major pentatonic" },
      { title: "(Sittin' On) The Dock of the Bay", artist: "Otis Redding", key: "G major pentatonic", tonics: [7], focus: "The closing whistle melody clearly outlines G major pentatonic, even as the underlying harmony moves beyond a simple major-key loop" },
      { title: "All Right Now", artist: "Free", key: "A major pentatonic solo", tonics: [9], focus: "Paul Kossoff builds most of the guitar solo from A major pentatonic before introducing a few parallel-minor notes near the end" },
      { title: "Mercy, Mercy, Mercy", artist: "Cannonball Adderley", key: "Bb major pentatonic theme", tonics: [10], focus: "The first part of Joe Zawinul's theme is built entirely from Bb major pentatonic over a blues-inflected Bb framework" }
    ],
    intervals: [0, 2, 4, 7, 9],
    roles: ["1", "2", "3", "5", "6"]
  },
  minorPentatonic: {
    label: "Minor pentatonic",
    family: "Pentatonic / blues",
    quality: "Minor quality",
    character: "Compact minor sound built around b3 and b7",
    usage: "Blues, rock and minor-key improvisation",
    examples: [
      { title: "Can't Buy Me Love", artist: "The Beatles", key: "C minor pentatonic over C major blues", tonics: [0], focus: "George Harrison's solo uses C minor-pentatonic phrasing over a bright dominant-blues progression in C" },
      { title: "Jolene", artist: "Dolly Parton", key: "C# minor pentatonic", tonics: [1], focus: "The recurring guitar figure and minor-key accompaniment make C# minor pentatonic an immediate practical framework for the song" },
      { title: "Another Brick in the Wall, Part 2", artist: "Pink Floyd", key: "D minor pentatonic", tonics: [2], focus: "David Gilmour's guitar solo is built mainly from D minor pentatonic, with expressive bends and a few additional colours" },
      { title: "Black Magic Woman", artist: "Fleetwood Mac", key: "D minor pentatonic solo", tonics: [2], focus: "Peter Green's first solo is rooted in D minor pentatonic, then adds b6 over Gm7 for extra minor colour" },
      { title: "Consolação", artist: "Baden Powell & Vinícius de Moraes", key: "D modal minor / pentatonic core", tonics: [2], focus: "The Dm7–Am7 opening reduces to a D minor-pentatonic core plus E, offering a compact bridge from pentatonic phrasing to modal minor" },
      { title: "I Wish", artist: "Stevie Wonder", key: "Eb minor pentatonic", tonics: [3], focus: "Minor-pentatonic keyboard riff" },
      { title: "Whole Lotta Love", artist: "Led Zeppelin", key: "E minor pentatonic", tonics: [4], focus: "The main riff and much of Jimmy Page's solo use E minor-pentatonic vocabulary around the open E" },
      { title: "Paranoid", artist: "Black Sabbath", key: "E minor pentatonic", tonics: [4], focus: "The compact riff and power-chord writing make the E minor-pentatonic collection especially easy to recognise" },
      { title: "Song for My Father", artist: "Horace Silver", key: "F minor pentatonic", tonics: [5], focus: "The F-minor centre and memorable pentatonic theme show how a compact five-note melody can define an entire groove" },
      { title: "Vultures", artist: "John Mayer", key: "F# minor pentatonic", tonics: [6], focus: "The guitar solo stays closely inside F# minor pentatonic, with brief neighbouring colours used for tension" },
      { title: "Lost Woman", artist: "The Yardbirds", key: "G minor pentatonic", tonics: [7], focus: "The opening bass riff is built around G minor pentatonic before the arrangement expands into blues-derived dominant harmony" },
      { title: "Ain't Talkin' 'bout Love", artist: "Van Halen", key: "Ab minor pentatonic passage", tonics: [8], focus: "The guitars are tuned down a semitone, so the A-minor shapes sound in Ab; the solo closes with a clear minor-pentatonic flourish" },
      { title: "Stairway to Heaven", artist: "Led Zeppelin", key: "A minor pentatonic solo", tonics: [9], focus: "Jimmy Page connects several A minor-pentatonic positions throughout the extended solo, adding occasional F notes to follow the harmony" },
      { title: "Chameleon", artist: "Herbie Hancock", key: "Bb minor pentatonic over a Dorian vamp", tonics: [10], focus: "The iconic synth-bass riff and much of the improvising vocabulary reduce the Bb Dorian groove to its compact minor-pentatonic core" },
      { title: "Comfortably Numb", artist: "Pink Floyd", key: "B minor pentatonic solo", tonics: [11], focus: "The extended second solo is built mainly from B minor pentatonic, using bends and sustained notes to follow the harmony" }
    ],
    intervals: [0, 3, 5, 7, 10],
    roles: ["1", "b3", "4", "5", "b7"]
  },
  minorBlues: {
    label: "Blues / minor blues",
    family: "Pentatonic / blues",
    quality: "Minor blues quality",
    character: "Minor pentatonic with the b5 blue note",
    usage: "Minor and dominant blues harmony",
    examples: [
      { title: "Mr. P.C.", artist: "John Coltrane", key: "C minor blues", tonics: [0], focus: "The twelve-bar minor blues begins in C natural minor, then brings the C minor-blues scale into the melody and improvisation" },
      { title: "Iron Man", artist: "Black Sabbath", key: "C# blues passage", tonics: [1], focus: "At about 3:11 the song shifts into C# and the new riff walks down the C# minor-blues scale before the first guitar solo" },
      { title: "Poor Boy Long Ways from Home", artist: "John Fahey", key: "D blues in open D", tonics: [2], focus: "The fingerstyle theme mixes D-major open-string harmony with bends and minor-blues colour" },
      { title: "Superstition", artist: "Stevie Wonder", key: "Eb minor blues", tonics: [3], focus: "The clavinet riff expands Eb minor pentatonic with chromatic blue-note movement, producing the minor-blues sound at the centre of the groove" },
      { title: "Voodoo Child (Slight Return)", artist: "The Jimi Hendrix Experience", key: "E blues", tonics: [4], focus: "The E-centred riffs and solos extend minor pentatonic vocabulary with the b5 blue note, bends and pitches between the frets" },
      { title: "Cantaloupe Island", artist: "Herbie Hancock", key: "F blues", tonics: [5], focus: "The entire main melody draws from the F minor-blues collection, making the b5 especially clear inside a modal jazz groove" },
      { title: "Foxey Lady", artist: "The Jimi Hendrix Experience", key: "F# blues / rock", tonics: [6], focus: "The F#7#9 centre and guitar phrases combine F# minor-blues notes with the major 3 of the dominant chord" },
      { title: "No Particular Place to Go", artist: "Chuck Berry", key: "G minor blues over G major harmony", tonics: [7], focus: "Berry's solo uses G minor-blues vocabulary over a bright G-centred twelve-bar progression" },
      { title: "Cold as Ice", artist: "Foreigner", key: "Ab blues solo", tonics: [8], focus: "The closing guitar solo moves through the Ab minor-blues collection with rapid hammer-ons and pull-offs" },
      { title: "Crossroads", artist: "Cream", key: "A minor blues over A dominant harmony", tonics: [9], focus: "Clapton draws heavily from A minor pentatonic and the b5 blue note while phrasing across the twelve-bar dominant progression" },
      { title: "Blue Monk", artist: "Thelonious Monk", key: "Bb blues", tonics: [10], focus: "A twelve-bar Bb blues whose melody and improvisation make the blue notes easy to hear" },
      { title: "The Thrill Is Gone", artist: "B.B. King", key: "B minor blues", tonics: [11], focus: "Minor-blues phrasing over a minor blues" }
    ],
    intervals: [0, 3, 5, 6, 7, 10],
    roles: ["1", "b3", "4", "b5", "5", "b7"]
  },
  majorBlues: {
    label: "Major blues",
    family: "Pentatonic / blues",
    quality: "Major blues quality",
    character: "Major pentatonic with b3 as a blue note",
    usage: "Major and dominant blues harmony",
    examples: [
      { title: "Great Balls of Fire", artist: "Jerry Lee Lewis", key: "C major blues", tonics: [0], focus: "The compressed blues form in C uses major harmony and a characteristic slide from b3 to 3 inside its pounding piano language" },
      { title: "Doodlin'", artist: "Horace Silver", key: "Db major jazz blues", tonics: [1], focus: "A concise riff melody unfolds over a twelve-bar Db blues, placing blues inflections inside a major-key hard-bop setting" },
      { title: "D-Natural Blues", artist: "Wes Montgomery", key: "D major jazz blues", tonics: [2], focus: "The octave melody and solo blend major-pentatonic phrasing, the b3 blue note and chromatic approaches over a D blues" },
      { title: "Before You Accuse Me", artist: "Eric Clapton", key: "E major blues", tonics: [4], focus: "The twelve-bar groove in E combines major-blues phrasing with minor-blue inflections and chord-tone targeting" },
      { title: "Billie's Bounce", artist: "Charlie Parker", key: "F major blues", tonics: [5], focus: "The opening phrase states the F major-blues sound clearly before the bebop melody expands into chromatic and chord-tone language" },
      { title: "Pride and Joy", artist: "Stevie Ray Vaughan", key: "Eb major blues", tonics: [3], focus: "Major-blues language mixed with minor blue notes" },
      { title: "Texas Flood", artist: "Larry Davis", key: "Ab major blues", tonics: [8], focus: "The original recording is a slow twelve-bar blues in Ab, combining dominant-major harmony with major and minor blue-note inflections" },
      { title: "Crossroads", artist: "Cream", key: "A major blues vocabulary", tonics: [9], focus: "The solo opens with A major-pentatonic phrases, then alternates major and minor 3 colours over the A7-centred blues" },
      { title: "Tenor Madness", artist: "Sonny Rollins", key: "Bb major jazz blues", tonics: [10], focus: "The riff melody and extended solos place major-blues colour inside a straight-ahead twelve-bar bebop framework in Bb" },
      { title: "Goin' Down Slow", artist: "Howlin' Wolf", key: "B dominant blues", tonics: [11], focus: "The twelve-bar framework in B combines dominant-major harmony with vocal-like blue-note inflections" }
    ],
    intervals: [0, 2, 3, 4, 7, 9],
    roles: ["1", "2", "b3", "3", "5", "6"]
  },
  rockAndRoll: {
    label: "Rock and roll",
    family: "Pentatonic / blues",
    quality: "Mixed major/minor quality",
    character: "Combines b3, 3, b5 and b7",
    usage: "Rock-and-roll riffs and dominant blues harmony",
    examples: [
      { title: "Whole Lotta Shakin' Goin' On", artist: "Jerry Lee Lewis", key: "C rock and roll", tonics: [0], focus: "A driving twelve-bar blues in C whose I–IV–V harmony, boogie piano and backbeat show the direct bridge from blues to rock and roll" },
      { title: "Born Under a Bad Sign", artist: "Albert King", key: "C# blues / rock vocabulary", tonics: [1], focus: "The original recording sets its C# minor-pentatonic riff against dominant major harmony, creating the major/minor tension inherited by rock riffs" },
      { title: "Should I Stay or Should I Go", artist: "The Clash", key: "D rock / blues", tonics: [2], focus: "The D-centred I–IV–V framework is answered by D minor-pentatonic guitar phrases, creating the major/minor tension typical of blues-based rock and roll" },
      { title: "Jailhouse Rock", artist: "Elvis Presley", key: "Eb rock and roll", tonics: [3], focus: "The original recording turns a twelve-bar blues in Eb into rock and roll through its driving backbeat, vocal phrasing and Scotty Moore's guitar solo" },
      { title: "Back in Black", artist: "AC/DC", key: "E rock / blues", tonics: [4], focus: "E-major power-chord harmony is answered by E minor-blues riff and solo vocabulary, including the tension between G and G#" },
      { title: "Tutti Frutti", artist: "Little Richard", key: "F rock and roll", tonics: [5], focus: "A fast twelve-bar blues in F whose major harmony, blue notes and driving piano rhythm became a template for early rock and roll" },
      { title: "Old Time Rock and Roll", artist: "Bob Seger & The Silver Bullet Band", key: "F# rock and roll", tonics: [6], focus: "The F# I–IV–V framework combines major harmony with blues inflections in the piano, saxophone and guitar vocabulary" },
      { title: "No Particular Place to Go", artist: "Chuck Berry", key: "G rock and roll", tonics: [7], focus: "A G-centred twelve-bar form combines major I–IV–V harmony with minor-blues lead guitar and Berry's characteristic double-stops" },
      { title: "Rockin' Around the Christmas Tree", artist: "Brenda Lee", key: "Ab rockabilly / rock and roll", tonics: [8], focus: "The original recording places a compact Ab-major song inside a rockabilly arrangement coloured by bluesy guitar, piano and saxophone phrases" },
      { title: "Rock Around the Clock", artist: "Bill Haley & His Comets", key: "A rock and roll", tonics: [9], focus: "The A-centred twelve-bar blues form, walking rhythm and major/minor blues guitar vocabulary define the early rock-and-roll sound" },
      { title: "Johnny B. Goode", artist: "Chuck Berry", key: "Bb", tonics: [10], focus: "Major and minor blues notes over dominant harmony" },
      { title: "Maybellene", artist: "Chuck Berry", key: "B rock and roll", tonics: [11], focus: "A fast B-centred blues form combines dominant harmony, country-derived rhythm and Berry's major/minor pentatonic guitar vocabulary" }
    ],
    intervals: [0, 2, 3, 4, 5, 6, 7, 9, 10],
    roles: ["1", "2", "b3", "3", "4", "b5", "5", "6", "b7"]
  },
  ionian: {
    label: "Ionian",
    family: "Modes",
    quality: "Major quality",
    character: "Modal name for the major scale",
    usage: "Major tonal harmony and modal melodies",
    intervals: [0, 2, 4, 5, 7, 9, 11],
    roles: ["1", "2", "3", "4", "5", "6", "7"]
  },
  dorian: {
    label: "Dorian",
    family: "Modes",
    quality: "Minor quality",
    character: "Natural 6 distinguishes it from natural minor",
    usage: "Minor i-IV vamps, modal jazz and funk",
    examples: [
      { title: "So What", artist: "Miles Davis", key: "D Dorian", tonics: [2], focus: "Extended Dorian harmony and modal improvisation; the bridge moves to Eb Dorian" },
      { title: "Impressions", artist: "John Coltrane", key: "D and Eb Dorian", tonics: [2, 3], focus: "The A sections use D Dorian and the bridge moves up to Eb Dorian" },
      { title: "My Favorite Things", artist: "John Coltrane", key: "E Dorian and E major", tonics: [4], focus: "The extended minor vamp provides a clear E Dorian improvising context" },
      { title: "Stayin' Alive", artist: "Bee Gees", key: "F Dorian", tonics: [5], focus: "The F-minor groove retains D natural, Dorian's characteristic natural 6, throughout its repeating modal framework" },
      { title: "Mike's Song", artist: "Phish", key: "F# Dorian", tonics: [6], focus: "The extended F# minor vamp supports Dorian improvisation, with D# supplying the characteristic natural 6" },
      { title: "Milestones", artist: "Miles Davis", key: "G Dorian", tonics: [7], focus: "The opening sixteen-bar modal section centres G minor while retaining E natural, Dorian's characteristic natural 6" },
      { title: "Oye Como Va", artist: "Santana", key: "A Dorian", tonics: [9], focus: "The groove alternates Am7 and D9, foregrounding Dorian's natural 6" },
      { title: "Mary Jane's Last Dance", artist: "Tom Petty and the Heartbreakers", key: "A Dorian", tonics: [9], focus: "The A-minor riff and harmonica language use minor pentatonic as a base, while F# and the D chord expose Dorian's natural 6" },
      { title: "Chameleon", artist: "Herbie Hancock", key: "Bb Dorian", tonics: [10], focus: "The long Bbm7–Eb7 vamp establishes Bb as home while G natural supplies the defining Dorian 6" },
      { title: "Get Lucky", artist: "Daft Punk feat. Pharrell Williams", key: "B Dorian", tonics: [11], focus: "The repeating Bm7–D–F#m7–E loop keeps B as the minor centre while G# supplies Dorian's characteristic natural 6" },
      { title: "Sing About Me, I'm Dying of Thirst", artist: "Kendrick Lamar", key: "C# Dorian", tonics: [1], focus: "The sampled loop and vocal sections centre C# minor while retaining A# as Dorian's natural 6" },
      { title: "Halo Theme", artist: "Martin O'Donnell & Michael Salvatori", key: "E Dorian", tonics: [4], focus: "The chant and main theme centre E with the characteristic C#" }
    ],
    intervals: [0, 2, 3, 5, 7, 9, 10],
    roles: ["1", "2", "b3", "4", "5", "6", "b7"]
  },
  phrygian: {
    label: "Phrygian",
    family: "Modes",
    quality: "Minor quality",
    character: "b2 gives it its defining close pull to the root",
    usage: "Static minor harmony and suspended dominant sounds",
    examples: [
      { title: "Milkshake", artist: "Kelis", key: "C# Phrygian", tonics: [1], focus: "The synth and bass material centres C# and repeatedly stresses D" },
      { title: "HUMBLE.", artist: "Kendrick Lamar", key: "D# Phrygian", tonics: [3], focus: "The piano riff centres D# and makes prominent use of E" },
      { title: "Wherever I May Roam", artist: "Metallica", key: "E Phrygian", tonics: [4], focus: "Phrygian and Phrygian-dominant colours in the main material" },
      { title: "Get Ur Freak On", artist: "Missy Elliott", key: "F Phrygian", tonics: [5], focus: "The tumbi melody centres F and immediately rises to Gb, making the defining Phrygian b2 unmistakable" },
      { title: "Pyramid Song", artist: "Radiohead", key: "F# Phrygian colour", tonics: [6], focus: "The recurring G–F# motion gives the ambiguous piano progression its strongest Phrygian pull" },
      { title: "Smoke on the Water", artist: "Deep Purple", key: "G Phrygian chorus", tonics: [7], focus: "The chorus briefly centres G with Ab supplying the characteristic Phrygian b2" },
      { title: "Stargazer", artist: "Rainbow", key: "B Phrygian passages", tonics: [11], focus: "The main riff and related passages centre B while repeatedly stressing C, the defining Phrygian b2" }
    ],
    intervals: [0, 1, 3, 5, 7, 8, 10],
    roles: ["1", "b2", "b3", "4", "5", "b6", "b7"]
  },
  lydian: {
    label: "Lydian",
    family: "Modes",
    quality: "Major quality",
    character: "#4 distinguishes it from the major scale",
    usage: "Major chords with a #11 and modal harmony",
    examples: [
      { title: "Flying in a Blue Dream", artist: "Joe Satriani", key: "C, Ab, G and F Lydian sections", tonics: [0, 5, 7, 8], focus: "Successive Lydian centres retain the same major-with-#4 colour; the G section foregrounds C# over a G tonic" },
      { title: "Sara", artist: "Fleetwood Mac", key: "F Lydian opening", tonics: [5], focus: "The opening F–G vamp treats F as its centre, with B natural inside G providing the characteristic Lydian #4" },
      { title: "Dreams", artist: "Fleetwood Mac", key: "F Lydian harmonic colour", tonics: [5], focus: "The repeating Fmaj7–G harmonic layer creates an F-Lydian vamp, although the vocal melody leaves the overall tonal centre deliberately ambiguous" },
      { title: "Here Comes My Girl", artist: "Tom Petty and the Heartbreakers", key: "A Lydian verse", tonics: [9], focus: "The verses alternate A and B over an A pedal, making D# the Lydian #4 before the chorus resolves the wider song to E major" }
    ],
    intervals: [0, 2, 4, 6, 7, 9, 11],
    roles: ["1", "2", "3", "#4", "5", "6", "7"]
  },
  mixolydian: {
    label: "Mixolydian",
    family: "Modes",
    quality: "Major / dominant quality",
    character: "b7 distinguishes it from the major scale",
    usage: "Dominant chords, blues, rock and funk",
    examples: [
      { title: "Tomorrow Never Knows", artist: "The Beatles", key: "C Mixolydian", tonics: [0], focus: "A persistent C drone anchors the track while Bb supplies Mixolydian's defining b7" },
      { title: "Playing in the Band", artist: "Grateful Dead", key: "D Mixolydian", tonics: [2], focus: "The long modal jam centres D and uses Mixolydian's C natural" },
      { title: "Norwegian Wood (This Bird Has Flown)", artist: "The Beatles", key: "E Mixolydian verse", tonics: [4], focus: "The verse melody and drone centre E while D natural supplies the defining b7; the middle section shifts to E Dorian" },
      { title: "Happy Together", artist: "The Turtles", key: "F Mixolydian chorus", tonics: [5], focus: "The chorus moves to an F-major centre while Eb supplies Mixolydian's characteristic b7" },
      { title: "Estimated Prophet", artist: "Grateful Dead", key: "G Mixolydian section", tonics: [7], focus: "The ‘California’ section settles into G major with F natural supplying the defining Mixolydian b7" },
      { title: "Good Vibrations", artist: "The Beach Boys", key: "Gb, Ab and Bb Mixolydian chorus sections", tonics: [6, 8, 10], focus: "The shifting chorus sequence passes through Gb, Ab and Bb centres while retaining each centre's characteristic Mixolydian b7" },
      { title: "L.A. Woman", artist: "The Doors", key: "A Mixolydian", tonics: [9], focus: "The main rock harmony centres A and uses G natural as the b7" },
      { title: "Solar Power", artist: "Lorde", key: "B Mixolydian", tonics: [11], focus: "Mixolydian major harmony centred around the b7" }
    ],
    intervals: [0, 2, 4, 5, 7, 9, 10],
    roles: ["1", "2", "3", "4", "5", "6", "b7"]
  },
  aeolian: {
    label: "Aeolian",
    family: "Modes",
    quality: "Minor quality",
    character: "Modal name for the natural minor scale",
    usage: "Minor tonal harmony and modal melodies",
    intervals: [0, 2, 3, 5, 7, 8, 10],
    roles: ["1", "2", "b3", "4", "5", "b6", "b7"]
  },
  locrian: {
    label: "Locrian",
    family: "Modes",
    quality: "Diminished quality",
    character: "b2 and b5 weaken both tonic and dominant stability",
    usage: "Minor-key iiø harmony and diminished sonorities",
    examples: [{ title: "Army of Me", artist: "Björk", key: "C Locrian", tonics: [0], focus: "The bass line strongly projects a Locrian collection" }],
    intervals: [0, 1, 3, 5, 6, 8, 10],
    roles: ["1", "b2", "b3", "4", "b5", "b6", "b7"]
  },
  dorianBebop: {
    label: "Dorian bebop",
    family: "Bebop / symmetric",
    quality: "Minor bebop quality",
    character: "Dorian with 3 as a chromatic passing tone",
    usage: "Eighth-note lines over minor and minor-sixth chords",
    examples: [
      { title: "So What (Live in Stockholm 1960)", artist: "Miles Davis", key: "D Dorian bebop vocabulary", tonics: [2], focus: "The D Dorian solo uses substantially more bebop-style chromaticism than the studio recording" },
      { title: "Milestones", artist: "Miles Davis", key: "G Dorian with bebop chromaticism", tonics: [7], focus: "The long G Dorian sections let the soloists add chromatic approach notes—including the major 3 as passing tension—without losing the modal centre" }
    ],
    intervals: [0, 2, 3, 4, 5, 7, 9, 10],
    roles: ["1", "2", "b3", "3", "4", "5", "6", "b7"]
  },
  mixolydianBebop: {
    label: "Mixolydian bebop",
    family: "Bebop / symmetric",
    quality: "Dominant bebop quality",
    character: "Mixolydian with 7 as a chromatic passing tone",
    usage: "Eighth-note lines over dominant chords",
    examples: [
      { title: "Billie's Bounce", artist: "Charlie Parker", key: "F dominant blues", tonics: [5], focus: "Dominant bebop phrasing over the tonic sections of the blues" },
      { title: "Anthropology", artist: "Dizzy Gillespie & Charlie Parker", key: "G7 bebop passage", tonics: [7], focus: "The rhythm-changes bridge passes through G7, where F# works as the chromatic leading tone between the b7, F, and the root, G" },
      { title: "One Finger Snap", artist: "Herbie Hancock feat. Freddie Hubbard", key: "Ab dominant bebop passage", tonics: [8], focus: "Freddie Hubbard uses Ab dominant-bebop language over the Ab7sus passage, combining it with related Eb-minor vocabulary" },
      { title: "Tenor Madness", artist: "Sonny Rollins", key: "Bb dominant bebop blues", tonics: [10], focus: "The Bb7 tonic sections support dominant-bebop lines that add A natural as a chromatic passing tone between Ab and Bb" }
    ],
    intervals: [0, 2, 4, 5, 7, 9, 10, 11],
    roles: ["1", "2", "3", "4", "5", "6", "b7", "7"]
  },
  wholeTone: {
    label: "Whole tone",
    family: "Bebop / symmetric",
    quality: "Symmetric augmented quality",
    character: "Built entirely from whole steps, with no perfect 5",
    usage: "Augmented chords and unresolved dominant sounds",
    examples: [
      { title: "Voiles", artist: "Claude Debussy", key: "C whole-tone collection", tonics: [0, 2, 4, 6, 8, 10], focus: "Most of the prelude uses C–D–E–F#–G#–Bb, one of the two possible whole-tone collections" },
      { title: "Rhythm-a-Ning", artist: "Thelonious Monk", key: "Whole-tone colour over F7", tonics: [1, 3, 5, 7, 9, 11], focus: "The bridge explicitly uses the whole-tone collection over F7, echoed again in Monk's solo" },
      { title: "You Are the Sunshine of My Life", artist: "Stevie Wonder", key: "B whole-tone collection", tonics: [1, 3, 5, 7, 9, 11], focus: "Whole-tone movement in the introduction" }
    ],
    intervals: [0, 2, 4, 6, 8, 10],
    roles: ["1", "2", "3", "#4", "#5", "b7"]
  },
  halfWholeDiminished: {
    label: "Half whole diminished",
    family: "Bebop / symmetric",
    quality: "Symmetric dominant quality",
    character: "Alternates half and whole steps from the root",
    usage: "Dominant b9 and altered dominant harmony",
    examples: [
      { title: "Woody 'n You", artist: "Dizzy Gillespie", key: "Three half-whole diminished collections", tonics: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], focus: "The A sections move through dominant 7#9 chords in three keys, exposing all three distinct diminished collections" },
      { title: "Autumn Leaves", artist: "Michael Dease", key: "F half-whole diminished", tonics: [2, 5, 8, 11], focus: "Measures 54–55 of the solo descend through the complete F half-whole diminished collection over F7" }
    ],
    intervals: [0, 1, 3, 4, 6, 7, 9, 10],
    roles: ["1", "b2", "#2", "3", "b5", "5", "6", "b7"]
  },
  wholeHalfDiminished: {
    label: "Whole half diminished",
    family: "Bebop / symmetric",
    quality: "Symmetric diminished quality",
    character: "Alternates whole and half steps from the root",
    usage: "Diminished seventh chords and passing harmony",
    examples: [{ title: "Just", artist: "Radiohead", key: "C whole-half diminished", tonics: [0, 3, 6, 9], focus: "The intro's ascending guitar line outlines the C whole-half octatonic collection" }],
    intervals: [0, 2, 3, 5, 6, 8, 9, 11],
    roles: ["1", "2", "b3", "4", "b5", "#5", "6", "7"]
  },
  phrygianDominant: {
    label: "Phrygian dominant / Flamenco",
    family: "World / exotic",
    quality: "Major / dominant quality",
    character: "Phrygian b2 and b7 surrounding a major tonic triad",
    usage: "Flamenco harmony, the Andalusian cadence and dominant sounds in minor keys",
    examples: [
      { title: "Cepa Andaluza", artist: "Paco de Lucía", key: "C flamenco Phrygian", tonics: [0], focus: "The bulería centres C with the characteristic major tonic, b2 and Phrygian flamenco harmony" },
      { title: "Mi Niño Curro", artist: "Paco de Lucía", key: "C# flamenco Phrygian / rondeña", tonics: [1], focus: "The rondeña resolves around C# and D; its characteristic tuning and open strings expand the harmony beyond a strict seven-note scale" },
      { title: "Malagueña", artist: "Traditional", key: "E Phrygian dominant", tonics: [4], focus: "The familiar guitar melody foregrounds E, F and G#, while traditional performances may also use G natural" },
      { title: "Hava Nagila", artist: "Dick Dale & His Del-Tones", key: "E Phrygian dominant", tonics: [4], focus: "The E-centred arrangement emphasizes the tonic, b2 and major 3 through its rapid melody and E–F chord movement" },
      { title: "Fuente y Caudal", artist: "Paco de Lucía", key: "F# flamenco Phrygian / taranta", tonics: [6], focus: "The taranta centres F# against G and repeatedly resolves through the characteristic Bm–A7–G–F# flamenco motion" },
      { title: "Lamento Minero", artist: "Paco de Lucía", key: "G# flamenco Phrygian / minera", tonics: [8], focus: "The minera uses the traditional G#–A Phrygian axis, enriched by open-string dissonances and changing major/minor-third colour" },
      { title: "Reflejo de Luna", artist: "Paco de Lucía", key: "B flamenco Phrygian / granaína", tonics: [11], focus: "The granaína moves through Em–D–C and resolves to B, making the C–B b2-to-tonic cadence especially clear" }
    ],
    intervals: [0, 1, 4, 5, 7, 8, 10],
    roles: ["1", "b2", "3", "4", "5", "b6", "b7"]
  },
  spanish: {
    label: "Spanish",
    family: "World / exotic",
    quality: "Mixed major/minor quality",
    character: "Combines b2, b3, 3 and b5",
    usage: "Chromatic melodies over static dominant harmony",
    examples: [
      { title: "Unholy", artist: "Sam Smith feat. Kim Petras", key: "C# Spanish-Phrygian mixture", tonics: [1], focus: "The hook alternates Phrygian-dominant colour with a fleeting minor 3, exposing the Spanish scale's characteristic major/minor-third mixture" },
      { title: "La Fiesta", artist: "Chick Corea", key: "E Spanish Phrygian", tonics: [4], focus: "The E-centred flamenco vamp and theme move between the minor and major 3 while repeatedly stressing the b2" },
      { title: "Ring of Fire", artist: "Johnny Cash", key: "G Spanish eight-tone and major mixture", tonics: [7], focus: "The recurring lead and brass figures blend G-major material with Spanish eight-tone chromatic colour" },
      { title: "Unbelievable", artist: "EMF", key: "G# Spanish eight-tone", tonics: [8], focus: "The recurring guitar motif highlights the mixed minor and major 3 of the Spanish-Phrygian collection" }
    ],
    intervals: [0, 1, 3, 4, 5, 6, 8, 10],
    roles: ["1", "b2", "b3", "3", "4", "b5", "b6", "b7"]
  },
  persian: {
    label: "Persian",
    family: "World / exotic",
    quality: "Major quality with altered degrees",
    character: "b2, b5 and b6 frame a major 3 and 7",
    usage: "Static harmony emphasizing its augmented-second gaps",
    examples: [{ title: "Esquisses Persanes", artist: "Naji Hakim", key: "C Persian scale", tonics: [0], focus: "Both movements are built from C–Db–E–F–Gb–Ab–B and its transpositions" }],
    intervals: [0, 1, 4, 5, 6, 8, 11],
    roles: ["1", "b2", "3", "4", "b5", "b6", "7"]
  },
  gypsyMajor: {
    label: "Double harmonic major",
    family: "World / exotic",
    quality: "Major quality with altered degrees",
    character: "b2 and b6 surround a major tonic triad",
    usage: "Static major harmony and augmented-second melodies",
    examples: [
      { title: "Tradition", artist: "Jerry Bock", key: "C double harmonic major", tonics: [0], focus: "The recurring ostinato is built from the C double harmonic collection" },
      { title: "Misirlou", artist: "Dick Dale & His Del-Tones", key: "E double harmonic major", tonics: [4], focus: "The main melody runs through the E double harmonic major collection" }
    ],
    intervals: [0, 1, 4, 5, 7, 8, 11],
    roles: ["1", "b2", "3", "4", "5", "b6", "7"]
  },
  gypsyMinor: {
    label: "Hungarian minor",
    family: "World / exotic",
    quality: "Minor quality with altered degrees",
    character: "#4 and 7 sharpen the natural minor framework",
    usage: "Static minor harmony and augmented-second melodies",
    examples: [
      { title: "Inca Ruins", artist: "Yasuhiro Kawasaki", key: "C Hungarian minor", tonics: [0], focus: "The flute melody uses C Hungarian minor, including its characteristic #4" },
      { title: "Larai Cliff", artist: "Yasuhiro Kawasaki", key: "D Hungarian minor", tonics: [2], focus: "Quotes the Inca Ruins material transposed to D" },
      { title: "The Pink Panther Theme", artist: "Henry Mancini", key: "E Hungarian minor colour", tonics: [4], focus: "The E minor theme draws its characteristic chromaticism from the Hungarian minor collection" }
    ],
    intervals: [0, 2, 3, 6, 7, 8, 11],
    roles: ["1", "2", "b3", "#4", "5", "b6", "7"]
  }
};

function progressionExample(title, artist, key, chords, section, match, note) {
  return { title, artist, key, chords, section, match, note };
}

const PROGRESSIONS = {
  major: {
    label: "12-bar major blues",
    family: "Blues",
    summary: "Classic I7-IV7-V7 form with the V chord in bar 12.",
    examples: [
      progressionExample("Rock Me Baby", "B.B. King", "Bb", "Bb7–Eb7–F7", "Whole form", "exact", "A standard twelve-bar chorus following the displayed long-change form.")
    ],
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
    examples: [
      progressionExample("Before You Accuse Me", "Bo Diddley", "E", "E7–A7–E7–B7–A7–E7", "Whole form", "exact", "The twelve-bar form moves to IV7 in bar 2, giving a clear quick-change example; turnaround voicings vary by version.")
    ],
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
    examples: [
      progressionExample("The Thrill Is Gone", "B.B. King", "B minor", "Bm7–Em7–Bm7–G7–F#7", "Whole form", "variant", "A twelve-bar minor blues whose final four bars substitute bVI7–V7 for the displayed V7–iv7 motion.")
    ],
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
    examples: [
      progressionExample("Straight, No Chaser", "Thelonious Monk", "F", "F7–Bb7–F7–D7–Gm7–C7", "Whole form", "variant", "A canonical jazz-blues reference; recordings and lead sheets differ in passing chords and turnaround detail.")
    ],
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
    examples: [
      progressionExample("Mr. P.C.", "John Coltrane", "C minor", "Cm7–Fm7–Cm7–Ab7–Dm7b5–G7", "Whole form", "variant", "A compact minor jazz blues; the core motion matches while published turnarounds may omit the diminished passing bar.")
    ],
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
    examples: [
      progressionExample("Tune Up", "Miles Davis", "Several descending keys", "Em7–A7–Dmaj7", "Opening four bars and subsequent sequences", "exact", "Successive ii–V–I cadences are the central construction of the tune.")
    ],
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
    examples: [
      progressionExample("Autumn Leaves", "Joseph Kosma", "E minor", "F#m7b5–B7–Em", "Minor-key cadence", "exact", "The recurring minor ii–V–i resolves from F#m7b5 through B7 to E minor.")
    ],
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
    examples: [
      progressionExample("Oleo", "Sonny Rollins", "Bb", "Bbmaj7–G7–Cm7–F7", "A sections", "exact", "Its A sections use standard rhythm changes; substitutions differ among performances.")
    ],
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
    examples: [
      progressionExample("I Got Rhythm", "George Gershwin", "Bb", "Bb–G7–C7–F7", "A-section turnaround variant", "section", "Jazz performances commonly turn the diatonic I–vi–ii–V into the displayed chain of secondary dominants.")
    ],
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
    examples: [
      progressionExample("Chameleon", "Herbie Hancock", "Bb Dorian", "Bbm7–Eb7", "Main vamp", "exact", "The two chords can be heard as i7–IV7 in Bb Dorian or ii7–V7 without resolution in Ab.")
    ],
    bars: [
      bar("II", "m7", "ii7"),
      bar("V", "7", "V7")
    ]
  },
  dorianVamp: {
    label: "Dorian vamp i7-IV7",
    family: "Modal vamps",
    summary: "Minor tonic vamp with a dominant IV color for Dorian practice.",
    examples: [
      progressionExample("Oye Como Va", "Santana", "A Dorian", "Am7–D7", "Main vamp", "exact", "The repeating i7–IV7 vamp exposes Dorian's natural sixth through the D7 chord.")
    ],
    bars: [
      bar("I", "m7", "i7"),
      bar("IV", "7", "IV7")
    ]
  },
  aeolianVamp: {
    label: "Aeolian vamp i-bVII-bVI-bVII",
    family: "Modal vamps",
    summary: "Natural minor rock/modal loop centered on i, bVII, and bVI.",
    examples: [
      progressionExample("All Along the Watchtower", "The Jimi Hendrix Experience", "C# minor", "C#m–B–A–B", "Entire song", "exact", "The complete arrangement revolves around the i–bVII–bVI–bVII Aeolian loop.")
    ],
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
    examples: [
      progressionExample("Wherever I May Roam", "Metallica", "E Phrygian", "E5–F5", "Main riff", "section", "The riff repeatedly opposes the E centre and F, reducing the Phrygian sound to i–bII power chords.")
    ],
    bars: [
      bar("I", "m", "i"),
      bar("bII", "maj", "bII")
    ]
  },
  susVamp: {
    label: "Suspended vamp I-bVII",
    family: "Modal vamps",
    summary: "Open suspended sound for modal comping and pedal-tone phrasing.",
    examples: [
      progressionExample("Tomorrow Never Knows", "The Beatles", "C Mixolydian", "C–Bb/C", "Drone-based body of the song", "variant", "The C drone and Bb-over-C colour create the same open I–bVII suspended effect without literal sus4 chords throughout.")
    ],
    bars: [
      bar("I", "sus4", "Isus4"),
      bar("bVII", "sus4", "bVIIsus4")
    ]
  },
  popAxis: {
    label: "I-V-vi-IV",
    family: "Diatonic / pop",
    summary: "Common four-chord major-key loop for pop, rock, and worship contexts.",
    examples: [
      progressionExample("Don't Stop Believin'", "Journey", "E", "E–B–C#m–A", "First half of the main eight-chord pattern", "section", "The famous pattern begins with an exact I–V–vi–IV loop, then changes vi to iii in its second half.")
    ],
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
    examples: [
      progressionExample("Numb", "Linkin Park", "F# minor / A major", "F#m–D–A–E", "Verse and chorus loop", "exact", "The recurring loop is the vi–IV–I–V rotation of the pop-axis progression.")
    ],
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
    examples: [
      progressionExample("Stand by Me", "Ben E. King", "A", "A–F#m–D–E", "Main loop", "variant", "The song uses the exact I–vi–IV–V roots, normally with a major V rather than the displayed V7 voicing.")
    ],
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
    examples: [
      progressionExample("Canon in D", "Johann Pachelbel", "D", "D–A–Bm–F#m–G–D–G–A", "Ground bass throughout", "exact", "The displayed sequence is the work's repeating harmonic ground.")
    ],
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
    examples: [
      progressionExample("Autumn Leaves", "Joseph Kosma", "G minor / Bb major", "Cm7–F7–Bbmaj7–Ebmaj7–Am7b5–D7–Gm", "Opening eight bars", "section", "The opening follows the diatonic circle from ii through V–I–IV and onward to the relative-minor cadence.")
    ],
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
    examples: [
      progressionExample("Minor Swing", "Django Reinhardt & Stéphane Grappelli", "A minor", "Am–Dm–E7–Am", "Core harmonic cycle", "exact", "The essential minor i–iv–V–i cadence forms the tune's harmonic backbone.")
    ],
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
    examples: [
      progressionExample("Hit the Road Jack", "Ray Charles", "A minor", "Am–G–F–E", "Entire song", "exact", "The repeating bass and harmony state the Andalusian i–bVII–bVI–V descent directly.")
    ],
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
    examples: [
      progressionExample("Isn't It Midnight", "Fleetwood Mac", "B minor", "Bm–G–A–Bm", "Chorus", "exact", "The chorus follows i–bVI–bVII–i in a direct minor-rock form.")
    ],
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
    examples: [
      progressionExample("I Will Survive", "Gloria Gaynor", "A minor", "Am–Dm–G–C–F–Bm7b5–E7–Am", "Main loop", "exact", "The full loop follows the minor circle and closes with iiø7–V7–i.")
    ],
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
    examples: [
      progressionExample("Just the Two of Us", "Grover Washington Jr. feat. Bill Withers", "F minor / Ab major", "Dbmaj7–C7–Fm7–Eb7–Abmaj7", "Main loop cadence", "section", "The Eb7–Abmaj7 resolution supplies the backdoor bVII7–I gesture; the preceding minor-subdominant function is expanded by the longer loop.")
    ],
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
    examples: [
      progressionExample("The Girl from Ipanema", "Antônio Carlos Jobim", "F", "Gm7–Gb7–Fmaj7", "Turnaround/cadential treatment", "section", "A common jazz treatment replaces C7 with Gb7, producing the exact ii7–bII7–Imaj7 cadence.")
    ],
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
    examples: [
      progressionExample("Blues for Alice", "Charlie Parker", "F", "A7–D7–G7–C7", "Final two bars", "section", "The ending compresses the III7–VI7–II7–V7 dominant chain before returning to F.")
    ],
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
    examples: [
      progressionExample("Lady Bird", "Tadd Dameron", "C", "Cmaj7–Eb7–Abmaj7–Db7", "Final two bars", "exact", "The progression is taken directly from the ending of the composition that gives it its name.")
    ],
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
    examples: [
      progressionExample("Giant Steps", "John Coltrane", "B / G / Eb key centres", "Bmaj7–D7–Gmaj7–Bb7–Ebmaj7", "Opening cycle", "section", "The opening traverses the tune's three major key centres by major thirds with dominant preparation.")
    ],
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
    examples: [
      progressionExample("Blues for Alice", "Charlie Parker", "F", "Fmaj7–Em7b5 A7–Dm7 G7–Cm7 F7…", "Whole form", "exact", "The displayed Bird-blues family is named for the rapid descending ii–V chains in this composition.")
    ],
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
  },
  banjo: {
    label: "Banjo",
    defaultTuning: "openG"
  },
  ukulele: {
    label: "Ukulele",
    defaultTuning: "standard"
  }
};

const TUNINGS = {
  guitar: {
    standard: {
      label: "Standard",
      summary: "Standard tuning, high E on top.",
      tuning: notes("E", "B", "G", "D", "A", "E"),
      openMidi: [64, 59, 55, 50, 45, 40]
    },
    dropD: {
      label: "Drop D",
      summary: "Drop D tuning, high E on top.",
      tuning: notes("E", "B", "G", "D", "A", "D"),
      openMidi: [64, 59, 55, 50, 45, 38]
    },
    dadgad: {
      label: "DADGAD",
      summary: "DADGAD tuning, high D on top.",
      tuning: notes("D", "A", "G", "D", "A", "D"),
      openMidi: [62, 57, 55, 50, 45, 38]
    },
    openD: {
      label: "Open D",
      summary: "Open D tuning, high D on top.",
      tuning: notes("D", "A", "F#", "D", "A", "D"),
      openMidi: [62, 57, 54, 50, 45, 38]
    },
    openG: {
      label: "Open G",
      summary: "Open G tuning, high D on top.",
      tuning: notes("D", "B", "G", "D", "G", "D"),
      openMidi: [62, 59, 55, 50, 43, 38]
    },
    openC: {
      label: "Open C",
      summary: "Open C tuning, high E on top.",
      tuning: notes("E", "C", "G", "C", "G", "C"),
      openMidi: [64, 60, 55, 48, 43, 36]
    },
    openE: {
      label: "Open E",
      summary: "Open E tuning, high E on top.",
      tuning: notes("E", "B", "G#", "E", "B", "E"),
      openMidi: [64, 59, 56, 52, 47, 40]
    },
    halfStepDown: {
      label: "Half-step down",
      summary: "Half-step down tuning, high Eb on top.",
      tuning: notes("Eb", "Bb", "Gb", "Db", "Ab", "Eb"),
      openMidi: [63, 58, 54, 49, 44, 39]
    },
    allFourths: {
      label: "All fourths",
      summary: "All-fourths tuning, high F on top.",
      tuning: notes("F", "C", "G", "D", "A", "E"),
      openMidi: [65, 60, 55, 50, 45, 40]
    }
  },
  bass: {
    standard: {
      label: "Standard (4-string)",
      summary: "4-string standard tuning, G on top.",
      tuning: notes("G", "D", "A", "E"),
      openMidi: [43, 38, 33, 28]
    },
    standard5: {
      label: "Standard (5-string)",
      summary: "5-string standard tuning, G on top.",
      tuning: notes("G", "D", "A", "E", "B"),
      openMidi: [43, 38, 33, 28, 23]
    },
    standard6: {
      label: "Standard (6-string)",
      summary: "6-string standard tuning, high C on top.",
      tuning: notes("C", "G", "D", "A", "E", "B"),
      openMidi: [48, 43, 38, 33, 28, 23]
    },
    dropD: {
      label: "Drop D",
      summary: "4-string drop D tuning, G on top.",
      tuning: notes("G", "D", "A", "D"),
      openMidi: [43, 38, 33, 26]
    },
    bead: {
      label: "BEAD",
      summary: "BEAD tuning, high D on top.",
      tuning: notes("D", "A", "E", "B"),
      openMidi: [38, 33, 28, 23]
    },
    tenor: {
      label: "Tenor",
      summary: "Tenor bass tuning, high C on top.",
      tuning: notes("C", "G", "D", "A"),
      openMidi: [48, 43, 38, 33]
    },
    halfStepDown: {
      label: "Half-step down",
      summary: "4-string half-step down tuning, high Gb on top.",
      tuning: notes("Gb", "Db", "Ab", "Eb"),
      openMidi: [42, 37, 32, 27]
    }
  },
  banjo: {
    openG: {
      label: "Open G",
      summary: "5-string Open G tuning, high G drone on top.",
      tuning: notes({ label: "G", startFret: 5 }, "D", "B", "G", "D"),
      openMidi: [67, 50, 47, 43, 38]
    },
    gMinor: {
      label: "G Minor",
      summary: "5-string G Minor tuning, high G drone on top.",
      tuning: notes({ label: "G", startFret: 5 }, "D", "Bb", "G", "D"),
      openMidi: [67, 50, 46, 43, 38]
    },
    cTuning: {
      label: "C tuning",
      summary: "5-string C tuning, high G drone on top.",
      tuning: notes({ label: "G", startFret: 5 }, "D", "B", "G", "C"),
      openMidi: [67, 50, 47, 43, 36]
    },
    doubleC: {
      label: "Double C",
      summary: "5-string Double C tuning, high G drone on top.",
      tuning: notes({ label: "G", startFret: 5 }, "D", "C", "G", "C"),
      openMidi: [67, 50, 48, 43, 36]
    },
    sawmill: {
      label: "Sawmill",
      summary: "5-string Sawmill tuning, high G drone on top.",
      tuning: notes({ label: "G", startFret: 5 }, "D", "C", "G", "D"),
      openMidi: [67, 50, 48, 43, 38]
    },
    doubleD: {
      label: "Double D",
      summary: "5-string Double D tuning, high A drone on top.",
      tuning: notes({ label: "A", startFret: 5 }, "E", "D", "A", "D"),
      openMidi: [69, 52, 50, 45, 38]
    },
    openD: {
      label: "Open D",
      summary: "5-string Open D tuning, high F# drone on top.",
      tuning: notes({ label: "F#", startFret: 5 }, "D", "A", "F#", "D"),
      openMidi: [66, 50, 45, 42, 38]
    }
  },
  ukulele: {
    standard: {
      label: "Standard (GCEA)",
      summary: "Standard C tuning, high A on top.",
      tuning: notes("A", "E", "C", "G"),
      openMidi: [69, 64, 60, 67]
    },
    lowG: {
      label: "Low G (GCEA)",
      summary: "Low G tuning, high A on top.",
      tuning: notes("A", "E", "C", "G"),
      openMidi: [69, 64, 60, 55]
    },
    dTuning: {
      label: "D tuning (ADF#B)",
      summary: "D tuning, high B on top.",
      tuning: notes("B", "F#", "D", "A"),
      openMidi: [71, 66, 62, 57]
    },
    baritone: {
      label: "Baritone (DGBE)",
      summary: "Baritone tuning, high E on top.",
      tuning: notes("E", "B", "G", "D"),
      openMidi: [64, 59, 55, 50]
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

function notes(...values) {
  return values.map((value) => {
    const string = typeof value === "string" ? { label: value } : value;
    return { ...string, pc: notePcFromLabel(string.label) };
  });
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
  CHORD_LIBRARY_OPTIONS,
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
