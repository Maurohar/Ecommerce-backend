import express from 'express';
import { v4 as uuidV4 } from 'uuid';
import fs from 'fs/promises';

const router = express.Router();
const path = './carts.json';
const carts = [];

router.post('/carts', async (req, res) => {
    const newCart = {
        id: uuidV4(),
        products: [],
    };
    console.log(newCart);
    carts.push(newCart);
    const content = JSON.stringify(carts, null, '\t');
    try {
        await fs.writeFile(path, content, 'utf-8');
        return res.status(201).json({ msg: 'Carrito creado exitosamente' });
    } catch (error) {
        console.log(`Ha ocurrido un error: ${error.message}`);
        return res.status(404).json({ error: error.message });
    }
});

router.post('/carts/:cId/product/:pId', async (req, res) => {
    const { cId, pId } = req.params;
    const newProduct = {
        id: pId,
        quantity: 1,
    };
    const cartIndex = carts.findIndex((cart) => cart.id === cId);

    if (cartIndex !== -1) {
        const cart = carts[cartIndex];
        const existingProduct = cart.products.find((product) => product.id === pId);
        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.products.push(newProduct);
        }

        const content = JSON.stringify(carts, null, '\t');
        try {
            await fs.writeFile(path, content, 'utf-8');
        } catch (error) {
            console.log(`Ha ocurrido un error: ${error.message}`);
            res.status(500).json({ error: 'Error al escribir en el archivo' });
            return;
        }
    }
});

router.get('/carts/:cId', async (req, res) => {
    const { cId } = req.params;

    try {
        const contentJson = await fs.readFile(path, 'utf-8');
        const content = JSON.parse(contentJson);
        const cartSearch = content.find((c) => c.id === cId);
        if (cartSearch) {
            const list = cartSearch.products;
            console.log(list);
            return res.status(200).json(list);
        }
    } catch (error) {
        console.log(`Ha ocurrido un error: ${error.message}`);
        return;
    }
});

export default router;
