import { JwtPayload } from "jsonwebtoken"
import { pool } from "../../config/db"

const getAllusers = async () => {

    const result = await pool.query(`
        SELECT id,name,email,phone,role FROM users
        `)

    return result
}

const updateUser = async (payload: Record<string, unknown>, id: string, loggedInUser: JwtPayload) => {
    
    const existing  = await pool.query(`
        SELECT * FROM users WHERE id=$1
        `, [id])
        
       if(loggedInUser.role === "customer" && loggedInUser.role !== existing.rows[0].role) {
            throw new Error("Unauthorized access")
        } 

        const updateUser = {
            name: payload?.name || existing.rows[0].name,
            email: payload?.email || existing.rows[0].email,
            phone: payload?.phone || existing.rows[0].phone,
            role: payload?.role || existing.rows[0].role,
        }

        const {name, email, phone, role} = updateUser;
        const result = await pool.query(`
            UPDATE users SET name=$1, email=$2, phone=$3, role=$4 WHERE id=$5 RETURNING *
            `, [name, email, phone, role, id])

        return result;

    
}

export const userServices = {
    getAllusers,
    updateUser
}