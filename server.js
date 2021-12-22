require('dotenv').config();
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const db = require('./app/config/db');
const routes = require('./routes');
const cors = require('cors');
const socketSever = require('./socketSever');
const port = process.env.PORT || 5000;
const app = express();
const { ExpressPeerServer } = require('peer');
const origin =
    process.env.NODE_ENV === 'production'
        ? 'http://qkmedia.herokuapp.com/'
        : 'http://localhost:3000';
// Connect DB
db.connect();

// Middleware
app.use(cors({ credentials: true, origin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const http = require('http').Server(app);
const io = require('socket.io')(http);

io.on('connection', (socket) => {
    socketSever(socket);
});

ExpressPeerServer(http, { path: '/' });

routes(app);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
    });
}

http.listen(port, () => console.log(`Listening port ${port}`));
