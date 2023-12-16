import express from 'express';
import path from 'path';
import handlebars from 'express-handlebars';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session'; // Importa express-session
import passport from 'passport'; // Importa passport
import LocalStrategy from 'passport-local'; // Importa la estrategia local
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

// Configuración de la sesión de Passport
app.use(session({ secret: COOKIE_SECRET, resave: true, saveUninitialized: true }));

// Inicialización y configuración de Passport
app.use(passport.initialize());
app.use(passport.session());

// Definir el modelo User
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

// Configuración de la estrategia local de Passport
passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return done(null, false, { message: 'Email no encontrado' });
            }

            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                return done(null, false, { message: 'Contraseña incorrecta' });
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

// Serialización de usuario
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialización de usuario
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

// Ruta de registro
app.post('/register', passport.authenticate('local', {
    successRedirect: '/login',
    failureRedirect: '/register',
    failureFlash: true,
}));

// Ruta de inicio de sesión
app.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true,
}));

const httpServer = app.listen(8080, () => {
    console.log('Server ON PORT 8080');
});

init(httpServer);
