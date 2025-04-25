import mongoose from "mongoose";

const ReservationSchema = new mongoose.Schema({
    userId:{type:String,required:true},
    First_Name:{type:String,required:true},
    Last_name:{type:String,required:true},
    People:{type:String,required:true},
    Time:{type:String,required:true},
    Date:{type:Date,required:true},
    Amount:{type:Number,required:true},
    Mobile:{type:String,required:true},
    Status:{type:String,default:"Booked"},
    Payment:{type:Boolean,default:false}
})

const ReservationModel = mongoose.models.reservations || mongoose.model("reservations",ReservationSchema)

export default ReservationModel;