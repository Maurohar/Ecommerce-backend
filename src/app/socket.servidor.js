import { Server } from 'socket.io';

export const init = (httpServer) => {
    const socketServer = new Server(httpServer);

    socketServer.on('connection', (socketClient) => {

        console.log(`Nuevo cliente socket conectado
        ${socketClient.
        id}`);


        socketClient.emit('client-emit', { status: "ok"});                //el evento se llama start o init tambien
        socketClient.broadcast.emit('broadcast-emit', {status: 
        "ok"});     //brodcast hace que se le emita todos los mensajes a todos los clientes.
        
        
        socketServer.emit('broadcast-emit', {status: "ok"});

        socketClient.on('message', (msg) => {
        console.log(`cliente envio un nuevo mensaje:${msg}`);
        });
    });
}