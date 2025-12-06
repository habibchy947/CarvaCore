import { pool } from "../../config/db"

const getAllusers = async () => {

    const result = await pool.query(`
        SELECT id,name,email,phone,role FROM users
        `)


    return result
}

export const userServices = {
    getAllusers
}