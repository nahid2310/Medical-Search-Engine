// Updated script.js for search.html logic only (design untouched)

const searchButton = document.getElementById("searchButton");
const searchBar = document.getElementById("searchBar");
const loadingEl = document.getElementById("loading");
const resultsEl = document.getElementById("results");
const mode = new URLSearchParams(window.location.search).get("mode") || "drug";
const subtitleEl = document.getElementById("subtitle");
subtitleEl.textContent = mode === "drug" ? "Search for Drugs" : "Search for Diseases";

const drugUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSAmHRbGtOBK4wW4vnaOkLmzEXa4ATK1GZML_FsF9s9JNn__ix2JhT2owEC94SEUWP4e9-zIK5_Gpk9/pub?gid=0&single=true&output=csv";
const diseaseUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSAmHRbGtOBK4wW4vnaOkLmzEXa4ATK1GZML_FsF9s9JNn__ix2JhT2owEC94SEUWP4e9-zIK5_Gpk9/pub?gid=313167351&single=true&output=csv";
const url = mode === "drug" ? drugUrl : diseaseUrl;

const aliasMap = {
  "high blood pressure": "Hypertension",
  "high blood sugar": "Diabetes"
};

searchButton.addEventListener("click", searchData);
searchBar.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchData();
});

function showLoading() {
  loadingEl.innerHTML = '<div class="loader"></div>';
  resultsEl.innerHTML = '';
}

function hideLoading() {
  loadingEl.innerHTML = '';
}

function searchData() {
  const rawSearchTerm = searchBar.value.trim().toLowerCase();
  const searchTerm = aliasMap[rawSearchTerm] || rawSearchTerm;
  if (!searchTerm) return;

  showLoading();

  Papa.parse(url, {
    download: true,
    header: true,
    complete: function (results) {
      hideLoading();

      const data = results.data;
      const matches = data.filter(row => {
        if (mode === "drug") {
          return (
            (row["Generic Name"] && row["Generic Name"].toLowerCase().includes(searchTerm)) ||
            (row["Brand Name"] && row["Brand Name"].toLowerCase().includes(searchTerm)) ||
            (row["Indication"] && row["Indication"].toLowerCase().includes(searchTerm))
          );
        } else {
          return row["Disease Name"] && row["Disease Name"].toLowerCase().includes(searchTerm);
        }
      });

      displayResults(matches);
    },
    error: function () {
      hideLoading();
      resultsEl.innerHTML = '<p style="color:red;">Failed to load data.</p>';
    }
  });
}

function displayResults(matches) {
  resultsEl.innerHTML = '';
  if (matches.length === 0) {
    resultsEl.innerHTML = '<p>No matches found.</p>';
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
          content.classList.toggle('active');
        });

        card.appendChild(btn);
        card.appendChild(content);
      }
    });
    resultsEl.appendChild(card);
  });
}

// Dark mode toggle
const darkModeToggle = document.getElementById("darkModeToggle");
darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});
