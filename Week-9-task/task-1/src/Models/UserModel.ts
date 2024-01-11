import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    phone: Number,
    address: String,
    password: String,
    gender: String
});

const User = mongoose.model('User', userSchema);

export default User;
