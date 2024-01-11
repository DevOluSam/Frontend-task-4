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
const express_1 = __importDefault(require("express"));
const NoteModel_1 = __importDefault(require("../Models/NoteModel"));
const auth_1 = require("../Middleware/auth");
const router = express_1.default.Router();
/* GET home page. */
router.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.render('index');
}));
router.get('/users/signup', function (req, res, next) {
    res.render('signup');
});
router.get('/users/login', function (req, res, next) {
    res.render('login');
});
router.get('/users/dashboard', auth_1.authenticateTokenForNotes, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.session.userId;
    if (!userId) {
        return res.redirect('/users/login');
    }
    const perPage = 5;
    let page = Number(req.query.page) || 1;
    page = Math.max(page, 1);
    const fullName = req.session.fullName;
    const skipValue = Math.max(Number(perPage) * (page - 1), 0);
    const userNotes = yield NoteModel_1.default.find({ userId })
        .skip(skipValue)
        .limit(Number(perPage))
        .exec();
    const count = yield NoteModel_1.default.countDocuments({ userId });
    res.render('dashboard', {
        fullName,
        userNotes,
        current: page,
        pages: Math.ceil(count / Number(perPage)),
    });
}));
router.get("/users/allNotes", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const perPage = 5;
    let page = Number(req.query.page) || 1;
    page = Math.max(page, 1);
    const skipValue = Math.max(Number(perPage) * (page - 1), 0);
    try {
        const publicNotes = yield NoteModel_1.default.find()
            .skip(skipValue)
            .limit(Number(perPage))
            .exec();
        const count = yield NoteModel_1.default.countDocuments();
        res.render('notesPage', {
            publicNotes,
            current: Number(page),
            pages: Math.ceil(count / Number(perPage)),
        });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}));
router.get('/users/logout', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    req.session.destroy((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/users/login');
    });
}));
exports.default = router;
