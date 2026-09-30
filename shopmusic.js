window.identifier = "vjdyofficialmusic-2025";
let fileformat = "";

const AUDIOPLAYER_TITLE = document.getElementById("AUDIOPLAYER_TITLE");
const AUDIOPLAYER_SUB = document.getElementById("AUDIOPLAYER_SUB");

function API_MUSICSEARCH(query) {
  if (query === undefined) {
    query = document.getElementById("MUSICSEARCH_BOX")?.value ?? "";
  }

  const table = document.getElementById("tablex");
  const body = table?.tBodies[0];
  if (!body) return;

  const search = String(query ?? "").trim().toLocaleLowerCase();
  Array.from(body.rows).forEach((row) => {
    const title = row.cells[0]?.textContent ?? "";
    row.style.display = title.toLocaleLowerCase().includes(search)
      ? "table-row"
      : "none";
  });
}

async function API_MUSIC_GET(id) {
  const identifier = id;

  const data = await fetch(`https://archive.org/metadata/${identifier}`).then(
    (res) => res.json(),
  );

  const table = document.getElementById("tablex");
  const audio = document.getElementById("music_player");

  if (!table || !audio) return;

  const parent = table.tBodies[0] || table.createTBody();
  const tag = identifier.replace("vjdyofficial", "").replace("music-", "")
  const files = data.files.filter((file) => /\.(mp3|flac)$/i.test(file.name));

  files.forEach((file) => {
    /*
     * File metadata
     */
    const title =
      file.title ||
      file.name
        .split("/")
        .pop()
        .replace(/\.(mp3|flac)$/i, "");

    const artist = file.artist || file.creator || data.metadata?.creator || "";

    const album = file.album || "";

    const format = file.name.split(".").pop().toUpperCase();

    const url =
      `https://archive.org/download/${identifier}/` +
      file.name.split("/").map(encodeURIComponent).join("/");

    const row = document.createElement("tr");
    row.className = "music_main";
    row.tabIndex = 0;
    row.style.display = "table-row";

    const cell = document.createElement("td");
    cell.colSpan = 3;
    cell.style.display = "table-cell";

    const createLine = (icon, value, subtitle) => {
      const line = document.createElement("div");
      const main = document.createElement("span");
      main.innerHTML = `${icon} ${value}`;

      const small = document.createElement("small");
      small.textContent = subtitle;
      small.style.display = "block";

      line.append(main, small);
      return line;
    };

    cell.append(
      createLine(`<img src="./assets/icons/music.svg" width="12px" class="tint"/>`, title, artist),
      createLine(``, album, `${format} - ${tag}`),
    );

    row.appendChild(cell);

    /*
     * Click → play using existing audio element
     */
    const play = () => {
      audio.src = url;
      AUDIOPLAYER_TITLE.textContent = title;
      AUDIOPLAYER_SUB.textContent = artist;
      fileformat = file.name;
      audio.load();
      audio.play().catch(console.error);
    };

    row.addEventListener("click", play);
    row.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        play();
      }
    });

    parent.appendChild(row);
  });
}

let musicPlayer = document.getElementById("music_player");
const AUDIOPLAYER_ICON = document.getElementById("AUDIOPLAYER_ICON");
const AUDIOPLAYER_PLAYBTN = document.getElementById("AUDIOPLAYER_PLAYBTN");
const AUDIOPLAYER_SLIDER = document.getElementById("AUDIOPLAYER_SLIDER");
const AUDIOPLAYER_DOWNLOAD = document.getElementById("AUDIOPLAYER_DOWNLOAD");

