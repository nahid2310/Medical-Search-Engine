const mode = new URLSearchParams(window.location.search).get('mode');
const pageTitle = document.getElementById("pageTitle");
pageTitle.textContent = mode === 'drug' ? "Search Drugs" : "Search Diseases";

const drugUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSAmHRbGtOBK4wW4vnaOkLmzEXa4ATK1GZML_FsF9s9JNn__ix2JhT2owEC94SEUWP4e9-zIK5_Gpk9/pub?gid=0&single=true&output=csv";
const diseaseUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSAmHRbGtOBK4wW4vnaOkLmzEXa4ATK1GZML_FsF9s9JNn__ix2JhT2owEC94SEUWP4e9-zIK5_Gpk9/pub?gid=313167351&single=true&output=csv";

const url = mode === 'drug' ? drugUrl : diseaseUrl;

document.getElementById("searchButton").addEventListener("click", searchData);
document.getElementById("searchBar").addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchData();
});

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

function showLoading() {
  document.getElementById("loading").innerHTML = '<div class="loader"></div>';
  document.getElementById("results").innerHTML = '';
}

function hideLoading() {
  document.getElementById("loading").innerHTML = '';
}

function searchData() {
  const searchTerm = document.getElementById("searchBar").value.trim().toLowerCase();
  if (!searchTerm) return;

  showLoading();

  Papa.parse(url, {
    download: true,
    header: true,
    complete: function(results) {
      hideLoading();
      const data = results.data;
      const matches = data.filter(row => {
        return Object.values(row).some(val => val && val.toLowerCase().includes(searchTerm));
      });
      displayResults(matches);
    }
  });
}

function displayResults(matches) {
  const container = document.getElementById("results");
  container.innerHTML = '';
  if (matches.length === 0) {
    container.innerHTML = '<p>No matches found.</p>';
    return;
  }

  matches.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";
    const titleField = mode === 'drug' ? 'Generic Name' : 'Disease Name';
    card.innerHTML = `<h2>${item[titleField] || 'Result'}</h2>`;
    Object.keys(item).forEach(key => {
      if (key !== titleField && item[key]) {
        const btn = document.createElement("button");
        btn.className = "dropdown-btn";
        btn.textContent = key;
        const content = document.createElement("div");
        content.className = "dropdown-content";
        content.textContent = item[key];

        btn.addEventListener('click', () => {
          if (content.classList.contains('active')) {
            content.classList.remove('active');
          } else {
            document.querySelectorAll('.dropdown-content.active').forEach(c => c.classList.remove('active'));
            content.classList.add('active');
          }
        });

        card.appendChild(btn);
        card.appendChild(content);
      }
    });
    container.appendChild(card);
  });
}
