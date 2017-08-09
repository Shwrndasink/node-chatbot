const APIAI_TOKEN = process.env.APIAI_TOKEN;
const APIAI_SESSION_ID = process.env.APIAI_SESSION_ID;

const apiai = require('apiai')('xxxxxxxxxxxxxxxxxxxxxxx');

const express = require('express');
const app = express();

app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));

const server = app.listen(5000, () => {
    console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});


const io = require('socket.io')(server);

app.get('/', (req, res) => {
    res.sendFile('index.html');
});

io.on('connection', function(socket) {
    socket.on('chat message', (text) => {

        let apiaiReq = apiai.textRequest(text, {
            sessionId: APIAI_SESSION_ID
        });

        apiaiReq.on('response', (response) => {
            let aiText = response.result.fullfillmnet.speech;
            socket.emit('bot reply', aiText);
        });

        apiaiReq.on('error', (error) => {
            console.log(error);
        });

        apiaiReq.end();
    });
});