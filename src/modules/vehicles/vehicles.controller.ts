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

const getAllVehicles = async (req: Request, res: Response) => {
    try {
        const result = await vehiclesServices.getAllVehicles()
        if(result.rows.length === 0) {
            return res.status(400).json({
            success: false,
            message: "No vehicles found",
            data: result.rows
        })
        } else{
            return res.status(200).json({
            success: true,
            message: "Vehicles retrieved successfully",
            data: result.rows
        })
        }
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message,
            errors: error
        })
}
}

const getSingleVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehiclesServices.getSingleVehicle(req.params.vehicleId as string)
        if(result.rows.length === 0) {
            return res.status(400).json({
            success: false,
            message: "No vehicles found",
            data: result.rows
        })
        } else{
            return res.status(200).json({
            success: true,
            message: "Vehicles retrieved successfully",
            data: result.rows[0]
        })
        }
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message,
            errors: error
        })
}
}


// update vehicle
const updateVehicle = async (req: Request, res: Response) => {
    // const loggedInUser = req.user as JwtPayload;
     try {
        const result = await vehiclesServices.updateVehicle(req.body, req.params.vehicleId as string)
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Vehicles not found",
            });
        } else {
            return res.status(200).json({
                success: true,
                message: "Vehicles updated successfully...",
                data: result.rows[0]
            });
        };
    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: err.message,
            details: err
        });
    };
}

// delete vehicle if no active bookings exist
const deleteVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehiclesServices.deleteVehicle(req.params.vehicleId as string)
        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found",
            });
        } else {
            return res.status(200).json({
                success: true,
                message: "Vehicle deleted successfully",
            });
        };
    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: err.message,
            details: err
        });
    };
}
export const vehiclesController = {
    createVehicles,
    getAllVehicles,
    getSingleVehicle,
    updateVehicle,
    deleteVehicle
}