import { Request, Response } from "express";
import { bookingServices } from "./bookings.services";
import { JwtPayload } from "jsonwebtoken";

const createBookings = async (req: Request, res: Response) => {
    try {
        const { result, vehicle } = await bookingServices.createBookings(req.body);
        if (result.rows.length === 0) {
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
                    vehicle: { vehicle_name: vehicle.vehicle_name, daily_rent_price: vehicle.daily_rent_price }
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

const getAllBooking = async (req: Request, res: Response) => {
    const loggedInUser = req.user as JwtPayload;
    try {
        const result = await bookingServices.getAllBookings(loggedInUser as JwtPayload)
        if (result.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Booking not found"
            })
        } else {
            res.status(200).json({
                success: true,
                message: "Bookings retrieved successfully",
                data: result
            })
        }
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
            errors: error
        })
    }
}

const updateBooking = async (req: Request, res: Response) => {
    const loggedInUser = req.user as JwtPayload;
    try {
        const result = await bookingServices.updateBookings(req.body.status, req.params.bookingId as string, loggedInUser as JwtPayload)
        if (result.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Booking not found"
            })
        } else if (req.body.status === "cancelled") {
            return res.status(200).json({
                success: true,
                message: "Bookings cancelled successfully",
                data: result
            })
        } else if (req.body.status === "returned") {
            return res.status(200).json({
                success: true,
                message: "Bookings returned successfully",
                data: {
                    ...result,
                    vehicle: {
                        availability_status: "available"
                    }
                }
            })
        }
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
            errors: error
        })
    }
}

export const bookingsController = {
    createBookings,
    getAllBooking,
    updateBooking
}