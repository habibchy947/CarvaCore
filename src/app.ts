import express, { Request, Response } from "express";
import initDB from "./config/db";
import { authRoutes } from "./modules/auth/auth.routes";
import { userRoutes } from "./modules/users/users.routes";
import { vehicleRoutes } from "./modules/vehicles/vehicles.routes";

const app = express();

// initializingDB
initDB();

app.use(express.json());

app.post("/", (req: Request, res: Response) => {
    console.log(req.body)

    res.status(201).json({
        success: true,
        message: "API is working"
    });
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
});


app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/vehicles", vehicleRoutes);


// not found route
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.path
    });
});

export default app;