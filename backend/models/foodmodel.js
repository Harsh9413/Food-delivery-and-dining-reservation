import mongoose, { Schema } from "mongoose";

const foodSchema = new mongoose.Schema({
    name: {type:String,required:true},
    description: {type:String,required:true},
    price: {type:Number,required:true},
    image: {type:String,required:true},
    category: {type:Schema.Types.ObjectId,ref:"category",required:true},
    status:{type:Boolean,default:true}
})

const foodModel = mongoose.models.food || mongoose.model("food",foodSchema)

export default foodModel;