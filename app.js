let players = [];

fetch("players.json")
  .then(res => res.json())
  .then(data => players = data);

function findPlayer() {
  const name = document.getElementById("search").value.toLowerCase();
  const player = players.find(p => p.name.toLowerCase() === name);

  const result = document.getElementById("result");

  if (!player) {
    result.innerHTML = "<p>Player not found.</p>";
    return;
  }

  result.innerHTML = `
    <h3>${player.name}</h3>
    <img src="${player.photo}">
    <p><strong>Position:</strong> ${player.position}</p>
    <p>${player.description}</p>
  `;
}
