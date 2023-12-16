import mongoose from 'mongoose';
import User from '../models/schema.users.js';

class UsersRepo {
    constructor() {
        this.url = 'mongodb+srv://mauroharmitton:Password1@cluster0.453yel4.mongodb.net/Users?retryWrites=true&w=majority';
        mongoose.connect(this.url, { useNewUrlParser: true, useUnifiedTopology: true });
        this.db = mongoose.connection;

        this.db.on("error", console.error.bind(console, "connection error:"));
        this.db.once("open", function () {
            console.log("Connection Successful!");
        });
    };

    async saveUser(email, password) {
        const userData = new User({
            email: email,
            password: password
        });
        await userData.save();
    };
};

export default UsersRepo;