import pkg from 'mongoose';

const { MongoClient } = pkg;

class UserRepo {
    constructor() {
        const url = 'mongodb+srv://mauroharmitton:Password1@cluster0.453yel4.mongodb.net/Users?retryWrites=true&w=majority';
        pkg.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    }

    async saveSensitiveData(firstName, lastName, email, password) {
        const dbName = 'Users';
        const dbCollection = 'users';

        const schema = new pkg.Schema({
            firstName: String,
            lastName: String,
            email: String,
            password: String
        });

        const UserModel = pkg.model(dbCollection, schema);

        const user = new UserModel({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        });

        await user.save();
    }
}

export default UserRepo;