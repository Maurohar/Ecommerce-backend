import express from 'express';
import path from 'path';
import handlebars from 'express-handlebars';
import ProductManager from './ProductManager.js';
import CartManager from './CartManager.js';
import { init } from './socket.servidor.js';

import { __dirname } from '../utils.js';

//creo que s por aca
import homeRouter from '../Router/home.router.js';
import chatRouter from '../Router/chat.router.js';
import cartRouter from '../Router/cart.router.js';
import cookieParser from 'cookie-parser';

const app = express();
const COOKIE_SECRET = "_9Wky2.g\EE9"

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//aca servimos la carpeta public 
// app.use(express.static('public'));
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '..', 'public', 'css')));
app.use(express.static(path.join(__dirname, '..', 'public')));


app.use('/', homeRouter);
app.use('/chat', chatRouter);
app.use('/cart', cartRouter);


// app.get('/chat', async (req, res) => {
//     res.send("hola desde app.js")
// })


app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'handlebars');



app.use((error, req, res, next) =>{
    const message = `Ah ocurrido un error desconocido.. ${error.message}`;
    console.error(message);
    res.status(500).json({ message });
});

const productManager = new ProductManager();
app.use('/api' , CartManager);

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
    const product = productManager.getProductById(parseInt(pid));B
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
