import { Request, Response, NextFunction } from "express";
import Note from "../Models/NoteModel";
import Joi from "joi";
import mongoose from "mongoose";

const noteSchema = Joi.object({
    title: Joi.string(),
    description: Joi.string(),
    dueDate: Joi.date(), 
    status: Joi.string(),
});

export const getAllNotes = async (req: Request, res: Response) => {
        const notes = await Note.find();
        if (!notes) {
          return res.status(404).json({ message: 'No notes found.' });
        }
        res.status(200).json({ notes });
};

export const getNoteById = async (req: Request, res: Response) => {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found.' });
    }
    res.status(200).json({ note });
};

export const createNote = async (req: Request, res: Response) => {
    const userId = (req.session as any).userId;
    console.log(userId);
    
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({ message: "Unauthorized" });
  }
    
    const { error } = noteSchema.validate(req.body);
    if (error) {   
      return res.status(400).json({ message: error.details[0].message });
    }
    const { title, description, dueDate, status } = req.body;
    const newNote = new Note({
      title,
      description,
      dueDate,
      status,
      userId
    });
    await newNote.save();
    res.status(201).json({ message: 'Note created successfully.' });
};


export const updateNote = async (req: Request, res: Response) => {
    const { error } = noteSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({ message: error.details[0].message }); 
    }
    const { title, description, dueDate, status } = req.body;
    const note = await Note.findByIdAndUpdate(req.params.id, {
      title,
      description,
      dueDate,
      status,
    });
    if (!note) {
      return res.status(404).json({ message: 'Note not found.' });
    }
    res.status(200).json({ message: 'Note updated successfully.' });
};


export const deleteNote = async (req: Request, res: Response) => {
      const noteId = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(noteId)) {
        return res.status(400).json({ message: 'Invalid noteId.' });
      }
      const deletedNote = await Note.findByIdAndDelete(noteId);
      if (!deletedNote) {
        return res.status(404).json({ message: 'Note not found.' });
      }
      res.status(200).json({ message: 'Note deleted successfully.' });
  };
  