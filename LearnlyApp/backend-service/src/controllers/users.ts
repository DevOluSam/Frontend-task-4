import { Request, Response } from "express";
import bcrypt from 'bcryptjs'
import User from "../models/users";
import jwt from 'jsonwebtoken'

const secret: any = process.env.SECRET

export const createUser = async (req: Request, res: Response) => {

    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.json({ error: 'Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create a new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword
    });
    
    await newUser.save();
    res.json({ message: 'User registered successfully' });
  } 


export const login = async (req: Request, res: Response) => {

    const user: any = await User.findOne({ email: req.body.email });
    console.log(user);
    
    if (!user) {
      return res.json({ error: 'Invalid credentials' });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!passwordMatch) {
      return res.json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ email: user.email }, secret);
    res.json({ token });
  }