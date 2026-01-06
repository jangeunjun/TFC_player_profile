let players = [];

fetch("https://raw.githubusercontent.com/jangeunjun/TFC_player_profile/main/players.json")
  .then(res => {
    if (!res.ok) throw new Error("Network response not OK");
    return res.json();
  })
  .then(data => {
    players = data;
  })
  .catch(err => {
    console.error("Failed to load players.json:", err);
  });

function findPlayer() {
  const input = document.getElementById("search").value.toLowerCase().trim();
  const player = players.find(p => p.name.toLowerCase().includes(input));
  const result = document.getElementById("result");

  if (!player) {
    result.innerHTML = "<p>Player not found.</p>";
    return;
  }

  result.innerHTML = `
    <h3>${player.name}</h3>
    <img src="${player.photo}" alt="${player.name}">
    <p><strong>Number:</strong> ${player.number}</p>
    <p><strong>Motto:</strong> ${player.motto}</p>
    <p>${player.description}</p>
  `;
}
