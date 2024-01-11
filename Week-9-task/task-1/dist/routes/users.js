"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../Controller/userController");
const auth_1 = require("../Middleware/auth");
const router = express_1.default.Router();
router.post('/signup', userController_1.signup);
router.post('/login', userController_1.login, auth_1.authenticateToken);
exports.default = router;
