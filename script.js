const menuToggle = document.getElementById("menuToggle");
const menuPanel = document.getElementById("menuPanel");
const filterToggle = document.getElementById("filterToggle");
const filterMenu = document.getElementById("filterMenu");

const menuMainButtons = document.querySelectorAll(".menu-main[data-target]");
const subPanels = document.querySelectorAll(".menu-subpanel");

if (menuToggle && menuPanel) {
  menuToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    menuPanel.classList.toggle("show");

    if (!menuPanel.classList.contains("show")) {
      subPanels.forEach((panel) => panel.classList.remove("show"));
    }

    if (filterMenu) {
      filterMenu.classList.remove("show");
    }
  });
}

menuMainButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();

    const targetId = button.getAttribute("data-target");
    const targetPanel = document.getElementById(targetId);

    subPanels.forEach((panel) => {
      if (panel !== targetPanel) {
        panel.classList.remove("show");
      }
    });

    if (targetPanel) {
      targetPanel.classList.toggle("show");
    }
  });
});

if (filterToggle && filterMenu) {
  filterToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    filterMenu.classList.toggle("show");

    if (menuPanel) {
      menuPanel.classList.remove("show");
    }

    subPanels.forEach((panel) => panel.classList.remove("show"));
  });
}

document.addEventListener("click", (event) => {
  if (menuPanel && menuToggle) {
    if (!menuPanel.contains(event.target) && !menuToggle.contains(event.target)) {
      menuPanel.classList.remove("show");
      subPanels.forEach((panel) => panel.classList.remove("show"));
    }
  }

  if (filterMenu && filterToggle) {
    if (!filterMenu.contains(event.target) && !filterToggle.contains(event.target)) {
      filterMenu.classList.remove("show");
    }
  }
});
