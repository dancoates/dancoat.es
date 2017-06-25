import WebSocket from 'ws';


const wss = new WebSocket.Server({
    host: process.env.WS_HOST || 'localhost',
    port: process.env.WS_PORT || 7777,
    verifyClient: ({req, secure}, callback) => {
        const reqUrl = url.parse(req.url, true);
        const token = reqUrl.query.token;

        verify(token)
            .then(() => callback(true))
            .catch(() => callback(false));

    }
});


wss.on('connection', async function connection(ws) {
    const reqUrl = url.parse(ws.upgradeReq.url, true);
    const token = reqUrl.query.token;
    const clientId = uuid();

    const sessionData = await verify(token);
    sessions[sessionData.userId] = sessions[sessionData.userId] || createSession(token, sessionData);
    // Add client
    sessions[sessionData.userId].clients.push(ws);

    ws.on('message', function incoming(message) {
        const data = JSON.parse(message);
        if(data.type !== 'action') return;

        // Dispatch action
        sessions[sessionData.userId].store.dispatch(data.payload);

        // Broadcast action to all other clients
        sessions[sessionData.userId].clients.forEach(client => {
            if(client === ws) return;

            client.send({
                type: 'action',
                payload: {
                    ...data.payload,
                    secondary: true // So that clients don't redispatch
                }
            });
        });
    });

    ws.on('close', function incoming(message) {
        sessions[sessionData.userId] = {
            ...sessions[sessionData.userId],
            clients: sessions[sessionData.userId].clients.filter(client => client !== ws)
        };
    });

});


export default wss;