import { Request, Response } from "express";
import { userServices } from "./users.services";
import { JwtPayload } from "jsonwebtoken";

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

const updateUser = async (req: Request, res: Response) => {
    const loggedInUser = req.user as JwtPayload;
     try {
        const result = await userServices.updateUser(req.body, req.params.userId as string, loggedInUser)
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        } else {
            return res.status(200).json({
                success: true,
                message: "User updated successfully...",
                data: result.rows[0]
            });
        };
    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: err.message,
            details: err
        });
    };
}

const deleteUser = async (req: Request, res: Response) => {
    try {
        const result = await userServices.deleteUser(req.params.userId as string)
        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "User deleted successfully",
            });
        };
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        });
    };
}

export const userController = {
    getAllusers,
    updateUser,
    deleteUser
}