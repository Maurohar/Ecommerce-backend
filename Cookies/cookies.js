import express from 'express';

const configureCookieMiddleware = (req, res, next) => {
    const cookieOptions = {
        maxAge: 24 * 60 * 60 * 1000, // 1 día en milisegundos
        httpOnly: true,
        // otras opciones de cookie si es necesario
    };

    // Establecer una cookie llamada 'miCookie' con el valor 'Hola, esta es una cookie'
    res.cookie('miCookie', 'Hola, esta es una cookie', cookieOptions);

    next(); // Llamar a next() para pasar la solicitud al siguiente middleware o ruta
};

export default configureCookieMiddleware;