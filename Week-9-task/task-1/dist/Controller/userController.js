"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = exports.login = void 0;
const UserModel_1 = __importDefault(require("../Models/UserModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const joi_1 = __importDefault(require("joi"));
const auth_1 = require("../Middleware/auth");
const signupSchema = joi_1.default.object({
    fullName: joi_1.default.string().required().min(5).max(30),
    email: joi_1.default.string().email().required(),
    phone: joi_1.default.number().required().min(11),
    address: joi_1.default.string().required(),
    password: joi_1.default.string().required().min(6),
    confirmPassword: joi_1.default.string().required().min(6),
    gender: joi_1.default.string().required(),
});
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide an email and password' });
    }
    const user = yield UserModel_1.default.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isPasswordCorrect = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordCorrect) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    const accessToken = (0, auth_1.generateAccessToken)(user);
    const userId = user.id;
    req.session.token = accessToken;
    req.session.userId = userId;
    req.session.fullName = user.fullName;
    next();
});
exports.login = login;
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = signupSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }
        const { fullName, email, phone, address, password, confirmPassword, gender } = req.body;
        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Passwords do not match" });
        }
        const existingUser = yield UserModel_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists.' });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = new UserModel_1.default({
            fullName,
            email,
            phone,
            address,
            password: hashedPassword,
            gender
        });
        yield newUser.save();
        // Send success message in the response
        return res.status(201).json({ success: true, message: 'User created successfully.' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
exports.signup = signup;
