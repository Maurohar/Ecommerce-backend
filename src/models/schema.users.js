import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    fullname: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
});

// Middleware para hashear la contraseña antes de guardarla
userSchema.pre('save', async function (next) {
    const user = this;

    if (!user.isModified('password')) return next();

    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;

    next();
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;