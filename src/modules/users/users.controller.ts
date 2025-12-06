import { Request, Response } from "express";
import { userServices } from "./users.services";

const getAllusers = async (req: Request, res: Response) => {
    try {
        const result = await userServices.getAllusers()
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: result.rows
        })
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
            errors: error
        })
}
}

export const userController = {
    getAllusers
}