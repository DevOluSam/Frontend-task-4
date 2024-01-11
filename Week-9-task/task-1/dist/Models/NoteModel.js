"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const moment_1 = __importDefault(require("moment"));
const noteSchema = new mongoose_1.default.Schema({
    title: String,
    description: String,
    dueDate: { type: String, default: () => (0, moment_1.default)().format('DD/MM/YYYY') },
    status: String,
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });
const Note = mongoose_1.default.model('Note', noteSchema);
exports.default = Note;
