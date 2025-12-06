import { Request, Response } from "express";
import { authServices } from "./auth.services";

const createUser = async (req: Request, res: Response) => {
    const {name,email,password,phone} = req.body;
    if(!name || !email || !password || !phone) return res.status(400).json({success: false, message: "missing fields"})
    try {
        const result = await  authServices.createUser(req.body);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: result.rows[0]
        })
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
            errors: error
        })
}
}


const loginUser = async (req: Request, res: Response) => {
    try {
     const result = await authServices.loginUser(req.body.email, req.body.password)
       return res.status(200).json({
        success: true,
        message: "Login successful",
        data: result
       }) 
    } catch (error: any) {
       return res.status(403).json({
            success: false,
            message: error.message
        })
    }
}
export const authController = {
    createUser,
    loginUser
}