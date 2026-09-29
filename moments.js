async function API_MOMENT_GET() {
  const items = await fetch("./moments.json").then((res) => res.json());
  const parent = document.getElementById("moments_parent");

  items.forEach((item) => {
    const moment = document.createElement("div");
    moment.className = "moments_main";
    moment.addEventListener("click", () => {
      const dialog = document.createElement("dialog");
      const closeButton = document.createElement("button");
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

      const content = moment.cloneNode(true);
      content.addEventListener("click", (event) => event.stopPropagation());
      dialog.appendChild(content);
      document.body.appendChild(dialog);

      dialog.addEventListener("close", () => dialog.remove(), { once: true });
      dialog.showModal();
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