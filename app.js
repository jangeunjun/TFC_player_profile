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
  const player = window.players.find(p => p.name.toLowerCase() === input);
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
    <p><strong>Balance:</strong> ${player.balance}</p>
    <p><strong>Status:</strong> ${player.status}</p>
    <p><strong>Uniform:</strong> ${player.uniformName}</p>
    <p><strong>Size:</strong> ${player.size}</p>
    <p>${player.description}</p>
  `;
}






async function fetchSheetCSVByIndex() {
  const url = "https://docs.google.com/spreadsheets/d/18X7f2ebaXdb3CCpftiaSZJn-1BMZfNvypzV4k30zMnY/export?format=csv&gid=0";
  const res = await fetch(url);
  const text = await res.text();
  const lines = text.trim().split("\n");

  // Skip the first row if it’s header, or you can just parse all rows if header unreliable
  // If you want to skip header, start at i=1
  const dataRows = lines.slice(1); 

  const players = dataRows.map(line => {
    const cols = line.split(",");
    // Defensive: ignore rows where Name (col 0) is empty or missing
    if (!cols[1] || cols[1].trim() === "") return null;

    return {
      name: cols[1]?.trim() ?? "",
      balance: cols[2]?.trim() ?? "",
      status: cols[3]?.trim() ?? "",
      uniformName: cols[4]?.trim() ?? "",
      size: cols[5]?.trim() ?? "",
      number: cols[6]?.trim() ?? ""
    };
  }).filter(p => p !== null); // Remove null rows

  return players;
}


async function fetchLocalJSON() {
  const res = await fetch("https://raw.githubusercontent.com/jangeunjun/TFC_player_profile/main/players.json");
  const data = await res.json();
  return data;
}

async function loadAndMergePlayers() {
  try {
    const [sheetData, localData] = await Promise.all([fetchSheetCSVByIndex(), fetchLocalJSON()]);

    window.players = localData.map(localPlayer => {
      const match = sheetData.find(sheetPlayer =>
        sheetPlayer.name.toLowerCase() === localPlayer.name.toLowerCase()
      );

      return {
        ...localPlayer,
        balance: match?.balance ?? "",
        status: match?.status ?? "",
        uniformName: match?.uniformName ?? "",
        size: match?.size ?? "",
        number: match?.number ?? localPlayer.number ?? ""
      };
    });

    initAutocomplete();

  } catch (err) {
    console.error("Error loading or merging player data:", err);
  }
}


// Call the merge loader on page load or script start
loadAndMergePlayers();


