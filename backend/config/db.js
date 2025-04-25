import mongoose from "mongoose";

export const connectDB = async () =>{
    await mongoose.connect('mongodb+srv://sdpprojectbca:TjGXi09024AQJjyz@cluster0.s3uyf.mongodb.net/resturant').then(()=>console.log("DB Connected"));
}                           
