import { pool } from "../../config/db";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import config from "../../config";

const createUser = async (payload: Record<string, unknown>) => {
    const {name, email, password, phone, role} = payload;

    const hashPassword = await bcrypt.hash(password as string,12)
    const result = await pool.query(`
        INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING *
        `, [name, email, hashPassword, phone, role || "customer"])

        
    delete result.rows[0].password;
        return result;

}


const loginUser = async (email: string, password: string) => {
    const user  = await pool.query(`SELECT * FROM users WHERE email=$1`, [email])

    if(user.rows.length === 0) {
        throw new Error("User not found")
    }

    const matchPass = await bcrypt.compare(password, user.rows[0].password)
    if(!matchPass) {
        throw new Error("Invalid Credential")
    }

    const jwtPayload = {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email
    }

    const token = jwt.sign(jwtPayload, config.jwt_secret as string, {expiresIn: "7d"})

    delete user.rows[0].password;

    return {token, user: user.rows[0]};
}
export const authServices = {
    createUser,
    loginUser
}