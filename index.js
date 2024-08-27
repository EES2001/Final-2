const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });

let sessions = {};

server.on('connection', (socket) => {
    console.log('Nueva conexión establecida.');

    socket.on('message', (message) => {
        const data = JSON.parse(message);

        if (data.action === 'joinSession') {
            const sessionId = data.sessionId;
            if (!sessions[sessionId]) {
                sessions[sessionId] = { redTeam: [], blueTeam: [] };
            }
            socket.sessionId = sessionId;
            console.log(`Usuario unido a la sesión: ${sessionId}`);
        }

        if (data.action === 'saveTime') {
            const { team, time } = data;
            if (sessions[socket.sessionId]) {
                sessions[socket.sessionId][team].push(time);
                
                const redTeamAvg = average(sessions[socket.sessionId].redTeam);
                const blueTeamAvg = average(sessions[socket.sessionId].blueTeam);

                const difference = Math.abs(redTeamAvg - blueTeamAvg);

                const response = {
                    redTeamAvg,
                    blueTeamAvg,
                    difference,
                };

                // Enviar los resultados a todos los usuarios de la sesión
                server.clients.forEach(client => {
                    if (client.sessionId === socket.sessionId && client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(response));
                    }
                });

                console.log(`Resultados enviados a la sesión: ${socket.sessionId}`);
            }
        }
    });

    socket.on('close', () => {
        console.log('Conexión cerrada.');
    });
});

function average(times) {
    if (times.length === 0) return 0;
    return times.reduce((a, b) => a + b, 0) / times.length;
}

console.log('Servidor WebSocket ejecutándose en ws://localhost:8080');
