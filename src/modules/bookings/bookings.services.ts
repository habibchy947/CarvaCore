import { JwtPayload } from "jsonwebtoken";
import { pool } from "../../config/db";

const createBookings = async (payload: Record<string, unknown>) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

    if (!customer_id || !vehicle_id || !rent_start_date || !rent_end_date) {
        throw new Error("missing fields")
    }
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

const updateBookings = async (status: string, id:string, loggedInUser: JwtPayload) => {
    let updated = []
    if(!status || !["cancelled","returned"].includes(status)) {
        throw new Error("Invalid status");
    }
    // auto return
    const curntDate = new Date()

    const expired = await pool.query(`
        SELECT id, vehicle_id, rent_end_date FROM bookings WHERE status='active'
        `)

    for (const b of expired.rows) {
        const enDDate = new Date(b.rent_end_date)

        if(enDDate < curntDate) {
            await pool.query(`UPDATE bookings SET status='returned' WHERE id=$1`, [b.id])

            await pool.query(`UPDATE vehicles SET availability_status='available' WHERE id=$1`, [b.vehicle_id])
        }
    }

    
    const { rows } = await pool.query(`
        SELECT * FROM bookings WHERE id=$1
        `, [id])
    const booking = rows[0];

    if(!booking) {
        throw new Error("Booking not found");
    }

    // if cancelled
    if(status === 'cancelled') {
        if(loggedInUser.role !== "customer" && Number(booking.customer_id) !== Number(loggedInUser.id)) {
            throw new Error("Forbidden");
        }

        const currentDate = new Date();
        const startDate = new Date(booking.rent_start_date)

        if(currentDate >= startDate) throw new Error("Cannot cancel booking that has not started or past");

        await pool.query(`UPDATE bookings SET status='cancelled' WHERE id=$1`, [id])

        await pool.query(`UPDATE vehicles SET availability_status='available' WHERE id=$1`, [booking.vehicle_id])
        
        const {rows: up} = await pool.query(`SELECT id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status FROM bookings WHERE id=$1`,[id])
        updated=up[0];
    }

    //  if returned
    if(status === "returned") {
        if(loggedInUser.role !== 'admin') throw new Error("Forbidden");
        
        await pool.query(`UPDATE bookings SET status='returned' WHERE id=$1`, [id]);

        await pool.query(`UPDATE vehicles SET availability_status='available' WHERE id=$1`, [booking.vehicle_id]);

        const { rows: up } = await pool.query(`SELECT id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status FROM bookings WHERE id=$1`, [id]);
        updated = up[0];
    }
    return updated;
}
export const bookingServices = {
    createBookings,
    getAllBookings,
    updateBookings
}