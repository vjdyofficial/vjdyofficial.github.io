function API_SELECT_DIALOG(select) {
  if (select.disabled || document.querySelector("dialog[data-select-dialog]"))
    return;

  const dialog = document.createElement("dialog");
  dialog.dataset.selectDialog = "";
  dialog.setAttribute(
    "aria-label",
    select.getAttribute("aria-label") || select.name || "Choose an option",
  );

  const form = document.createElement("form");
  form.method = "dialog";
  const heading = document.createElement("h2");
  heading.textContent =
    select.getAttribute("aria-label") || select.name || "Choose an option";
  form.appendChild(heading);

  const options = Array.from(select.options);
  options.forEach((option, index) => {
    if (
      option.parentElement instanceof HTMLOptGroupElement &&
      option.parentElement.options[0] === option
    ) {
      const groupLabel = document.createElement("h3");
      groupLabel.textContent = option.parentElement.label;
      form.appendChild(groupLabel);
    }

    const label = document.createElement("label");
    label.style.cssText =
      "display:flex;gap:.6rem;align-items:center;padding:.4rem 0;";
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "select-option";
    radio.value = String(index);
    radio.checked = index === select.selectedIndex;
    radio.disabled = option.disabled;
    radio.addEventListener("change", () => {
      if (!radio.checked) return;
      select.selectedIndex = index;
      select.dispatchEvent(new Event("input", { bubbles: true }));
      select.dispatchEvent(new Event("change", { bubbles: true }));
      dialog.close();
    });
    label.append(radio, document.createTextNode(option.text));
    form.appendChild(label);
  });

  const close = document.createElement("button");
  close.type = "button";
  close.style.width = "100%";
  close.textContent = "Close";
  close.addEventListener("click", () => dialog.close());
  form.appendChild(close);
  dialog.appendChild(form);
  dialog.addEventListener("close", () => dialog.remove(), { once: true });
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    dialog.close();
  });
  document.body.appendChild(dialog);
  dialog.showModal();
}

document.querySelectorAll("select").forEach((select) => {
  const openDialog = (event) => {
    event.preventDefault();
    API_SELECT_DIALOG(select);
  };
  select.addEventListener("pointerdown", openDialog);
  select.addEventListener("click", openDialog);
  select.addEventListener("keydown", (event) => {
    if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(event.key)) {
      openDialog(event);
    }
  });
});

let alertSnackbar;
let alertSnackbarTimer;
window.alert = (message) => {
  if (!alertSnackbar) {
    alertSnackbar = document.createElement("div");
    alertSnackbar.setAttribute("role", "status");
    alertSnackbar.setAttribute("aria-live", "polite");
    alertSnackbar.className = "snackbar";
    document.body.appendChild(alertSnackbar);
  }

  alertSnackbar.textContent = String(message ?? "");
  alertSnackbar.style.opacity = "1";
  clearTimeout(alertSnackbarTimer);
  alertSnackbarTimer = setTimeout(() => {
    alertSnackbar.style.opacity = "0";
  }, 3500);
};

document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
});

const highlightCursor = document.createElement("div");
highlightCursor.setAttribute("aria-hidden", "true");
highlightCursor.className = "cursor";
document.body.appendChild(highlightCursor);

document.addEventListener("pointermove", (event) => {
  highlightCursor.style.left = `${event.clientX}px`;
  highlightCursor.style.top = `${event.clientY}px`;
  highlightCursor.style.opacity = event.pointerType === "touch" ? "0" : "1";
});
document.addEventListener("pointerleave", () => {
  highlightCursor.style.opacity = "0";
});

