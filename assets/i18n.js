(() => {
  const STORAGE_KEY = "fretlab-locale";
  const supportedLocales = ["en", "it"];
  const italian = {
    "FretLab - Scales": "FretLab - Scale", "FretLab - Chords": "FretLab - Accordi", "FretLab - Progressions": "FretLab - Progressioni", "FretLab - Triads": "FretLab - Triadi", "FretLab - Metronome": "FretLab - Metronomo",
    "Scales": "Scale", "Chords": "Accordi", "Progressions": "Progressioni", "Triads": "Triadi", "Metronome": "Metronomo",
    "Scales on one playable map.": "Le scale su un'unica mappa interattiva.",
    "Chord library by instrument, tuning, root, and inversion.": "Libreria di accordi per strumento, accordatura, fondamentale e rivolto.",
    "Progressions, chord tones, and targets on one playable map.": "Progressioni, note degli accordi e note obiettivo su un'unica mappa interattiva.",
    "Triads and compact chord tones on one playable map.": "Triadi e forme compatte degli accordi su un'unica mappa interattiva.",
    "A focused practice pulse with visual beats and tap tempo.": "Un metronomo essenziale con pulsazione visiva e tap tempo.",
    "Current session": "Sessione corrente", "FretLab tools": "Strumenti FretLab",
    "Instrument": "Strumento", "Tuning": "Accordatura", "Key": "Tonalità", "Root": "Fondamentale", "Chord": "Accordo", "Triad": "Triade", "Bar": "Battuta",
    "Labels": "Etichette", "Notes": "Note", "Intervals": "Intervalli", "Frets": "Tasti", "Position": "Posizione",
    "Fretboard": "Tastiera", "Standard tuning, high E on top.": "Accordatura standard, Mi cantino in alto.",
    "Scale palette": "Tavolozza delle scale", "Scale layers": "Layer delle scale", "Progression layers": "Layer della progressione",
    "Tempo": "Tempo", "Play": "Riproduci", "Stop": "Ferma", "▶ Play": "▶ Riproduci", "■ Stop": "■ Ferma", "Playback": "Riproduzione",
    "Hear it in context": "Ascoltala nel contesto", "Listen for:": "Ascolta:", "Common use:": "Uso comune:",
    "Family": "Famiglia", "Progression": "Progressione", "Current bar": "Battuta corrente", "Previous bar": "Battuta precedente", "Next bar": "Battuta successiva",
    "Chord type": "Tipo di accordo", "Chord library": "Libreria degli accordi", "No practical voicings found for this selection.": "Nessuna diteggiatura pratica disponibile per questa selezione.",
    "Quality": "Qualità", "Map strings": "Corde della mappa", "Triad trainer": "Allenamento sulle triadi",
    "Choose a study mode to isolate compact triad shapes.": "Scegli una modalità di studio per isolare forme compatte di triade.",
    "Study mode": "Modalità di studio", "Full map": "Mappa completa", "One shape": "Una forma", "Quiz": "Quiz",
    "String group": "Gruppo di corde", "Inversion": "Rivolto", "Root position": "Posizione fondamentale", "1st inversion": "Primo rivolto", "2nd inversion": "Secondo rivolto",
    "Shape labels": "Etichette della forma", "Hidden": "Nascoste", "Show solution": "Mostra soluzione", "Hide solution": "Nascondi soluzione", "New exercise": "Nuovo esercizio",
    "Previous triad shape": "Forma precedente", "Next triad shape": "Forma successiva",
    "Press Space to start or stop. Use the arrow keys to adjust the tempo.": "Premi Spazio per avviare o fermare. Usa le frecce per regolare il tempo.",
    "Decrease tempo": "Riduci il tempo", "Increase tempo": "Aumenta il tempo", "Beats per bar": "Movimenti per battuta", "Accent first beat": "Accentua il primo movimento",
    "Start": "Avvia", "Tap tempo": "Tap tempo", "Metronome stopped": "Metronomo fermo", "Download": "Scarica", "Active": "Attivi", "Clear": "Cancella", "Listen": "Ascolta", "Sound": "Suono",
    "Focus": "Focus", "All active layers": "Tutti i layer attivi", "Chord tones": "Note dell'accordo", "Guide tones": "Note guida", "Target notes": "Note obiettivo", "Targets": "Obiettivi", "Root + fifth": "Fondamentale + quinta",
    "Triad layers": "Layer delle triadi", "Triad tones": "Note della triade", "Current triad": "Triade corrente", "Current chord": "Accordo corrente", "Triad arpeggio": "Arpeggio della triade", "Root, third, fifth": "Fondamentale, terza, quinta", "▶ Play triad": "▶ Riproduci triade",
    "Suggested vocabulary": "Vocabolario suggerito", "Use suggestions": "Usa suggerimenti", "Chord-relative scales and arpeggios for the current bar.": "Scale e arpeggi relativi all'accordo della battuta corrente.",
    "Major": "Maggiore", "Minor": "Minore", "Diminished": "Diminuito", "Augmented": "Aumentato", "Power chord": "Power chord",
    "Suspended 2": "Sospeso 2", "Suspended 4": "Sospeso 4", "Major 6": "Maggiore 6", "Minor 6": "Minore 6", "Major 7": "Maggiore 7", "Dominant 7": "Settima di dominante", "Minor 7": "Minore 7", "Minor major 7": "Minore con settima maggiore", "Dominant 7sus4": "Dominante 7sus4", "Half-diminished 7": "Semidiminuito 7", "Diminished 7": "Diminuito 7", "Add 9": "Aggiunta 9", "Minor add 9": "Minore add9", "Major 9": "Maggiore 9", "Dominant 9": "Dominante 9", "Minor 9": "Minore 9",
    "Major scale": "Scala maggiore", "Natural minor": "Minore naturale", "Melodic minor": "Minore melodica", "Harmonic minor": "Minore armonica",
    "Major pentatonic": "Pentatonica maggiore", "Minor pentatonic": "Pentatonica minore", "Blues / minor blues": "Blues / blues minore", "Major blues": "Blues maggiore", "Rock and roll": "Rock and roll",
    "Ionian": "Ionico", "Dorian": "Dorico", "Phrygian": "Frigio", "Lydian": "Lidio", "Mixolydian": "Misolidio", "Aeolian": "Eolio", "Locrian": "Locrio",
    "Dorian bebop": "Dorico bebop", "Mixolydian bebop": "Misolidio bebop", "Whole tone": "Esatonale", "Half whole diminished": "Diminuita semitono-tono", "Whole half diminished": "Diminuita tono-semitono",
    "Phrygian dominant / Flamenco": "Frigio dominante / Flamenco", "Spanish": "Spagnola", "Persian": "Persiana", "Double harmonic major": "Doppia armonica maggiore", "Hungarian minor": "Minore ungherese",
    "Common": "Comuni", "Pentatonic / blues": "Pentatoniche / blues", "Modes": "Modi", "Bebop / symmetric": "Bebop / simmetriche", "Exotic": "Esotiche",
    "Major quality": "Qualità maggiore", "Minor quality": "Qualità minore", "Major / dominant quality": "Qualità maggiore / dominante", "Diminished quality": "Qualità diminuita",
    "Minor blues quality": "Qualità blues minore", "Major blues quality": "Qualità blues maggiore", "Mixed major/minor quality": "Qualità mista maggiore/minore",
    "Minor bebop quality": "Qualità bebop minore", "Dominant bebop quality": "Qualità bebop dominante", "Symmetric augmented quality": "Qualità aumentata simmetrica", "Symmetric dominant quality": "Qualità dominante simmetrica",
    "Reference seven-note major collection": "Scala maggiore di riferimento a sette note", "Tonal major harmony and melodies": "Armonia e melodie tonali maggiori",
    "b3, b6 and b7 distinguish it from major": "b3, b6 e b7 la distinguono dalla scala maggiore", "Tonal minor harmony without a raised leading tone": "Armonia tonale minore senza sensibile innalzata",
    "Natural 6 and 7 distinguish it from natural minor": "6 e 7 naturali la distinguono dalla minore naturale", "Minor-key melodies and modern jazz harmony": "Melodie in tonalità minore e armonia jazz moderna",
    "Major 7 creates a strong leading tone above b6": "La 7 maggiore crea una forte sensibile sopra la b6", "Minor harmony with a dominant V chord": "Armonia minore con accordo di V dominante",
    "Major scale without the 4 and 7": "Scala maggiore senza 4 e 7", "Major-key melodies, country, folk and pop": "Melodie maggiori, country, folk e pop",
    "Compact minor sound built around b3 and b7": "Suono minore compatto costruito attorno a b3 e b7", "Blues, rock and minor-key improvisation": "Blues, rock e improvvisazione in tonalità minore",
    "Minor pentatonic with the b5 blue note": "Pentatonica minore con la blue note b5", "Minor and dominant blues harmony": "Armonia blues minore e dominante",
    "Major pentatonic with b3 as a blue note": "Pentatonica maggiore con b3 come blue note", "Major and dominant blues harmony": "Armonia blues maggiore e dominante",
    "Combines b3, 3, b5 and b7": "Combina b3, 3, b5 e b7", "Rock-and-roll riffs and dominant blues harmony": "Riff rock and roll e armonia blues dominante",
    "Modal name for the major scale": "Nome modale della scala maggiore", "Modal name for the natural minor scale": "Nome modale della minore naturale",
    "Natural 6 distinguishes it from natural minor": "La 6 naturale lo distingue dalla minore naturale", "Minor i-IV vamps, modal jazz and funk": "Vamp minori i-IV, jazz modale e funk",
    "b2 gives it its defining close pull to the root": "La b2 crea la caratteristica attrazione ravvicinata verso la tonica", "Static minor harmony and suspended dominant sounds": "Armonia minore statica e sonorità dominanti sospese",
    "#4 distinguishes it from the major scale": "La #4 lo distingue dalla scala maggiore", "Major chords with a #11 and modal harmony": "Accordi maggiori con #11 e armonia modale",
    "b7 distinguishes it from the major scale": "La b7 lo distingue dalla scala maggiore", "Dominant chords, blues, rock and funk": "Accordi dominanti, blues, rock e funk",
    "b2 and b5 weaken both tonic and dominant stability": "b2 e b5 indeboliscono la stabilità di tonica e dominante", "Minor-key iiø harmony and diminished sonorities": "Armonia iiø in tonalità minore e sonorità diminuite",
    "Dorian with 3 as a chromatic passing tone": "Dorico con 3 come nota cromatica di passaggio", "Eighth-note lines over minor and minor-sixth chords": "Linee di crome su accordi minori e minori sesta",
    "Mixolydian with 7 as a chromatic passing tone": "Misolidio con 7 come nota cromatica di passaggio", "Eighth-note lines over dominant chords": "Linee di crome su accordi dominanti",
    "Built entirely from whole steps, with no perfect 5": "Costruita interamente per toni interi, senza 5 giusta", "Augmented chords and unresolved dominant sounds": "Accordi aumentati e sonorità dominanti irrisolte",
    "Phrygian b2 and b7 surrounding a major tonic triad": "b2 e b7 frigie attorno a una triade maggiore di tonica", "Flamenco harmony, the Andalusian cadence and dominant sounds in minor keys": "Armonia flamenca, cadenza andalusa e sonorità dominanti nelle tonalità minori",
    "C flamenco Phrygian": "Do frigio flamenco", "C# flamenco Phrygian / rondeña": "Do# frigio flamenco / rondeña", "E Phrygian dominant": "Mi frigio dominante", "F# flamenco Phrygian / taranta": "Fa# frigio flamenco / taranta", "G# flamenco Phrygian / minera": "Sol# frigio flamenco / minera", "B flamenco Phrygian / granaína": "Si frigio flamenco / granaína",
    "The bulería centres C with the characteristic major tonic, b2 and Phrygian flamenco harmony": "La bulería è centrata su Do, con la caratteristica tonica maggiore, la b2 e l'armonia frigia flamenca",
    "The rondeña resolves around C# and D; its characteristic tuning and open strings expand the harmony beyond a strict seven-note scale": "La rondeña risolve attorno a Do# e Re; l'accordatura caratteristica e le corde a vuoto estendono l'armonia oltre una rigida scala di sette note",
    "The familiar guitar melody foregrounds E, F and G#, while traditional performances may also use G natural": "La celebre melodia mette in primo piano Mi, Fa e Sol#, mentre le interpretazioni tradizionali possono usare anche Sol naturale",
    "The taranta centres F# against G and repeatedly resolves through the characteristic Bm–A7–G–F# flamenco motion": "La taranta contrappone Fa# e Sol e risolve ripetutamente attraverso il caratteristico movimento flamenco Sim–La7–Sol–Fa#",
    "The minera uses the traditional G#–A Phrygian axis, enriched by open-string dissonances and changing major/minor-third colour": "La minera usa il tradizionale asse frigio Sol#–La, arricchito dalle dissonanze delle corde a vuoto e dall'alternanza fra terza maggiore e minore",
    "The granaína moves through Em–D–C and resolves to B, making the C–B b2-to-tonic cadence especially clear": "La granaína attraversa Mim–Re–Do e risolve su Si, rendendo particolarmente chiara la cadenza b2–tonica Do–Si",
    "The twelve-bar minor blues begins in C natural minor, then brings the C minor-blues scale into the melody and improvisation": "Il blues minore di dodici battute parte da Do minore naturale, poi introduce la scala blues minore di Do nella melodia e nell'improvvisazione",
    "Audio playback is unavailable.": "La riproduzione audio non è disponibile.", "Cannot play an empty chord voicing.": "Impossibile riprodurre una diteggiatura vuota.", "Cannot play an empty progression.": "Impossibile riprodurre una progressione vuota.", "Cannot play an empty triad shape.": "Impossibile riprodurre una forma di triade vuota.",
    "No shape available": "Nessuna forma disponibile", "Only shape in this fret range": "Unica forma in questo intervallo di tasti", "Reveal to play": "Mostra per riprodurre", "Reveal the solution to listen": "Mostra la soluzione per ascoltare",
    "All strings": "Tutte le corde", "All inversions": "Tutti i rivolti", "All families": "Tutte le famiglie", "None": "Nessuno", "None selected": "Nessuna selezione", "Suggested": "Suggerito", "Other": "Altro", "Language": "Lingua",
    "Guitar": "Chitarra", "Bass": "Basso", "Banjo": "Banjo", "Ukulele": "Ukulele", "Full range": "Intera tastiera", "Open position": "Posizione aperta", "Low box": "Box basso", "Middle box": "Box centrale", "Upper box": "Box alto", "Octave box": "Box all'ottava", "High range": "Registro alto",
    "Standard tuning, high E on top.": "Accordatura standard, Mi cantino in alto.", "Drop D tuning, high E on top.": "Accordatura Drop D, Mi cantino in alto.", "DADGAD tuning, high D on top.": "Accordatura DADGAD, Re cantino in alto.", "Open D tuning, high D on top.": "Accordatura aperta in Re, Re cantino in alto.", "Open G tuning, high D on top.": "Accordatura aperta in Sol, Re cantino in alto.", "Open C tuning, high E on top.": "Accordatura aperta in Do, Mi cantino in alto.", "Open E tuning, high E on top.": "Accordatura aperta in Mi, Mi cantino in alto.", "Half-step down tuning, high Eb on top.": "Accordatura abbassata di un semitono, Mib cantino in alto.", "All-fourths tuning, high F on top.": "Accordatura per quarte, Fa cantino in alto.",
    "World / exotic": "World / esotiche", "Gypsy major": "Maggiore gitana", "Gypsy minor": "Minore gitana",
    "Major triad": "Triade maggiore", "Minor triad": "Triade minore", "Diminished triad": "Triade diminuita", "Augmented triad": "Triade aumentata",
    "Map": "Mappa", "Shape": "Forma", "Reveal to play": "Mostra per riprodurre", "Reveal the solution before playing.": "Mostra la soluzione prima di riprodurre.", "Reveal the quiz solution before playback": "Mostra la soluzione del quiz prima della riproduzione"
  };

  const sourceTexts = new WeakMap();
  const sourceAttributes = new WeakMap();
  let locale = resolveLocale();
  let observer;

  function resolveLocale() {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (supportedLocales.includes(saved)) return saved;
    return window.navigator.language?.toLowerCase().startsWith("it") ? "it" : "en";
  }

  function t(value) {
    if (value == null || locale === "en") return value;
    if (italian[value]) return italian[value];
    if (value.startsWith("Common use: ")) return `Uso comune: ${t(value.slice(12))}`;
    if (value.startsWith("Context · ")) return `Contesto · ${value.slice(10)}`;
    if (value.startsWith("Playing ")) return `Riproduzione: ${value.slice(8)}`;
    if (value.endsWith(" · Root, third, fifth")) {
      const chordName = value.slice(0, -21).replace(" major triad", " triade maggiore").replace(" minor triad", " triade minore").replace(" diminished triad", " triade diminuita").replace(" augmented triad", " triade aumentata");
      return `${chordName} · Fondamentale, terza, quinta`;
    }
    if (/^(major|minor|diminished|augmented) triad on /.test(value)) return value.replace("major triad on", "triade maggiore su").replace("minor triad on", "triade minore su").replace("diminished triad on", "triade diminuita su").replace("augmented triad on", "triade aumentata su");
    if (value.startsWith("Standard tuning, high E on top. ")) return value.replace("Standard tuning, high E on top.", "Accordatura standard, Mi cantino in alto.").replace("Open strings + frets", "Corde a vuoto + tasti");
    if (/^Frets \d/.test(value)) return value.replace("Frets", "Tasti");
    if (/^Strings \d-\d$/.test(value)) return value.replace("Strings", "Corde");
    if (/^\d+ of \d+$/.test(value)) return value.replace(" of ", " di ");
    if (/^Beat \d+ of \d+$/.test(value)) return value.replace("Beat", "Movimento").replace(" of ", " di ");
    if (/^Metronome (running|stopped) at \d+ BPM$/.test(value)) {
      return value.replace("Metronome running at", "Metronomo attivo a").replace("Metronome stopped at", "Metronomo fermo a");
    }
    return value;
  }

  function translateTextNode(node) {
    const current = node.nodeValue;
    const trimmed = current.trim();
    if (!trimmed) return;
    if (!sourceTexts.has(node)) sourceTexts.set(node, trimmed);
    const source = sourceTexts.get(node);
    const leading = current.match(/^\s*/)?.[0] || "";
    const trailing = current.match(/\s*$/)?.[0] || "";
    node.nodeValue = `${leading}${t(source)}${trailing}`;
  }

  function translateElement(element) {
    ["aria-label", "title", "placeholder"].forEach((attribute) => {
      if (!element.hasAttribute(attribute)) return;
      if (!sourceAttributes.has(element)) sourceAttributes.set(element, {});
      const sources = sourceAttributes.get(element);
      if (!sources[attribute]) sources[attribute] = element.getAttribute(attribute);
      element.setAttribute(attribute, t(sources[attribute]));
    });
  }

  function translate(root = document.body) {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) translateTextNode(root);
    if (root.nodeType === Node.ELEMENT_NODE) translateElement(root);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) node.nodeType === Node.TEXT_NODE ? translateTextNode(node) : translateElement(node);
    document.documentElement.lang = locale;
    const titleSource = document.documentElement.dataset.i18nTitle || document.title;
    document.documentElement.dataset.i18nTitle = titleSource;
    document.title = t(titleSource);
  }

  function updateSwitcher() {
    document.querySelectorAll("[data-locale]").forEach((button) => {
      const active = button.dataset.locale === locale;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function setLocale(nextLocale) {
    if (!supportedLocales.includes(nextLocale) || nextLocale === locale) return;
    locale = nextLocale;
    window.localStorage.setItem(STORAGE_KEY, locale);
    updateSwitcher();
    translate(document.body);
    document.dispatchEvent(new CustomEvent("fretlab:localechange", { detail: { locale } }));
  }

  function addTranslations(localeName, translations) {
    if (localeName !== "it" || !translations) return;
    Object.assign(italian, translations);
  }

  function mountSwitcher() {
    const headerInner = document.querySelector(".app-header .container-fluid");
    if (!headerInner || headerInner.querySelector(".locale-switcher")) return;
    const switcher = document.createElement("div");
    switcher.className = "locale-switcher";
    switcher.setAttribute("aria-label", "Language");
    switcher.innerHTML = '<button type="button" data-locale="en">EN</button><button type="button" data-locale="it">IT</button>';
    switcher.addEventListener("click", (event) => {
      const button = event.target.closest("[data-locale]");
      if (button) setLocale(button.dataset.locale);
    });
    headerInner.prepend(switcher);
    updateSwitcher();
  }

  function init() {
    mountSwitcher();
    translate(document.body);
    observer = new MutationObserver((mutations) => {
      observer.disconnect();
      mutations.forEach((mutation) => {
        if (mutation.type === "characterData") translate(mutation.target);
        mutation.addedNodes.forEach((node) => translate(node));
      });
      observer.observe(document.body, { childList: true, characterData: true, subtree: true });
    });
    observer.observe(document.body, { childList: true, characterData: true, subtree: true });
  }

  window.FretLabI18n = { get locale() { return locale; }, t, translate, setLocale, addTranslations };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
