import mongoose, { Schema } from "mongoose";
 
const FeedbacSchema=new mongoose.Schema({
    userId:{type:Schema.Types.ObjectId,ref:"user",require:true},
    userName:{type:String,require:true},
    feedbackText:{type:String,require:true},
    feedbackDT:{type:Date,default:Date.now()},
    isPublic:{type:Boolean,default:false,require:true}

})

const FeedbackModel=mongoose.model.feedback||mongoose.model("feedback",FeedbacSchema)
export default FeedbackModel