import express from 'express';
import logger from 'morgan';
import path from 'path';
import { Server } from 'socket.io'; //va a crear un elemento socket server = new server y va a recibir por parametros nuestro servidor http
import { createServer } from 'http';

import app from '../app/app.js';
import { init } from '../app/socket.servidor.js';

//import { createClient } from "@libsql/client";

const PORT = process.env.PORT || 8080

init (server);

const server = createServer(app)
const io = new Server(server)

io.on('connection', (socket) => {
    console.log('a user has connected')

    socket.on('disconnect', (msg) => {
        console.log('message: ' + msg)
    })
    socket.on('chat message',(msg) => {
        io.emit('chat message', msg)
    })
    
});

app.use(logger('dev'))

app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), './cliente/index.html'))
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})