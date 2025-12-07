import { JwtPayload } from "jsonwebtoken";
import { pool } from "../../config/db";

const createBookings = async (payload: Record<string, unknown>) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

    if (!customer_id || !vehicle_id || !rent_start_date || !rent_end_date) {
        throw new Error("missing fields")
    }
    console.log(rent_start_date, rent_end_date)
    // check vehicle
    const { rows: vrows } = await pool.query(`
        SELECT * FROM vehicles WHERE id=$1
        `, [vehicle_id])

    const vehicle = vrows[0]
    if (vrows.length === 0) {
        throw new Error("Vehicle not found")
    } else if (vrows[0].availability_status !== 'available') {
        throw new Error("Vehicle not available");
    }

    // fuction
    const daysBetween = (startstr: string, endstr: string) => {
        const s = new Date(startstr);
        const e = new Date(endstr);
        const diff = (e.getTime() - s.getTime()) / 86400000;
        return Math.floor(diff)
    }

    const startDate = new Date(rent_start_date as string)
    const endDate = new Date(rent_end_date as string)
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || startDate < new Date() || endDate <= startDate) {
        throw new Error("Invalid dates");
    }

    const number_of_days = daysBetween(rent_start_date as string, rent_end_date as string)

    if (number_of_days <= 0) {
        throw new Error("rent_end_date must be after rent_start_date");
    }

    const total_Price = Number((Number(vrows[0].daily_rent_price) * number_of_days).toFixed(2))

    console.log(number_of_days, total_Price)

    const result = await pool.query(`
        INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price) VALUES($1, $2, $3, $4, $5) RETURNING *
        `, [customer_id, vehicle_id, rent_start_date, rent_end_date, total_Price])

    await pool.query(`
        UPDATE vehicles SET availability_status='booked' WHERE id=$1
        `, [vehicle_id])
    return { result, vehicle };
}

const getAllBookings = async (loggedInUser: JwtPayload) => {
    let bookings = [];
    // for admin
    if (loggedInUser.role === "admin") {
        const {rows} = await pool.query(`
        SELECT * FROM bookings
        `);
        bookings = rows;

        for(let b of bookings) {
            const customer = await pool.query(`
                SELECT name, email FROM users WHERE id=$1
                `,[b.customer_id]);

            const vehicle = await pool.query(`
                SELECT vehicle_name, registration_number FROM vehicles WHERE id=$1
                `, [b.vehicle_id]);

            b.customer=customer.rows[0] || null;
            b.vehicle=vehicle.rows[0] || null;
        }
    } else if (loggedInUser.role === "customer") {
        const {rows} = await pool.query(`
            SELECT * FROM bookings WHERE customer_id=$1
            `, [loggedInUser.id]);
        bookings=rows;

        for(let b of bookings) {
            const vehicle = await pool.query(`
                SELECT vehicle_name, registration_number, type FROM vehicles WHERE id=$1
                `, [b.vehicle_id])

            b.vehicle=vehicle.rows[0] || null
            delete b.customer_id
        }
    }

    return bookings;
}
export const bookingServices = {
    createBookings,
    getAllBookings
}