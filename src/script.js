const socket = new WebSocket('wss://your-vercel-deployment-url.com');

socket.onopen = () => {
  console.log('Conectado al servidor WebSocket');
};

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // Aquí se maneja la lógica para mostrar la comparación de tiempos
  displayChart(data.redTeamAvg, data.blueTeamAvg);
  differenceElement.textContent = `Diferencia de tiempos: ${data.difference} segundos`;
};

socket.onerror = (error) => {
  console.error('WebSocket error:', error);
};

socket.onclose = () => {
  console.log('WebSocket cerrado');
};

// Lógica para unirse a una sesión
document.getElementById('joinSessionButton').addEventListener('click', () => {
  const sessionId = document.getElementById('sessionId').value;
  socket.send(JSON.stringify({ action: 'joinSession', sessionId }));
});

// Lógica del juego y envío de tiempos al servidor
circleButton.addEventListener('click', () => {
  const time = (new Date().getTime() - startTime) / 1000;
  socket.send(JSON.stringify({ action: 'saveTime', team: selectedTeam, time }));
});