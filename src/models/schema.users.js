import mongoose, { mongo } from "mongoose";
import { Schema } from 'mongoose';

let userSchema = new Schema(
    {
        first_name: { type:String, required: true},
        last_name : { type:String, required: true},
        email: { type:String, required: true},
        password: { type:String, required: true},
        role: { type:String, required: true},
        age: { type:String, required: true},
    },
    {timestamps: true}
);

export default mongoose.model("user-register", userSchema);




/* import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const { Schema } = mongoose;

const userSchema = new Schema({
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
});

userSchema.pre('save', async function (next) {
    try {
        const user = this;

        if (!user.isModified('password')) return next();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);

        user.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User; */