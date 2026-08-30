(() => {
  "use strict";

  const { SCALES, PROGRESSIONS } = window.FretLabData;
  const els = {
    search: document.getElementById("repertoireSearch"),
    scale: document.getElementById("repertoireScale"),
    progression: document.getElementById("repertoireProgression"),
    artist: document.getElementById("repertoireArtist"),
    count: document.getElementById("repertoireCount"),
    list: document.getElementById("repertoireList"),
    empty: document.getElementById("repertoireEmpty")
  };

  const groupedTracks = Object.entries(SCALES).reduce((grouped, [scaleKey, scale]) => {
    (scale.examples || []).forEach((example) => {
      const id = `${example.artist}\u0000${example.title}`;
      const track = grouped.get(id) || { title: example.title, artist: example.artist, contexts: [] };
      track.contexts.push({
        type: "scale",
        scaleKey,
        scaleLabel: scale.label,
        family: scale.family,
        key: example.key,
        focus: example.focus
      });
      grouped.set(id, track);
    });
    return grouped;
  }, new Map());

  Object.entries(PROGRESSIONS).forEach(([progressionKey, progression]) => {
    (progression.examples || []).forEach((example) => {
      const id = `${example.artist}\u0000${example.title}`;
      const track = groupedTracks.get(id) || { title: example.title, artist: example.artist, contexts: [] };
      track.contexts.push({
        type: "progression",
        progressionKey,
        progressionLabel: progression.label,
        family: progression.family,
        key: example.key,
        chords: example.chords,
        section: example.section,
        match: example.match,
        note: example.note
      });
      groupedTracks.set(id, track);
    });
  });

  const tracks = Array.from(groupedTracks.values()).sort((left, right) => left.artist.localeCompare(right.artist) || left.title.localeCompare(right.title));

  function t(value) {
    return window.FretLabI18n?.t(value) || value;
  }

  function appendOption(select, value, label) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    select.append(option);
  }

  function populateFilters() {
    Object.entries(SCALES).filter(([, scale]) => scale.examples?.length).forEach(([scaleKey, scale]) => {
      appendOption(els.scale, scaleKey, scale.label);
    });
    Object.entries(PROGRESSIONS).filter(([, progression]) => progression.examples?.length).forEach(([progressionKey, progression]) => {
      appendOption(els.progression, progressionKey, progression.label);
    });
    [...new Set(tracks.map((track) => track.artist))].forEach((artist) => appendOption(els.artist, artist, artist));
  }

  function listeningLink(label, className, url, newTab = false) {
    const link = document.createElement("a");
    link.className = `scale-listening-link ${className}`;
    link.href = url;
    link.textContent = label;
    if (newTab) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    return link;
  }

  function renderTrack(track) {
    const article = document.createElement("article");
    const header = document.createElement("header");
    const title = document.createElement("h3");
    const artist = document.createElement("p");
    const contexts = document.createElement("div");
    const links = document.createElement("div");
    const search = encodeURIComponent(`${track.artist} ${track.title}`);

    article.className = "repertoire-card";
    header.className = "repertoire-card-header";
    title.className = "repertoire-title";
    artist.className = "repertoire-artist";
    contexts.className = "repertoire-contexts";
    links.className = "scale-listening-links repertoire-links";
    title.textContent = track.title;
    artist.textContent = track.artist;
    const appendContextLabel = (label) => {
      const contextLabel = document.createElement("h4");
      contextLabel.className = "repertoire-context-label";
      contextLabel.textContent = t(label);
      contexts.append(contextLabel);
    };
    const renderScaleContext = (context) => {
      const item = document.createElement("section");
      const heading = document.createElement("div");
      const scale = document.createElement("strong");
      const key = document.createElement("span");
      const focus = document.createElement("p");
      item.className = "repertoire-context";
      heading.className = "repertoire-context-heading";
      scale.textContent = t(context.scaleLabel);
      key.textContent = context.key;
      focus.textContent = t(context.focus);
      heading.append(scale, key);
      item.append(heading, focus);
      contexts.append(item);
    };
    const matchLabels = { exact: "Exact match", section: "Section match", variant: "Useful variant" };
    const renderProgressionContext = (context) => {
      const item = document.createElement("section");
      const heading = document.createElement("div");
      const progression = document.createElement("strong");
      const match = document.createElement("span");
      const details = document.createElement("p");
      const note = document.createElement("p");
      item.className = "repertoire-context repertoire-progression-context";
      heading.className = "repertoire-context-heading";
      progression.textContent = t(context.progressionLabel);
      match.className = `progression-match progression-match-${context.match}`;
      match.textContent = t(matchLabels[context.match] || context.match);
      details.textContent = `${t("Key")}: ${t(context.key)} · ${t("Chords")}: ${context.chords} · ${t("Where")}: ${t(context.section)}`;
      note.textContent = t(context.note);
      heading.append(progression, match);
      item.append(heading, details, note);
      contexts.append(item);
    };
    const scaleContexts = track.contexts.filter((context) => context.type === "scale");
    const progressionContexts = track.contexts.filter((context) => context.type === "progression");
    if (scaleContexts.length) {
      appendContextLabel("Scale contexts");
      scaleContexts.forEach(renderScaleContext);
    }
    if (progressionContexts.length) {
      appendContextLabel("Progression contexts");
      progressionContexts.forEach(renderProgressionContext);
    }

    links.append(
      listeningLink("▶ YouTube", "is-youtube", `https://www.youtube.com/results?search_query=${search}`, true),
      listeningLink("♫ Spotify", "is-spotify", `spotify:search:${search}`)
    );
    header.append(title, artist);
    article.append(header, contexts, links);
    return article;
  }

  function matches(track) {
    const query = els.search.value.trim().toLocaleLowerCase();
    const scaleKey = els.scale.value;
    const progressionKey = els.progression.value;
    const artist = els.artist.value;
    if (artist && track.artist !== artist) return false;
    if (scaleKey && !track.contexts.some((context) => context.scaleKey === scaleKey)) return false;
    if (progressionKey && !track.contexts.some((context) => context.progressionKey === progressionKey)) return false;
    if (!query) return true;
    const searchable = [
      track.title,
      track.artist,
      ...track.contexts.flatMap((context) => [
        context.scaleLabel,
        t(context.scaleLabel),
        context.progressionLabel,
        t(context.progressionLabel),
        context.family,
        context.key,
        t(context.key),
        context.focus,
        t(context.focus),
        context.chords,
        context.section,
        t(context.section),
        context.note,
        t(context.note)
      ])
    ].join(" ").toLocaleLowerCase();
    return searchable.includes(query);
  }

  function render() {
    const visibleTracks = tracks.filter(matches);
    els.list.replaceChildren(...visibleTracks.map(renderTrack));
    els.empty.hidden = visibleTracks.length > 0;
    els.count.textContent = `${visibleTracks.length} ${t(visibleTracks.length === 1 ? "track" : "tracks")}`;
  }

  populateFilters();
  [els.search, els.scale, els.progression, els.artist].forEach((control) => control.addEventListener("input", render));
  document.addEventListener("fretlab:localechange", render);
  render();
})();
