const diseaseURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSAmHRbGtOBK4wW4vnaOkLmzEXa4ATK1GZML_FsF9s9JNn__ix2JhT2owEC94SEUWP4e9-zIK5_Gpk9/pub?gid=313167351&single=true&output=csv";
const drugURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSAmHRbGtOBK4wW4vnaOkLmzEXa4ATK1GZML_FsF9s9JNn__ix2JhT2owEC94SEUWP4e9-zIK5_Gpk9/pub?gid=0&single=true&output=csv";

let diseases = [], drugs = [], diseaseFuse, drugFuse;

Papa.parse(diseaseURL, {
  download: true,
  header: true,
  complete: res => {
    diseases = res.data;
    diseaseFuse = new Fuse(diseases, { keys: ["Disease Name"], threshold: 0.4 });
  }
});
Papa.parse(drugURL, {
  download: true,
  header: true,
  complete: res => {
    drugs = res.data;
    drugFuse = new Fuse(drugs, { keys: ["Generic Name", "Brand Name", "Indication"], threshold: 0.4 });
  }
});

const searchBar = document.getElementById("searchBar");
const loadingEl = document.getElementById("loading");
const resultsContainer = document.getElementById("resultsContainer");

searchBar.addEventListener("keypress", e => {
  if (e.key === "Enter") runSearch();
});

function runSearch() {
  const query = searchBar.value.trim().toLowerCase();
  resultsContainer.innerHTML = "";
  if (!query) return;
  loadingEl.innerHTML = '<div class="loader"></div>';

  setTimeout(() => {
    const diseaseResults = diseaseFuse.search(query);
    const drugResults = drugFuse.search(query);
    loadingEl.innerHTML = "";
    renderResults([...diseaseResults, ...drugResults]);
  }, 300);
}

function renderResults(results) {
  if (results.length === 0) {
    resultsContainer.innerHTML = "<p>No results found.</p>";
    return;
  }
  resultsContainer.innerHTML = "";
  results.forEach(r => {
    const card = document.createElement("div");
    card.className = "result-card";

    const title = document.createElement("h3");
    title.textContent = r.item["Disease Name"] || r.item["Generic Name"];
    title.className = "result-title";
    card.appendChild(title);

    const subContainer = document.createElement("div");
    subContainer.className = "sub-container collapsed";

    for (const key in r.item) {
      if (r.item[key] && key !== "Disease Name" && key !== "Generic Name") {
        const sub = document.createElement("div");
        sub.className = "subheading";
        sub.textContent = key;

        const content = document.createElement("div");
        content.className = "subcontent";
        content.textContent = r.item[key];

        sub.onclick = e => {
          e.stopPropagation();
          content.classList.toggle("visible");
          sub.classList.toggle("open");
        };

        subContainer.appendChild(sub);
        subContainer.appendChild(content);
      }
    }

    title.onclick = () => {
      if (subContainer.classList.contains("expanded")) {
        subContainer.classList.remove("expanded");
        subContainer.classList.add("collapsed");
        title.classList.remove("expanded");
      } else {
        subContainer.classList.remove("collapsed");
        subContainer.classList.add("expanded");
        title.classList.add("expanded");
      }
    };

    card.appendChild(subContainer);
    resultsContainer.appendChild(card);
  });
}

document.getElementById("micButton").onclick = () => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.onresult = e => {
    searchBar.value = e.results[0][0].transcript;
    searchBar.dispatchEvent(new Event("keypress", { key: "Enter" }));
  };
  recognition.start();
};
