let interactions = [];

fetch('interactions.json')
  .then(res => res.json())
  .then(data => interactions = data)
  .catch(err => console.error('Failed to load JSON:', err));

function checkInteraction() {
  const drug1 = document.getElementById('drug1').value.trim().toLowerCase();
  const drug2 = document.getElementById('drug2').value.trim().toLowerCase();

  const result = interactions.find(entry =>
    (entry.drugA.toLowerCase() === drug1 && entry.drugB.toLowerCase() === drug2) ||
    (entry.drugA.toLowerCase() === drug2 && entry.drugB.toLowerCase() === drug1)
  );

  const resultBox = document.getElementById('resultBox');
  const noResult = document.getElementById('noResult');

  if (result) {
    document.getElementById('severity').innerHTML = `<strong>Severity:</strong> ${result.severity}`;
    document.getElementById('mechanism').innerHTML = `<strong>Mechanism:</strong> ${result.mechanism}`;
    document.getElementById('note').innerHTML = `<strong>Clinical Note:</strong> ${result.clinical_note}`;
    resultBox.classList.remove('hidden');
    noResult.classList.add('hidden');
  } else {
    resultBox.classList.add('hidden');
    noResult.classList.remove('hidden');
  }
}
