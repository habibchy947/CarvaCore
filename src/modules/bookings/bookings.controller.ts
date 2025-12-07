import { Request, Response } from "express";
import { bookingServices } from "./bookings.services";

const createBookings = async (req: Request, res: Response) => {
    try {
        const {result, vehicle} = await bookingServices.createBookings(req.body);
        if(result.rows.length === 0) {
            res.status(400).json({
                success: false,
                message: "Vehicle is not found"
            })
        } else {
            res.status(201).json({
                success: true,
                message: "Booking created successfully",
                data: {
                    ...result.rows[0],
                    vehicle: {vehicle_name: vehicle.vehicle_name, daily_rent_price: vehicle.daily_rent_price}
                }
            })
        }
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message,
            details: error
        })
    }
}

export const bookingsController = {
    createBookings
}