import mongoose from "mongoose";

interface IUser {
  username: String;
  password: String;
  email: String;
}

interface IUserDocument extends IUser, Document {}

const userSchema = new mongoose.Schema<IUserDocument>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model<IUserDocument>("User", userSchema);

export default User;
