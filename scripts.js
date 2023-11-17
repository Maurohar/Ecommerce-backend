(function () {
    document.getElementById('form-message')
        .addEventListener('submit', (event) => {
            event.preventDefault();
            const input = document.getElementById('input-message');
            const newMsg = {
                user: email,
                body: input.value,

            };
            input.value = '';
            input.focus();
            socket.emit('new-message', newMsg);
        });

    socket.on('update-messages', (messages) => {
        console.log('messages', messages);
    });
    Swal.fire({
        title: 'Identificate por favor 👮',
        input: 'text',
        inputLabel: 'Ingresa tu username',
        allowOutsideClick: false,
        inputValidator: (value) => {
            if (!value) {
                return 'Necesitamos que ingreses un username para continuar!';
            }
        },
    })
        .then((result) => {
            email = result.value.trim();
            console.log(`Hola ${email}, bienvenido 🖐`);
        });

})();