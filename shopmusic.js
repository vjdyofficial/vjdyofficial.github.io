var identifier = "vjdyofficialmusic-2025";

async function getArchiveMusic() {
    const response = await fetch(
        `https://archive.org/metadata/${identifier}`
    );

    if (!response.ok) {
        throw new Error(`Internet Archive HTTP ${response.status}`);
    }

    const data = await response.json();

    return data.files
        .filter(file => /\.(mp3|flac)$/i.test(file.name))
        .map(file => ({
            title: file.title || file.name.replace(/\.(mp3|flac)$/i, ""),
            filename: file.name,
            url: `https://archive.org/download/${identifier}/${file.name
                .split("/")
                .map(encodeURIComponent)
                .join("/")}`,
            artist: file.creator || file.artist || data.metadata?.creator || "",
            album: file.album || ""
        }));
}

async function API_MUSIC_GET() {
  const identifier = "vjdyofficialmusic-2025";

  const data = await fetch(
    `https://archive.org/metadata/${identifier}`
  ).then((res) => res.json());

  const parent = document.getElementById("music_parent");
  const audio = document.getElementById("music_player");

  if (!parent || !audio) return;

  const files = data.files.filter((file) =>
    /\.(mp3|flac)$/i.test(file.name)
  );

  files.forEach((file) => {
    const card = document.createElement("div");
    card.className = "music_main";

    /*
     * File metadata
     */
    const title =
      file.title ||
      file.name
        .split("/")
        .pop()
        .replace(/\.(mp3|flac)$/i, "");

    const artist =
      file.artist ||
      file.creator ||
      data.metadata?.creator ||
      "";

    const album =
      file.album ||
      "";

    const filename = file.name.split("/").pop();

    const url =
      `https://archive.org/download/${identifier}/` +
      file.name
        .split("/")
        .map(encodeURIComponent)
        .join("/");

    /*
     * Album art
     *
     * If the Archive item contains an image matching
     * the audio file, use it.
     */

    /*
     * Information
     */
    const info = document.createElement("div");
    info.className = "music_info";

    const titleElement = document.createElement("h2");
    titleElement.className = "music_title";
    titleElement.textContent = title;
    titleElement.title = title;

    info.appendChild(titleElement);

    if (artist) {
      const artistElement = document.createElement("small");
      artistElement.className = "music_artist";
      artistElement.textContent = artist;
      info.appendChild(artistElement);
    }

    if (album) {
      const albumElement = document.createElement("small");
      albumElement.className = "music_album";
      albumElement.textContent = album;
      info.appendChild(albumElement);
    }

    const formatElement = document.createElement("small");
    formatElement.className = "music_format";
    formatElement.textContent =
      filename.split(".").pop().toUpperCase();

    info.appendChild(formatElement);

    card.appendChild(info);

    /*
     * Click → play using existing audio element
     */
    card.addEventListener("click", () => {
      audio.src = url;
      audio.load();
      audio.play().catch(console.error);
    });

    parent.appendChild(card);
  });
}

API_MUSIC_GET();