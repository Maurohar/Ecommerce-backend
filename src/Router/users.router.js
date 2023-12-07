import express from 'express';
import User from '../models/schema.users.js'; // Ajusta la importación según tu ruta
import bodyParser from 'body-parser';

const router = express.Router();

// Ruta para obtener el registro del cliente por ID
router.get('/api/usuario/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);
        if (user) {
            // Filtrar la información sensible antes de enviarla al cliente
            const userWithoutPassword = {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                // Otros campos que desees incluir
            };
            res.json(userWithoutPassword);
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
});

export default router;