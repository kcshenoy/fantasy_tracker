// const express = require('express');
// const app = express();
// const port = 3000;

// // Route to serve the homepage
// // app.get('/', (req, res) => {
// //   res.send('Hello, world!');
// // });

document.addEventListener("DOMContentLoaded", function () {
    const playerNameInput = document.getElementById("playerName");
    const addPlayerButton = document.getElementById("addPlayerButton");
    const teamList = document.getElementById("teamList");
    const activePlayersList = document.getElementById("activePlayersList");
  
    let activePlayers = []; // To store the list of active players
    // Load current players from the backend when the page loads

    fetchPlayers();
  
    // Add player on button click
    addPlayerButton.addEventListener("click", async () => {
      const playerName = playerNameInput.value;
      if (playerName) {
        // Make a request to add the player
        const response = await fetch('/add_player', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: playerName }),
        });
  
        if (response.ok) {
          fetchPlayers(); // Re-fetch the updated player list
        }
      }
    });

    // Fetch and display the active players for search
    async function fetchActivePlayers() {
      const response = await fetch('/get_active_players');
      const players = await response.json();
      activePlayers = players.map(player => player.name); // Save player names

      // Populate the datalist with active players
      updateActivePlayersList(activePlayers);
  }

  // Update the datalist with active players
  function updateActivePlayersList(players) {
      activePlayersList.innerHTML = ""; // Clear current options

      players.sort().forEach(player => {
          const option = document.createElement("option");
          option.value = player;
          activePlayersList.appendChild(option);
      });
  }
  
    // Delete player from the list
    async function deletePlayer(playerName) {
      const response = await fetch(`/delete_player/${playerName}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        // body: JSON.stringify({ name: playerName }),
      });
  
      if (response.ok) {
        fetchPlayers(); // Re-fetch the updated player list
      }
    }
  
    // Fetch and display the players
    async function fetchPlayers() {
      const response = await fetch('/get_team');
      const players = await response.json();
  
      teamList.innerHTML = ""; // Clear current list
      players.forEach(player => {
        const li = document.createElement("li");
        li.textContent = player.name;
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => deletePlayer(player.name));
  
        li.appendChild(deleteButton);
        teamList.appendChild(li);
      });
    }
  });
  

// // Start the server
// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });