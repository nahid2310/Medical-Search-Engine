const hamburger = document.getElementById("hamburger");
const sidebar = document.getElementById("sidebar");
const indexToggle = document.getElementById("indexToggle");
const indexSubmenu = document.getElementById("indexSubmenu");
const aboutLink = document.getElementById("aboutLink");
const contactLink = document.getElementById("contactLink");
const darkModeToggle = document.getElementById("darkModeToggle");

hamburger.onclick = () => {
  sidebar.style.width = sidebar.style.width === "250px" ? "0" : "250px";
  document.body.style.overflow = sidebar.style.width === "250px" ? "hidden" : "auto";
};

document.addEventListener("click", e => {
  if (sidebar.style.width === "250px" && !sidebar.contains(e.target) && !hamburger.contains(e.target)) {
    sidebar.style.width = "0";
    document.body.style.overflow = "auto";
  }
});

indexToggle.onclick = e => {
  e.preventDefault();
  indexSubmenu.classList.toggle("open");
};

aboutLink.onclick = e => {
  e.preventDefault();
  openModal("About Limitless", "Limitless is a knowledge platform for drugs and diseases, designed to assist students and professionals.");
};

contactLink.onclick = e => {
  e.preventDefault();
  openModal("Contact Us", "Email: contact@limitless.com<br>Phone: +91-12345-67890");
};

darkModeToggle.onclick = () => {
  document.body.classList.toggle("dark-mode");
};

function openModal(title, content) {
  const modal = document.getElementById("infoModal");
  const body = document.getElementById("modalBody");
  const close = document.getElementById("modalClose");
  body.innerHTML = `<h2>${title}</h2><p>${content}</p>`;
  modal.style.display = "block";
  close.onclick = () => modal.style.display = "none";
  window.onclick = e => { if (e.target === modal) modal.style.display = "none"; };
}
const interactionLink = document.getElementById("interactionLink");

interactionLink.onclick = e => {
  e.preventDefault();
  window.location.href = "Drug interaction checker/index.html"; // Adjust path as needed
};
