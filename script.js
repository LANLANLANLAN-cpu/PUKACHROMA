const menuToggle = document.getElementById("menuToggle");
const menuPanel = document.getElementById("menuPanel");
const filterToggle = document.getElementById("filterToggle");
const filterMenu = document.getElementById("filterMenu");

if (menuToggle && menuPanel) {
  menuToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    menuPanel.classList.toggle("show");

    if (filterMenu) {
      filterMenu.classList.remove("show");
    }
  });
}

if (filterToggle && filterMenu) {
  filterToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    filterMenu.classList.toggle("show");

    if (menuPanel) {
      menuPanel.classList.remove("show");
    }
  });
}

document.addEventListener("click", (event) => {
  if (menuPanel && menuToggle) {
    if (!menuPanel.contains(event.target) && !menuToggle.contains(event.target)) {
      menuPanel.classList.remove("show");
    }
  }

  if (filterMenu && filterToggle) {
    if (!filterMenu.contains(event.target) && !filterToggle.contains(event.target)) {
      filterMenu.classList.remove("show");
    }
  }
});
