import { pool } from "../../config/db";

const createVehicles = async ( payload: Record<string, unknown> ) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;

    const result = await pool.query(`
        INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price,availability_status) VALUES($1, $2, $3, $4, $5) RETURNING *
        `, [vehicle_name, type, registration_number, daily_rent_price,availability_status])
    
    return result;
}

const getAllVehicles = async () => {
    const result = await pool.query(`
        SELECT * FROM vehicles
        `)

    return result
}

const getSingleVehicle = async (id: string) => {
    const result = await pool.query(`
        SELECT * FROM vehicles WHERE id=$1
        `, [id])

    return result;
}

const updateVehicle = async (payload: Record<string, unknown>, id: string) => {
    const existing  = await pool.query(`
        SELECT * FROM vehicles WHERE id=$1
        `, [id])
        
        if(existing.rows.length === 0) {
            throw new Error("Vehicles not found")
        }


        const updateVehicles = {
            vehicle_name: payload?.vehicle_name || existing.rows[0].vehicle_name,
            type: payload?.type || existing.rows[0].type,
            registration_number: payload?.registration_number || existing.rows[0].registration_number,
            daily_rent_price: payload?.daily_rent_price || existing.rows[0].daily_rent_price,
            availability_status: payload?.availability_status || existing.rows[0].availability_status,
        }

        const {vehicle_name, type, registration_number, daily_rent_price, availability_status} = updateVehicles;
        const result = await pool.query(`
            UPDATE vehicles SET vehicle_name=$1, type=$2, registration_number=$3, daily_rent_price=$4, availability_status=$5 WHERE id=$6 RETURNING *
            `, [vehicle_name, type, registration_number, daily_rent_price, availability_status, id])

        return result;
}

export const vehiclesServices = {
    createVehicles,
    getAllVehicles,
    getSingleVehicle,
    updateVehicle
}