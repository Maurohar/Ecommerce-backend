import express from 'express';
import path from 'path';
import handlebars from 'express-handlebars';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { init } from './socket.servidor.js';
import { __dirname } from '../utils.js';

import homeRouter from '../Router/home.router.js';
import chatRouter from '../Router/chat.router.js';
import cartRouter from '../Router/cart.router.js';
import cookieRouter from '../Router/cookie.router.js';
import UserRegisterRouter from '../Router/users.router.js';
import RegisterRouter from '../Router/register.router.js';
import productRouter from '../Router/products.router.js';

const app = express();

const COOKIE_SECRET = "+{bOJv[++Dh38b)t)?AwD.W£62>C~`"

app.use(cookieParser(COOKIE_SECRET));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/src', express.static(path.join(__dirname, 'src')));
app.use(express.static(path.join(__dirname, '..', 'public', 'css')));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/home', homeRouter);
app.use('/chat', chatRouter);
app.use('/login', UserRegisterRouter);
app.use('/register', RegisterRouter);
app.use('/products', productRouter);

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

mongoose.connect("mongodb+srv://mauroharmitton:Password1@cluster0.453yel4.mongodb.net/Users?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error de conexión a la base de datos:'));
db.once('open', () => {
    console.log('Conexión exitosa a la base de datos');
});

// Definir el modelo User
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

// Ruta de registro
app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Verificar si el usuario ya existe en la base de datos
        const existingUser = await User.findOne({ email });
        console.log(existingUser);
        if (existingUser) {
            return res.status(400).json({ message: 'El email ya existe' });
        }

        // Hashear la contraseña antes de almacenarla en la base de datos
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear un nuevo usuario
        const newUser = new User({
            email,
            password: hashedPassword,
        });

        // Guardar el nuevo usuario en la base de datos
        await User.create(newUser);

        res.status(201).redirect('/login');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Ruta de inicio de sesión
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar el usuario en la base de datos
        const user = await User.findOne({ email });

        // Verificar si el usuario existe
        if (!user) {
            return res.status(404).json({ message: 'Email no encontrado' });
        }

        // Verificar la contraseña
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Aquí puedes establecer una sesión o generar un token de autenticación
        // Por ejemplo, podrías usar la biblioteca jsonwebtoken para generar un token

        // ...

        res.status(200).json({ message: 'Inicio de sesión exitoso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

const httpServer = app.listen(8080, () => {
    console.log('Server ON PORT 8080');
});

init(httpServer);