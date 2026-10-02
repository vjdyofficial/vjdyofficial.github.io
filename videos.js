function API_SEARCH(query) {
  if (query === undefined) {
    query = document.getElementById("SEARCH_BOX")?.value ?? "";
  }

  const table = document.getElementById("tablex");
  const body = table?.tBodies[0];
  if (!body) return;

  const search = String(query ?? "")
    .trim()
    .toLocaleLowerCase();
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

        // Movie icon
        const icon = document.createElement("img");

        icon.src = "./assets/icons/movie.svg";
        icon.width = 18;
        icon.className = "tint";
        icon.alt = "";

        cell.append(icon);

        // Video information
        const span = document.createElement("span");

        [video.title, video.releasetag, video.date].forEach((value) => {
          const text = document.createElement("p");

          text.textContent = value ?? "";

          span.append(text);
        });

        cell.append(span);

        /*
         * GitHub Release video URL
         */
        const videoURL =
          "https://github.com/vjdyofficial/vjdyofficial/releases/download/" +
          encodeURIComponent(String(video.releasetag)) +
          "/" +
          encodeURIComponent(String(video.file));

        /*
         * STREAM button
         */
        const streamButton = document.createElement("a");

        streamButton.className = "back-button";

        streamButton.href = "./player.html?src=" + encodeURIComponent(videoURL);

        streamButton.target = "_blank";

        streamButton.rel = "noopener noreferrer";

        streamButton.innerHTML = `
          <img
            src="./assets/icons/play_arrow.svg"
            class="tint"
            alt=""
          />
          <span>Stream</span>
        `;

        streamButton.setAttribute(
          "aria-label",
          `Stream ${video.title ?? "video"}`,
        );

        cell.append(streamButton);

        /*
         * DOWNLOAD button
         */
        const downloadButton = document.createElement("a");

        downloadButton.className = "back-button";

        downloadButton.href = videoURL;

        downloadButton.target = "_blank";

        downloadButton.rel = "noopener noreferrer";

        downloadButton.innerHTML = `
          <img
            src="./assets/icons/download.svg"
            class="tint"
            alt=""
          />
          <span>Download</span>
        `;

        downloadButton.setAttribute(
          "aria-label",
          `Download ${video.title ?? "video"}`,
        );

        cell.append(downloadButton);
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
