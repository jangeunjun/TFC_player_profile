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






async function fetchSheetCSV() {
  const url = "https://docs.google.com/spreadsheets/d/18X7f2ebaXdb3CCpftiaSZJn-1BMZfNvypzV4k30zMnY/export?format=csv&gid=0";
  const res = await fetch(url);
  const text = await res.text();
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",");

  // Indices of the columns we want
  const wantedColumns = ["Name", "Balance", "Status", "Uniform name", "Size", "No"];
  const indexes = wantedColumns.map(col => headers.indexOf(col));

  const rows = lines.slice(1).map(line => {
    const values = line.split(",");
    let obj = {};
    wantedColumns.forEach((col, i) => {
      const idx = indexes[i];
      obj[col] = idx !== -1 ? (values[idx]?.trim() ?? "") : "";
    });
    return obj;
  });

  return rows;
}

async function fetchLocalJSON() {
  const res = await fetch("https://raw.githubusercontent.com/jangeunjun/TFC_player_profile/main/players.json");
  const data = await res.json();
  return data;
}

async function loadAndMergePlayers() {
  try {
    const [sheetData, localData] = await Promise.all([fetchSheetCSV(), fetchLocalJSON()]);

    // Merge by name (case-insensitive)
    window.players = localData.map(localPlayer => {
      const match = sheetData.find(sheetPlayer =>
        sheetPlayer["Name"].toLowerCase() === localPlayer.name.toLowerCase()
      );

      // Merge sheet columns into local player object (if match found)
      return {
        ...localPlayer,
        balance: match?.Balance ?? "",
        status: match?.Status ?? "",
        uniformName: match?.["Uniform name"] ?? "",
        size: match?.Size ?? "",
        number: match?.No ?? localPlayer.number ?? ""
      };
    });

    console.log("Merged players data:", window.players);

    // You can call your autocomplete/init function here if needed
    // e.g. initAutocomplete();

  } catch (err) {
    console.error("Error loading or merging player data:", err);
  }
}

// Call the merge loader on page load or script start
loadAndMergePlayers();

