(() => {
  "use strict";

  const { SCALES } = window.FretLabData;
  const els = {
    search: document.getElementById("repertoireSearch"),
    scale: document.getElementById("repertoireScale"),
    artist: document.getElementById("repertoireArtist"),
    count: document.getElementById("repertoireCount"),
    list: document.getElementById("repertoireList"),
    empty: document.getElementById("repertoireEmpty")
  };

  const tracks = Array.from(Object.entries(SCALES).reduce((grouped, [scaleKey, scale]) => {
    (scale.examples || []).forEach((example) => {
      const id = `${example.artist}\u0000${example.title}`;
      const track = grouped.get(id) || { title: example.title, artist: example.artist, contexts: [] };
      track.contexts.push({
        scaleKey,
        scaleLabel: scale.label,
        family: scale.family,
        key: example.key,
        focus: example.focus
      });
      grouped.set(id, track);
    });
    return grouped;
  }, new Map()).values()).sort((left, right) => left.artist.localeCompare(right.artist) || left.title.localeCompare(right.title));

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
    const contextLabel = document.createElement("h4");
    const contexts = document.createElement("div");
    const links = document.createElement("div");
    const search = encodeURIComponent(`${track.artist} ${track.title}`);

    article.className = "repertoire-card";
    header.className = "repertoire-card-header";
    title.className = "repertoire-title";
    artist.className = "repertoire-artist";
    contextLabel.className = "repertoire-context-label";
    contexts.className = "repertoire-contexts";
    links.className = "scale-listening-links repertoire-links";
    title.textContent = track.title;
    artist.textContent = track.artist;
    contextLabel.textContent = t("Scale contexts");

    track.contexts.forEach((context) => {
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
    });

    links.append(
      listeningLink("▶ YouTube", "is-youtube", `https://www.youtube.com/results?search_query=${search}`, true),
      listeningLink("♫ Spotify", "is-spotify", `spotify:search:${search}`)
    );
    header.append(title, artist);
    article.append(header, contextLabel, contexts, links);
    return article;
  }

  function matches(track) {
    const query = els.search.value.trim().toLocaleLowerCase();
    const scaleKey = els.scale.value;
    const artist = els.artist.value;
    if (artist && track.artist !== artist) return false;
    if (scaleKey && !track.contexts.some((context) => context.scaleKey === scaleKey)) return false;
    if (!query) return true;
    const searchable = [
      track.title,
      track.artist,
      ...track.contexts.flatMap((context) => [context.scaleLabel, t(context.scaleLabel), context.family, context.key, context.focus, t(context.focus)])
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
  [els.search, els.scale, els.artist].forEach((control) => control.addEventListener("input", render));
  document.addEventListener("fretlab:localechange", render);
  render();
})();
