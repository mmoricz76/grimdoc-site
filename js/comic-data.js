(function () {
  "use strict";

  function formatDate(isoDate) {
    if (!isoDate) return "";
    const dt = new Date(isoDate + "T00:00:00");
    return dt.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }

  async function fetchJson(path) {
    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Failed to load " + path + " (" + response.status + ")");
    }
    return response.json();
  }

  async function loadEpisodeIndex() {
    const data = await fetchJson("episodes/episodes.json");
    const episodes = Array.isArray(data.episodes) ? data.episodes.slice() : [];
    episodes.sort(function (a, b) {
      return (a.episodeNumber || 0) - (b.episodeNumber || 0);
    });
    return { series: data.series || {}, episodes: episodes };
  }

  function chooseEpisode(episodes, key) {
    if (!episodes.length) return null;
    if (key) {
      const match = episodes.find(function (episode) {
        return episode.id === key || episode.slug === key;
      });
      if (match) return match;
    }
    const published = episodes.filter(function (episode) {
      return episode.status === "published";
    });
    if (published.length) return published[published.length - 1];
    return episodes[episodes.length - 1];
  }

  function findEpisodeNeighbors(episodes, currentId) {
    const index = episodes.findIndex(function (episode) {
      return episode.id === currentId;
    });
    return {
      first: episodes[0] || null,
      previous: index > 0 ? episodes[index - 1] : null,
      next: index >= 0 && index < episodes.length - 1 ? episodes[index + 1] : null,
      latest: episodes.length ? episodes[episodes.length - 1] : null
    };
  }

  function renderPanel(panel, episodeFolder) {
    const card = document.createElement("article");
    const layout = panel.layout || "standard";
    card.className = "panel-card panel-layout-" + layout;

    const image = document.createElement("img");
    image.loading = "lazy";
    image.decoding = "async";
    image.src = episodeFolder + "/" + panel.file;
    image.alt = panel.alt || "Comic panel";
    card.appendChild(image);

    if (panel.caption) {
      const caption = document.createElement("p");
      caption.className = "panel-caption";
      caption.textContent = panel.caption;
      card.appendChild(caption);
    }

    return card;
  }

  function setLink(linkId, episodeEntry, fallbackHref) {
    const link = document.getElementById(linkId);
    if (!link) return;
    if (!episodeEntry) {
      link.href = fallbackHref;
      link.setAttribute("aria-disabled", "true");
      link.classList.add("is-disabled");
      return;
    }
    link.href = "comic.html?episode=" + encodeURIComponent(episodeEntry.id);
    link.removeAttribute("aria-disabled");
    link.classList.remove("is-disabled");
  }

  async function initReaderPage() {
    const panelGrid = document.getElementById("panelGrid");
    if (!panelGrid) return;

    try {
      const params = new URLSearchParams(window.location.search);
      const requested = params.get("episode");

      const indexData = await loadEpisodeIndex();
      const chosen = chooseEpisode(indexData.episodes, requested);
      if (!chosen) {
        panelGrid.innerHTML = "<p>No episodes found.</p>";
        return;
      }

      const episodeData = await fetchJson(chosen.episodePath);
      const episodeFolder = chosen.episodePath.substring(0, chosen.episodePath.lastIndexOf("/"));

      const episodeTitle = document.getElementById("episodeTitle");
      const episodeMeta = document.getElementById("episodeMeta");
      const episodeDescription = document.getElementById("episodeDescription");
      episodeTitle.textContent = "Episode " + (episodeData.episodeNumber || "") + " - " + (episodeData.title || "Untitled");
      episodeMeta.textContent = formatDate(episodeData.publishDate);
      episodeDescription.textContent = episodeData.description || "";

      panelGrid.innerHTML = "";
      (episodeData.panels || []).forEach(function (panel) {
        panelGrid.appendChild(renderPanel(panel, episodeFolder));
      });

      const neighbors = findEpisodeNeighbors(indexData.episodes, chosen.id);
      setLink("firstEpisodeLink", neighbors.first, "comics.html");
      setLink("prevEpisodeLink", neighbors.previous, "comics.html");
      setLink("nextEpisodeLink", neighbors.next, "comics.html");
      setLink("latestEpisodeLink", neighbors.latest, "comics.html");

      const merchWrap = document.getElementById("episodeMerch");
      const merchLink = document.getElementById("episodeMerchLink");
      if (merchWrap && merchLink) {
        if (episodeData.merchandiseUrl) {
          merchLink.href = episodeData.merchandiseUrl;
          merchWrap.classList.remove("is-hidden");
        } else {
          merchWrap.classList.add("is-hidden");
        }
      }
    } catch (error) {
      panelGrid.innerHTML = "<p>Reader error: " + error.message + "</p>";
      console.error(error);
    }
  }

  function archiveCard(episode) {
    const card = document.createElement("article");
    card.className = "archive-card";

    const link = document.createElement("a");
    link.href = "comic.html?episode=" + encodeURIComponent(episode.id);
    link.className = "archive-link";

    const title = document.createElement("h2");
    title.textContent = "Episode " + (episode.episodeNumber || "") + " - " + (episode.title || "Untitled");

    const meta = document.createElement("p");
    meta.className = "archive-meta";
    meta.textContent = formatDate(episode.publishDate);

    const desc = document.createElement("p");
    desc.className = "archive-desc";
    desc.textContent = episode.description || "";

    link.appendChild(title);
    link.appendChild(meta);
    link.appendChild(desc);
    card.appendChild(link);

    return card;
  }

  async function initArchivePage() {
    const list = document.getElementById("archiveList");
    if (!list) return;

    try {
      const indexData = await loadEpisodeIndex();
      const entries = indexData.episodes.filter(function (episode) {
        return episode.status !== "draft";
      });
      const finalEntries = entries.length ? entries : indexData.episodes;

      list.innerHTML = "";
      if (!finalEntries.length) {
        list.innerHTML = "<p>No episodes are available yet.</p>";
        return;
      }

      finalEntries.forEach(function (episode) {
        list.appendChild(archiveCard(episode));
      });
    } catch (error) {
      list.innerHTML = "<p>Archive error: " + error.message + "</p>";
      console.error(error);
    }
  }

  window.GrimdocComic = {
    initReaderPage: initReaderPage,
    initArchivePage: initArchivePage
  };
})();