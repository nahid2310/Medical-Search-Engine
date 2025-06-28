// sidebar.js
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const indexToggle = document.getElementById('indexToggle');
const indexSubmenu = document.getElementById('indexSubmenu');

// Toggle sidebar open/close
hamburger.addEventListener('click', () => {
  const isOpen = sidebar.style.width === '250px';
  if (isOpen) {
    sidebar.style.width = '0';
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = 'auto';
  } else {
    sidebar.style.width = '250px';
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
});

// Close sidebar when clicking outside of it
document.addEventListener('click', (event) => {
  if (
    sidebar.style.width === '250px' &&
    !sidebar.contains(event.target) &&
    !hamburger.contains(event.target)
  ) {
    sidebar.style.width = '0';
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = 'auto';
  }
});

// Toggle submenu under "Index"
indexToggle.addEventListener('click', (event) => {
  event.preventDefault();
  const isOpen = indexSubmenu.classList.toggle('open');
  indexToggle.setAttribute('aria-expanded', isOpen);
  indexSubmenu.setAttribute('aria-hidden', !isOpen);
});

// Optional: Dark mode toggle support if not already in the page
if (!document.getElementById('darkModeToggle')) {
  const toggle = document.createElement('button');
  toggle.id = 'darkModeToggle';
  toggle.innerHTML = '&#9790;';
  toggle.title = 'Toggle Dark Mode';
  toggle.setAttribute('aria-label', 'Toggle Dark Mode');
  toggle.style.position = 'fixed';
  toggle.style.top = '15px';
  toggle.style.right = '15px';
  toggle.style.zIndex = '1200';
  document.body.appendChild(toggle);

  toggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  });
}
