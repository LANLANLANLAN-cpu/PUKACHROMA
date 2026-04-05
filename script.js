const menuToggle = document.getElementById("menuToggle");
const menuPanel = document.getElementById("menuPanel");

if (menuToggle && menuPanel) {
  menuToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    menuPanel.classList.toggle("show");
  });

  document.addEventListener("click", (event) => {
    if (!menuPanel.contains(event.target) && !menuToggle.contains(event.target)) {
      menuPanel.classList.remove("show");
    }
  });
}
