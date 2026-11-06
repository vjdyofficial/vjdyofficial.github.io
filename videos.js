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
  const parent = document.getElementById("tablex_video");

  if (!parent) return;

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

      parent.replaceChildren();

      videos.forEach((video) => {
        const moment = document.createElement("div");
        moment.className = "moments_main";

        const icon = document.createElement("img");
        icon.src = video.image ?? "./assets/icons/movie.svg";
        icon.className = "moments_image";
        icon.setAttribute("data-type", "video");
        icon.width = 18;
        icon.alt = "";
        moment.appendChild(icon);

        const info = document.createElement("div");
        info.className = "moments_info";

        const title = document.createElement("h3");
        title.id = "moments_title";
        title.title = video.title ?? "";
        title.textContent = video.title ?? "";
        
        info.appendChild(title);

        const description = document.createElement("small");
        description.id = "moments_desc";
        description.title = [video.releasetag, video.date]
          .filter(Boolean)
          .join(" • ");
        description.innerHTML = [video.releasetag, video.date]
          .filter(Boolean)
          .join(" • ");
        info.appendChild(description);

        moment.appendChild(info);

        const actions = document.createElement("div");
        actions.className = "moments_actions";

        /*
         * GitHub Release video URL
         */
        const videoURL =
          "https://github.com/vjdyofficial/vjdyofficial/releases/download/" +
          encodeURIComponent(String(video.releasetag)) +
          "/" +
          encodeURIComponent(String(video.file));

        const streamURL = video.stream;

        if (streamURL) {
          const streamButton = document.createElement("a");
          streamButton.className = "back-button";
          streamButton.href = streamURL;
          streamButton.target = "_blank";
          streamButton.rel = "noopener noreferrer";
          streamButton.title = "Stream Video";
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

          actions.appendChild(streamButton);
        }

        moment.appendChild(actions);
        parent.appendChild(moment);
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
