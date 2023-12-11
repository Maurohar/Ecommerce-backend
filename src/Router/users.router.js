import path from 'path';
import { Router } from 'express';
import { __dirname } from '../utils.js';
import userloginModel from '../models/schema.users.js';
import bcrypt from 'bcrypt';

const router = Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'log-in.html'));
});

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'register-session.html'));
});

router.post("/login", async (req, res) => {
    const {
        body: { email, password }
    } = req;
    if (!email || !password) {
        return res.render("error", {
            title: "Error",
            messageError: "Both email and password are required."
        });
    }

    const user = await userloginModel.findOne({ email });

    if (!user) {
        return res.render("error", { title: "Error" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        return res.render("error", {
            title: "Error",
            messageError: "Invalid password."
        });
    }

    const { first_name, last_name, age, role } = user;

    req.session.user = {
        first_name,
        last_name,
        email,
        role,
        age
    };
    res.redirect("/profile");
});

router.post("/register", async (req, res) => {
    const {
        body: { first_name, last_name, email, password, age }
    } = req;

    if (!first_name || !last_name || !email || !password) {
        return res.render("error", {
            title: "Error",
            messageError: "All fields are required."
        });
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userloginModel.create({
        first_name,
        last_name,
        email,
        password: hashedPassword,
        age
    });
    res.redirect("/login");
});

router.get("/me", (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    res.status(200).json(req.session.user);
});

export default router;
