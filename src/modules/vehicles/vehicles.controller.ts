import { Request, Response } from "express"
import { vehiclesServices } from "./vehicles.services";

const createVehicles = async (req: Request, res: Response) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body;
    if(daily_rent_price <= 0) {
        return res.status(400).json({success: false, message: "Invalid credential"})
    }
    if(!vehicle_name || !registration_number || !daily_rent_price || !availability_status ) {
        return res.status(400).json({success: false, message: "missing fields"})
    }
    try {
        const result = await vehiclesServices.createVehicles(req.body);
        return res.status(201).json({
            success: true,
            message: "Vehicle created successfully",
            data: result.rows[0]
        })
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message,
            details: error
        })
    }
}

export const vehiclesController = {
    createVehicles
}