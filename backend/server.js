import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import catRouter from "./routes/categoryRoute.js"
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import fedRouter from "./routes/feedbackRoute.js"
import ReservationRouter from "./routes/ReservationRoute.js"
import areaRouter from "./routes/areaRouter.js"
import path from "path";
import { fileURLToPath } from "url";
import reportRouter from "./routes/ReportRouter.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


//app config

const app = express()
const port = process.env.PORT||4000;

//middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
// app.use((req, res, next) => {
//     console.log(`Received request: ${req.method} ${req.url}`);
//     console.log('Headers:', req.headers);
//     console.log('Body:', req.body);
//     next();
// });
// db connection 
connectDB();

//api endpoints

app.use("/api/food", catRouter)
app.use("/api/food", foodRouter)
app.use("/images",express.static('uploads'))
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)
app.use("/api/contact",fedRouter)
app.use("/api/reservation",ReservationRouter)
app.use("/api/area",areaRouter)
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 
app.use("/api/report",reportRouter)


app.get("/",(req,res)=>{
    res.send("API Working")
})

app.listen(port,()=>{
    console.log(`Server Started on http://localhost:${port}`)
})
