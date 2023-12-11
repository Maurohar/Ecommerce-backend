import { Router } from 'express';
import cookieParser from 'cookie-parser';

const router = Router();

router.use(cookieParser());


router.get('/src/Router/cookie.router.js', (req, res) => {
    const filePath = path.join(__dirname, 'src', 'Router', 'cookie.router.js');
    res.sendFile(filePath, { type: 'application/javascript' });
});

router.get('/', (req, res) => {
    res.cookie('cookie-1').cookie('cookie-2').send('Hello Ruta Cookie aqui');
});

router.post('/api/cookie', (req, res) => {
    const { fullname, email } = req.body;
    console.log('fullname, email', fullname, email);
    res
        .cookie('fullname', fullname)
        .cookie('email', email)
        .redirect('/');
});

router.post('/setCookie', (req, res) => {
    res.cookie('secret-cookie', 'esta es una cookie', { maxAge: 20000, signed: true })
        .send('La cookie fue realizada con éxito y la configuración de la cookie fue exitosa.');
});

router.get('/getCookie', (req, res) => {
    const cookie = req.cookies['secret-cookie'];
    res.json({ 'secret-cookie': cookie });
});

router.get('/clearCookie', (req, res) => {
    res.clearCookie('secret-cookie').send('I ate the cookie.');
});

router.post('/setCookieSigned', (req, res) => {
    res
        .cookie('cookie-1-signed', 'cookie configurada con éxito', { signed: true })
        .send('Cookie configurada con éxito.');
});

router.get('/getCookieSigned', (req, res) => {
    const signedCookie = req.signedCookies['cookie-1-signed'];
    res.json({ 'cookie-1-signed': signedCookie });
});

export default router;