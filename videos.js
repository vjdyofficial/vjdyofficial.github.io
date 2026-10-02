function API_SEARCH(query) {
  if (query === undefined) {
    query = document.getElementById("SEARCH_BOX")?.value ?? "";
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

const loadVideos = () => {
  const table = document.getElementById("tablex");

  if (!table) return;
  const tableBody = table.tBodies[0] || table.createTBody();

  const dialog = document.createElement("dialog");
  const closeButton = document.createElement("button");
  const videoPlayer = document.createElement("video");

  closeButton.type = "button";
  closeButton.className = "back-button";
  closeButton.style.marginBottom = "8px";
  closeButton.innerHTML = `
        <img src="./assets/icons/close.svg" class="tint" alt="Instagram" />
        <span>Close</span>
      `;
  closeButton.setAttribute("aria-label", "Close");
  closeButton.addEventListener("click", () => dialog.close());
  dialog.appendChild(closeButton);
  dialog.className = "videodialog";

  videoPlayer.controls = true;
  videoPlayer.preload = "metadata";

  dialog.append(closeButton, videoPlayer);
  document.body.append(dialog);

  const closeDialog = () => {
    videoPlayer.pause();
    videoPlayer.removeAttribute("src");
    videoPlayer.load();
    if (dialog.open) dialog.close();
  };

  closeButton.addEventListener("click", closeDialog);
  dialog.addEventListener("cancel", closeDialog);

  fetch("./videos.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch videos: ${response.status}`);
      }

      return response.json();
    })
    .then((videos) => {
      console.log("Loaded videos:", videos);

      if (!Array.isArray(videos)) {
        throw new Error("videos.json must contain an array");
      }

      tableBody.replaceChildren();

      videos.forEach((video) => {
        const row = tableBody.insertRow();

        const cell = row.insertCell();

        const icon = document.createElement("img");
        icon.src = "./assets/icons/movie.svg";
        icon.width = "18"
        icon.className = "tint";
        cell.append(icon);

        const span = document.createElement("span");

        [video.title, video.releasetag, video.date].forEach((value) => {
          const text = document.createElement("p");
          text.textContent = value ?? "";
          span.append(text);
        });

        cell.append(span);

        const openVideo = () => {
          if (!video.file) return;

          videoPlayer.src =
            "https://github.com/vjdyofficial/vjdyofficial/releases/download/" +
            String(video.releasetag) +
            "/" +
            String(video.file);

          if (!dialog.open) dialog.showModal();

          videoPlayer.play().catch((error) => {
            console.warn("Autoplay was blocked:", error);
          });
        };

        row.tabIndex = 0;

        row.addEventListener("click", openVideo);

        row.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openVideo();
          }
        });
      });
    })
    .catch((error) => {
      console.error("Unable to load videos:", error);
    });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadVideos, { once: true });
} else {
  loadVideos();
}
