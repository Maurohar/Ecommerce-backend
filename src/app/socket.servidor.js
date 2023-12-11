import { Server } from 'socket.io';
import MessageRepo from '../db/MessageRepo.js';

export const init = (httpServer) => {
    const socketServer = new Server(httpServer);

    socketServer.on('connection', (socketClient) => {

        console.log(`Nuevo cliente socket conectado
        ${socketClient.
                id}`);
        socketClient.emit('client-emit', { status: "ok" });
        socketClient.broadcast.emit('broadcast-emit', {
            status:
                "ok"
        });

        let newUser = "";
        socketClient.on('newuser', function (nick) {
            newUser = nick;
        })
        console.log(newUser + ' connected');

        socketServer.emit('broadcast-emit', { status: "ok" });
        socketClient.on('message', (msg) => {

            let repo = new MessageRepo();
            repo.SaveMessage(newUser, msg);

            console.log(`cliente envio un nuevo mensaje:${msg}`);
        });
    });
}