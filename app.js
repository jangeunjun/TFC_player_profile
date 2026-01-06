let players = [];

fetch("https://raw.githubusercontent.com/jangeunjun/TFC_player_profile/main/players.json")
  .then(res => res.json())
  .then(data => players = data)
  .catch(err => console.error(err));

function showSuggestions() {
  const input = document.getElementById("search").value.toLowerCase().trim();
  const suggestions = document.getElementById("suggestions");
  
  if (!input) {
    suggestions.innerHTML = "";
    return;
  }
  
  // Find matches (partial, case-insensitive)
  const matches = players.filter(p => p.name.toLowerCase().includes(input));
  
  if (matches.length === 0) {
    suggestions.innerHTML = "<div style='padding: 5px;'>No matches</div>";
    return;
  }
  
  // Build suggestion list
  suggestions.innerHTML = matches.slice(0, 10).map(p => 
    `<div style="padding:5px; cursor:pointer;" onclick="selectSuggestion('${p.name.replace(/'/g, "\\'")}')">${p.name}</div>`
  ).join("");
}

function selectSuggestion(name) {
  document.getElementById("search").value = name;
  document.getElementById("suggestions").innerHTML = "";
  findPlayer();
}

function findPlayer() {
  const input = document.getElementById("search").value.toLowerCase().trim();
  const player = players.find(p => p.name.toLowerCase() === input);
  const result = document.getElementById("result");
  document.getElementById("suggestions").innerHTML = "";
  
  if (!player) {
    result.innerHTML = "<p>Player not found.</p>";
    return;
  }
  
  result.innerHTML = `
    <h3>${player.name}</h3>
    <img src="${player.photo}" alt="${player.name}" style="max-width: 200px;" />
    <p><strong>Number:</strong> ${player.number}</p>
    <p><strong>Motto:</strong> ${player.motto}</p>
    <p>${player.description}</p>
  `;
}
