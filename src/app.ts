import express, { Request, Response } from "express";

const app = express()


app.use(express.json())

app.post("/", (req: Request, res: Response) => {
    console.log(req.body)

    res.status(201).json({
        success: true,
        message: "API is working"
    })
})

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})


// not found route
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.path
    });
});

export default app;