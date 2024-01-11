"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const NoteController_1 = require("../Controller/NoteController");
const router = express_1.default.Router();
router.post('/create', NoteController_1.createNote);
router.get('/get/:id', NoteController_1.getNoteById);
router.put('/update/:id', NoteController_1.updateNote);
router.delete('/delete/:id', NoteController_1.deleteNote);
exports.default = router;
