function createPreviewDialog(imageSrc, item) {
  const dialog = document.createElement("dialog");
  dialog.classList.add("moment-preview-dialog");
  dialog.style.setProperty("--moment-preview-bg", `url(${imageSrc})`);

  const previewContainer = document.createElement("div");
  previewContainer.classList.add("moment-preview-container");

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.classList.add("back-button", "moment-preview-close");
  closeButton.innerHTML = `
      <img src="./assets/icons/close.svg" class="tint" alt="Close" />
      <span>Close</span>
    `;
  closeButton.setAttribute("aria-label", "Close");
  closeButton.addEventListener("click", () => dialog.close());

  const preview = document.createElement("img");
  preview.src = imageSrc;
  preview.alt = item.title || "Asset preview";
  preview.classList.add("moment_image", "moment-preview-image");
  previewContainer.appendChild(preview);

  const info = document.createElement("div");
  info.classList.add("moment-preview-info");

  const title = document.createElement("h2");
  title.classList.add("moment-preview-title");
  title.textContent = item.title || "";
  info.appendChild(title);

  const description = document.createElement("p");
  description.classList.add("moment-preview-description");
  description.innerHTML = item.description || "";
  info.appendChild(description);

  previewContainer.append(closeButton, info);
  dialog.appendChild(previewContainer);

  const downloadButton = document.createElement("a");
  downloadButton.classList.add("back-button", "moment-preview-download");
  downloadButton.textContent = (item.instagram) ? "View in Instagram" : "View in new tab";
  downloadButton.href = item.instagram || imageSrc;
  downloadButton.target = "_blank";
  downloadButton.rel = "noopener noreferrer";
  info.appendChild(downloadButton);

  document.body.appendChild(dialog);
  dialog.addEventListener("close", () => dialog.remove(), { once: true });
  dialog.showModal();
}

async function API_MOMENT_GET() {
  const items = await fetch("./moments.json").then((res) => res.json());
  const parent = document.getElementById("moments_parent");

  items.forEach((item) => {
    const moment = document.createElement("div");
    moment.className = "moments_main";
    moment.addEventListener("click", () => {
      createPreviewDialog("../api/moments/" + item.image, item);
    });

    const image = document.createElement("img");
    image.src = "./api/moments/" + item.image;
    image.className = "moments_image";
    moment.appendChild(image);

    const info = document.createElement("div");
    info.className = "moments_info";

    const title = document.createElement("h2");
    title.id = "moments_title";
    title.title = item.title;
    title.textContent = item.title;
    info.appendChild(title);

    const description = document.createElement("small");
    description.id = "moments_desc";
    description.innerHTML = item.description;
    description.title = item.description;
    info.appendChild(description);

    moment.appendChild(info);
    parent.appendChild(moment);
  });
}

API_MOMENT_GET();
