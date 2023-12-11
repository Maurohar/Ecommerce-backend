import express from 'express';
import path from 'path';
import handlebars from 'express-handlebars';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import ProductManager from './ProductManager.js';
import CartManager from './CartManager.js';
import { init } from './socket.servidor.js';
import { __dirname } from '../utils.js';
import mongoose from 'mongoose';





import homeRouter from '../Router/home.router.js';
import chatRouter from '../Router/chat.router.js';
import cartRouter from '../Router/cart.router.js';
import cookieRouter from '../Router/cookie.router.js';
import UserRegisterRouter from '../Router/users.router.js';
import UsersRepo from '../db/LoginRepo.js';




//import UserRouter from '../models/schema.users.js';

const app = express();

const COOKIE_SECRET = "+{bOJv[++Dh38b)t)?AwD.W£62>C~`"


app.get('/src/db/SaveSensitiveRepo.js', (req, res) => {
    try {
        // Lógica para leer y enviar el archivo
        res.sendFile(path.join(__dirname, 'src', 'db', 'SaveSensitiveRepo.js'));
    } catch (error) {
        console.error('Error al enviar el archivo:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.use(cookieParser(COOKIE_SECRET));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/src', express.static(path.join(__dirname, 'src')));
app.use(express.static(path.join(__dirname, '..', 'public', 'css')));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/', homeRouter);
app.use('/chat', chatRouter);
app.use('/login', UserRegisterRouter);
app.use('/cart', cartRouter);
app.use('/register', UserRegisterRouter);



app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});


app.use((error, req, res, next) => {
    const message = `Ah ocurrido un error desconocido.. ${error.message}`;
    console.error(message);
    res.status(500).json({ message });
});


// Ruta de inicio de sesión
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Aquí deberías realizar la lógica de autenticación
    // (por ejemplo, verificar las credenciales en una base de datos)
    // Simulación: Si las credenciales son válidas, establece la cookie
    if (username === 'user' && password === 'password') {
        res.cookie('user', username).json({ message: 'Inicio de sesión exitoso' });
    } else {
        res.status(401).json({ message: 'Credenciales inválidas' });
    }
});

// Ruta protegida que requiere autenticación
app.get('/dashboard', (req, res) => {
    const user = req.cookies['user'];
    // Realiza acciones adicionales basadas en la cookie, como consultar datos en MongoDB
    res.send(`Hola, ${user}! Bienvenido al dashboard.`);
});





//*Productos*/


const productManager = new ProductManager();
app.use('/api', CartManager);

app.post('/products', async (req, res) => {
    const newProduct = req.body;
    console.log(newProduct);
    productManager.addProduct(newProduct);
    productManager.guardarProductos();
    res.json({ mensaje: 'Producto agregado exitosamente' });
});

app.put('/products/:pid', async (req, res) => {
    const { pid } = req.params;
    const updatedProduct = req.body;
    productManager.updatedProductById(parseInt(pid), updatedProduct);
    productManager.guardarProductos();
    res.json({ mensaje: `Producto con id ${pid} actualizado exitosamente` });
});

app.get('/products', (req, res) => {
    productManager.leerProductos();
    const products = productManager.getAllProducts();
    res.json(products);
});

app.get('/products/:pid', async (req, res) => {
    const { pid } = req.params;
    const product = productManager.getProductById(parseInt(pid)); B
    if (!product) {
        res.json({ error: 'Producto no encontrado.' });
    } else {
        res.json(product);
    }
});

app.delete('/products/:pid', async (req, res) => {
    const { pid } = req.params;
    const result = productManager.removeProductById(parseInt(pid));
    if (result) {
        productManager.guardarProductos();
        res.json({ mensaje: 'Producto eliminado exitosamente' });
    } else {
        res.json({ error: 'Producto no encontrado' });
    }
});

const httpServer = app.listen(8080, () => {
    console.log('Server ON PORT 8080');
});

init(httpServer)
