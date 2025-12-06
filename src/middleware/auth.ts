import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"
import config from "../config";
import { pool } from "../config/db";

const auth = (...roles: ("admin" | "customer")[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const bearerToken = req.headers.authorization
        if(!bearerToken?.startsWith('Bearer')) return res.status(401).json({
            success: false,
            message: "Unauthorized access"
        })
        const token  = bearerToken?.split(" ")[1];
        if(!token) {
            return res.status(401).json({
            success: false,
            message: "Unauthorized access"
        })
        }
        
        const decoded = jwt.verify(token, config.jwt_secret as string) as JwtPayload
        const user = await pool.query(`
            SELECT * FROM users WHERE email=$1
            `, [decoded.email])

        if(user.rows.length === 0) {
            return res.status(401).json({
            success: false,
            message: "User not found"
        })
        }

        req.user = decoded

        // role check
        if(roles.length && !roles.includes(decoded.role)) {
            return res.status(401).json({
            success: false,
            message: "Unauthorized access"
        })
        }
        console.log(decoded)
        next()
    }
}

export default auth;