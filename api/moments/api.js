async function API_MOMENT_GET() {
  const items = await fetch("./api/moments/data.json").then((res) => res.json());
  const parent = document.getElementById("moments_parent");

  items.forEach((item) => {
    const moment = document.createElement("div");
    moment.className = "moments_main";

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
    description.textContent = item.description;
    description.title = item.description;
    info.appendChild(description);

    moment.appendChild(info);
    parent.appendChild(moment);
  });
}

API_MOMENT_GET();