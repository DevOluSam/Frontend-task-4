"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateTokenForNotes = exports.authenticateToken = exports.verifyAccessToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function generateAccessToken(user) {
    const payload = {
        email: user.email,
        id: user.id,
    };
    const secret = process.env.secret;
    const options = { expiresIn: "1h" };
    return jsonwebtoken_1.default.sign(payload, secret, options);
}
exports.generateAccessToken = generateAccessToken;
function verifyAccessToken(token) {
    const secret = process.env.secret;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        return { success: true, data: decoded };
    }
    catch (error) {
        return { success: false, data: error.message };
    }
}
exports.verifyAccessToken = verifyAccessToken;
function authenticateToken(req, res, next) {
    const token = req.session.token;
    const userId = req.session.userId;
    if (!token) {
        return res.redirect("/users/login");
    }
    const result = verifyAccessToken(token);
    if (!result.success) {
        return res.redirect("/users/login");
    }
    res.redirect("/users/dashboard");
}
exports.authenticateToken = authenticateToken;
function authenticateTokenForNotes(req, res, next) {
    const token = req.session.token;
    const userId = req.session.userId;
    if (!token || !userId) {
        return res.redirect("/users/login");
    }
    const result = verifyAccessToken(token);
    if (!result.success) {
        return res.redirect("/users/login");
    }
    next();
}
exports.authenticateTokenForNotes = authenticateTokenForNotes;
