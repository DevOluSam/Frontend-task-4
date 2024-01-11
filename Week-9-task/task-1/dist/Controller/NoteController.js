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
exports.deleteNote = exports.updateNote = exports.createNote = exports.getNoteById = exports.getAllNotes = void 0;
const NoteModel_1 = __importDefault(require("../Models/NoteModel"));
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = __importDefault(require("mongoose"));
const noteSchema = joi_1.default.object({
    title: joi_1.default.string(),
    description: joi_1.default.string(),
    dueDate: joi_1.default.date(),
    status: joi_1.default.string(),
});
const getAllNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const notes = yield NoteModel_1.default.find();
    if (!notes) {
        return res.status(404).json({ message: 'No notes found.' });
    }
    res.status(200).json({ notes });
});
exports.getAllNotes = getAllNotes;
const getNoteById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const note = yield NoteModel_1.default.findById(req.params.id);
    if (!note) {
        return res.status(404).json({ message: 'Note not found.' });
    }
    res.status(200).json({ note });
});
exports.getNoteById = getNoteById;
const createNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.session.userId;
    console.log(userId);
    if (!userId || !mongoose_1.default.Types.ObjectId.isValid(userId)) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const { error } = noteSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const { title, description, dueDate, status } = req.body;
    const newNote = new NoteModel_1.default({
        title,
        description,
        dueDate,
        status,
        userId
    });
    yield newNote.save();
    res.status(201).json({ message: 'Note created successfully.' });
});
exports.createNote = createNote;
const updateNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = noteSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const { title, description, dueDate, status } = req.body;
    const note = yield NoteModel_1.default.findByIdAndUpdate(req.params.id, {
        title,
        description,
        dueDate,
        status,
    });
    if (!note) {
        return res.status(404).json({ message: 'Note not found.' });
    }
    res.status(200).json({ message: 'Note updated successfully.' });
});
exports.updateNote = updateNote;
const deleteNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const noteId = req.params.id;
    if (!mongoose_1.default.Types.ObjectId.isValid(noteId)) {
        return res.status(400).json({ message: 'Invalid noteId.' });
    }
    const deletedNote = yield NoteModel_1.default.findByIdAndDelete(noteId);
    if (!deletedNote) {
        return res.status(404).json({ message: 'Note not found.' });
    }
    res.status(200).json({ message: 'Note deleted successfully.' });
});
exports.deleteNote = deleteNote;
