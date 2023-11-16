const socket = io();

//Eventos de Emit de mensajes de Cliente, Otros Clientes , y Todos los clientes.

socket.emit('message', 'Hello from the client');

socket.on('client-emit', (data) =>{
    console.log('event client-emit', data);
});

socket.on('broadcast-emit', (data)=>{
    console.log('event broadcast-emit', data);
});

socket.on('all-clients', (data)=>{
    console.log('event all-clients', data);
});