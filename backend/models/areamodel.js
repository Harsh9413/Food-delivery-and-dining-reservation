import mongoose from "mongoose";

const AreaSchema = new mongoose.Schema({
    area:{type:String,require:true},
    pincode:{type:Number,min:100000,max:999999,require:true}
})

const AreaModel= mongoose.model.area|| mongoose.model("area",AreaSchema)

export default AreaModel