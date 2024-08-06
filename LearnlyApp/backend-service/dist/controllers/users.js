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
exports.login = exports.createUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const users_1 = __importDefault(require("../models/users"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = process.env.SECRET;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield users_1.default.findOne({ email: req.body.email });
    if (existingUser) {
        return res.json({ error: 'Email already exists' });
    }
    // Hash the password
    const hashedPassword = yield bcryptjs_1.default.hash(req.body.password, 10);
    // Create a new user
    const newUser = new users_1.default({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    });
    yield newUser.save();
    res.json({ message: 'User registered successfully' });
});
exports.createUser = createUser;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_1.default.findOne({ email: req.body.email });
    console.log(user);
    if (!user) {
        return res.json({ error: 'Invalid credentials' });
    }
    // Compare passwords
    const passwordMatch = yield bcryptjs_1.default.compare(req.body.password, user.password);
    if (!passwordMatch) {
        return res.json({ error: 'Invalid credentials' });
    }
    // Generate JWT token
    const token = jsonwebtoken_1.default.sign({ email: user.email }, secret);
    res.json({ token });
});
exports.login = login;
