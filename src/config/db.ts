import {Pool} from "pg";
import config from ".";

export const pool = new Pool({
    connectionString: config.connectionStr
})

const initDB = async () => {
    // table of users
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL CHECK (email=lower(email)),
        password VARCHAR(200) NOT NULL CHECK (length(password)>=6),
        phone VARCHAR(20) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK(role IN ('admin', 'customer'))
        )
        `);

    // table of vehicles 
    await pool.query(`
        CREATE TABLE IF NOT EXISTS vehicles(
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(100) NOT NULL,
        type VARCHAR(20) CHECK(type IN ('car', 'bike', 'van', 'SUV')),
        registration_number VARCHAR(50) UNIQUE NOT NULL,
        daily_rent_price INT NOT NULL CHECK(daily_rent_price > 0),
        availability_status VARCHAR(20) NOT NULL CHECK (availability_status IN ('available', 'booked'))
        )
        `)

    // table of Bookings
    await pool.query(`
        CREATE TABLE IF NOT EXISTS bookings(
        id SERIAL PRIMARY KEY,
        customer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
        rent_start_date DATE NOT NULL CHECK (rent_start_date >= CURRENT_DATE),
        rent_end_date DATE NOT NULL CHECK (rent_end_date > rent_start_date),
        total_price NUMERIC(10,2) CHECK(total_price > 0) DEFAULT 0,
        status VARCHAR(20) CHECK (status IN ('active', 'cancelled', 'returned')) DEFAULT 'active'
        )
        `)
    
}

export default initDB;