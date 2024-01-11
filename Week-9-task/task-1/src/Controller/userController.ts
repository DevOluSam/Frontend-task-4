import User from "../Models/UserModel";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import Joi from "joi";
import { generateAccessToken, CustomRequest} from "../Middleware/auth";



const signupSchema = Joi.object({
    fullName: Joi.string().required().min(5).max(30),
    email: Joi.string().email().required(),
    phone: Joi.number().required().min(11),
    address: Joi.string().required(),
    password: Joi.string().required().min(6),
    confirmPassword: Joi.string().required().min(6),
    gender: Joi.string().required(),
  });



  export const login = async (req: CustomRequest, res: Response, next:NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide an email and password' });
    }
    const user:any = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const accessToken = generateAccessToken(user);
    const userId = user.id;
    
     req.session.token = accessToken;
     req.session.userId = userId;
     req.session.fullName = user.fullName;
    next();  
  };


  
  export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { error } = signupSchema.validate(req.body);

        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const { fullName, email, phone, address, password, confirmPassword, gender } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Passwords do not match" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            fullName,
            email,
            phone,
            address,
            password: hashedPassword,
            gender
        });

        await newUser.save();

        // Send success message in the response
        return res.status(201).json({ success: true, message: 'User created successfully.' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
