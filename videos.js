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
        icon.width = 18;
        icon.className = "tint";
        icon.alt = "";

        cell.append(icon);

        const span = document.createElement("span");

        [video.title, video.releasetag, video.date].forEach((value) => {
          const text = document.createElement("p");
          text.textContent = value ?? "";
          span.append(text);
        });

        cell.append(span);

        const downloadButton = document.createElement("a");

        downloadButton.className = "back-button";
        downloadButton.href =
          "https://github.com/vjdyofficial/vjdyofficial/releases/download/" +
          encodeURIComponent(String(video.releasetag)) +
          "/" +
          encodeURIComponent(String(video.file));

        downloadButton.target = "_blank";
        downloadButton.rel = "noopener noreferrer";
        downloadButton.innerHTML = `
          <img src="./assets/icons/download.svg" class="tint" alt="" />
          <span>Download</span>
        `;

        downloadButton.setAttribute(
          "aria-label",
          `Download ${video.title ?? "video"}`
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
