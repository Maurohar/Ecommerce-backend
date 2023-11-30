import { Server } from 'socket.io';
import MessageModel from './src/serverchat/chat.server.js';

let io;

export const initSocket = async (httpServer) => {
    io = new Server(httpServer);

    io.on('connection', async (clientSocket) => {
        //console.log(`Nuevo Cliente socket conectado(${clientSocket.id})`);
        console.log("estoy aca");
        try {
            const messages = await MessageModel.find({});
            clientSocket.emit('update-messages', messages);

            clientSocket.on('new-message', async (msg) => {
                console.log("estoy aca");
                // Assuming msg is an object with the necessary properties
                await MessageModel.create(msg);
                const updatedMessages = await MessageModel.find({});
                io.emit('update-messages', updatedMessages);
            });
        } catch (error) {
            console.error('Error handling socket connection:', error);
        }
    });
};