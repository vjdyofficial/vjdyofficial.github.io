async function API_STORE_GET() {
  function createPreviewDialog(imageSrc, item, category) {
    const dialog = document.createElement("dialog");
    dialog.classList.add("store-preview-dialog");

    const previewContainer = document.createElement("div");
    previewContainer.classList.add("store-preview-container");

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.classList.add("back-button", "store-preview-close");
    closeButton.innerHTML = `
      <img src="./assets/icons/close.svg" class="tint" alt="Close" />
      <span>Close</span>
    `;
    closeButton.setAttribute("aria-label", "Close");
    closeButton.addEventListener("click", () => dialog.close());

    const preview = document.createElement("img");
    preview.src = imageSrc;
    preview.alt = item.title || "Asset preview";
    preview.classList.add("store_image", "store-preview-image");
    previewContainer.appendChild(preview);

    const info = document.createElement("div");
    info.classList.add("store-preview-info");

    const cat = document.createElement("h3");
    cat.classList.add("store-preview-cat");
    cat.title = category;
    cat.textContent = category;
    info.appendChild(cat);

    const title = document.createElement("h2");
    title.classList.add("store-preview-title");
    title.innerHTML = item.title || "";
    info.appendChild(title);

    const description = document.createElement("p");
    description.classList.add("store-preview-description");
    description.textContent = item.description || "";
    info.appendChild(description);

    previewContainer.append(closeButton, info);
    dialog.appendChild(previewContainer);

    const downloadButton = document.createElement("a");
    downloadButton.classList.add("back-button", "store-preview-download");
    downloadButton.textContent = "Download asset";
    downloadButton.href =
      item.downloadUrl || item.download || item.url || item.link || imageSrc;
    downloadButton.target = "_blank";
    downloadButton.rel = "noopener noreferrer";
    info.appendChild(downloadButton);

    document.body.appendChild(dialog);
    dialog.addEventListener("close", () => dialog.remove(), { once: true });
    dialog.showModal();
  }

  const categories = await fetch("./store.json").then((res) => res.json());
  const parent = document.getElementById("store_parent");

  categories.forEach((category) => {
    const section = document.createElement("section");
    const heading = document.createElement("h1");
    heading.textContent = category.category;
    section.appendChild(heading);

    const itemContainer = document.createElement("div");
    itemContainer.className = "ASSETSTORE_ITEM";

    category.items.forEach((item) => {
      const moment = document.createElement("div");
      moment.className = "store_main";
      moment.addEventListener("click", () => {
        createPreviewDialog(image.src, item, heading.textContent);
      });

      const image = document.createElement("img");
      image.src = "./api/store/" + item.image;
      image.className = "store_image";
      moment.appendChild(image);

      const info = document.createElement("div");
      info.className = "store_info";

      const title = document.createElement("h2");
      title.title = item.title;
      title.textContent = item.title;
      info.appendChild(title);

      const description = document.createElement("small");
      description.textContent = item.description;
      description.title = item.description;
      info.appendChild(description);

      moment.appendChild(info);
      itemContainer.appendChild(moment);
    });

    section.appendChild(itemContainer);
    parent.appendChild(section);
  });
}

API_STORE_GET();