if (AUDIOPLAYER_DOWNLOAD && musicPlayer) {
  AUDIOPLAYER_DOWNLOAD.addEventListener("click", async () => {
    if (!musicPlayer.src) return;

    try {
      const response = await fetch(musicPlayer.src);
      if (!response.ok) {
        throw new Error(`Download failed: HTTP ${response.status}`);
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = fileformat;
      link.click();
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error("Unable to download the current track:", error);
    }
  });
}

let UPDATE_ON_NONINPUT = true;

if (musicPlayer) {
  AUDIOPLAYER_SLIDER.addEventListener("mouseenter", () => {
    UPDATE_ON_NONINPUT = false;
  });
  AUDIOPLAYER_SLIDER.addEventListener("mouseleave", () => {
    UPDATE_ON_NONINPUT = true;
  });
  AUDIOPLAYER_SLIDER.addEventListener("touchstart", () => {
    UPDATE_ON_NONINPUT = false;
  });
  AUDIOPLAYER_SLIDER.addEventListener("touchend", () => {
    UPDATE_ON_NONINPUT = true;
  });
  AUDIOPLAYER_SLIDER.addEventListener("touchcancel", () => {
    UPDATE_ON_NONINPUT = true;
  });

  const setPlayerState = (state) => {
    const icon = state ? "pause" : "play_arrow";
    AUDIOPLAYER_ICON.src = "../assets/icons/" + icon + ".svg";
  };

  const updatePlayerProgress = () => {
    if (!UPDATE_ON_NONINPUT) return;

    const progress = musicPlayer.duration
      ? (musicPlayer.currentTime / musicPlayer.duration) * 100
      : 0;

    AUDIOPLAYER_SLIDER.style.backgroundSize = progress + "% 100%";
    const clamped = Math.min(100, Math.max(0, progress));
    musicPlayer.dataset.progress = String(clamped);
    musicPlayer.setAttribute("data-progress", String(clamped));
    AUDIOPLAYER_SLIDER.value = progress;
  };

  const seek = (e) => {
    if (!Number.isFinite(musicPlayer.duration) || musicPlayer.duration <= 0)
      return;

    const value = Number(e.target.value);
    if (!Number.isFinite(value)) return;

    const progress = Math.min(100, Math.max(0, value));
    e.target.style.backgroundSize = progress + "% 100%";
    musicPlayer.currentTime = (progress / 100) * musicPlayer.duration;
  };

  const seek_notaudio = (e) => {
    if (!Number.isFinite(musicPlayer.duration) || musicPlayer.duration <= 0)
      return;

    const value = Number(e.target.value);
    if (!Number.isFinite(value)) return;

    const progress = Math.min(100, Math.max(0, value));
    e.target.style.backgroundSize = progress + "% 100%";
  };

  AUDIOPLAYER_SLIDER.addEventListener("change", seek);
  AUDIOPLAYER_SLIDER.addEventListener("input", seek_notaudio);

  AUDIOPLAYER_PLAYBTN.addEventListener("click", () => {
    if (musicPlayer.paused) {
      musicPlayer.play();
    } else {
      musicPlayer.pause();
    }
  });

  musicPlayer.addEventListener("play", () => setPlayerState(true));
  musicPlayer.addEventListener("pause", () => setPlayerState(false));
  musicPlayer.addEventListener("ended", () => setPlayerState(false));
  musicPlayer.addEventListener("timeupdate", updatePlayerProgress);
  musicPlayer.addEventListener("loadedmetadata", updatePlayerProgress);

  setPlayerState(!musicPlayer.paused);
  updatePlayerProgress();
}

async function getMusic() {
  await API_MUSIC_GET("vjdyofficialmusic-2025");
  await API_MUSIC_GET("vjdyofficialmusic-2024");
  await API_MUSIC_GET("vjdyofficialmusic-2023");
  await API_MUSIC_GET("vjdyofficialmusic-2022");
}

getMusic();

function API_PLAYER_SCROLL() {
  const player = document.querySelector(".player");

  if (!player) return;

  const atBottom =
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - 2;

  player.classList.toggle("at-bottom", atBottom);
}

window.addEventListener("scroll", API_PLAYER_SCROLL, { passive: true });
window.addEventListener("resize", API_PLAYER_SCROLL);

API_PLAYER_SCROLL();

