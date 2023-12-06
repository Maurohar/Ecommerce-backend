import { Router } from 'express';
import UserModel from '../models/schema.users.js';
import path from 'path';
import { __dirname } from '../utils.js';


const router = Router(); // llamamos a la funcion del modulo Router de express

router.get('/users', async (req, res, next) => {
    try {
        const users = await UserModel.find({});
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
});

router.get('/users/:uid', async (req, res, next) => {
    try {
        const { params: { uid } } = req;
        const user = await UserModel.findById(uid);
        if (!user) {
            return res.status(404).json({ message: `User id ${uid} not found.` });
        }
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
});

router.post('/users', async (req, res, next) => {
    try {
        const { body } = req;
        const user = await UserModel.create(body);
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
});

router.put('/users/:uid', async (req, res, next) => {
    try {
        const { body, params: { uid } } = req;
        const updatedUser = await UserModel.findByIdAndUpdate(uid, body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: `User id ${uid} not found.` });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
});

router.delete('/users/:uid', async (req, res, next) => {
    try {
        const { params: { uid } } = req;
        const deletedUser = await UserModel.findByIdAndDelete(uid);
        if (!deletedUser) {
            return res.status(404).json({ message: `User id ${uid} not found.` });
        }
        res.status(204).end();
    } catch (error) {
        next(error);
    }
});

export default router;