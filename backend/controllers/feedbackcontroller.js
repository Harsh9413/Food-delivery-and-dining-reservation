import FeedbackModel from '../models/feedbackmodel.js'
const addfeedback = async(req,res)=>{
    
    const feedback= new FeedbackModel({
       userId:req.body.userId,
       userName:req.body.userName,
       feedbackText:req.body.feedbacktxt,
       feedbackDT:Date.now(),
       isPublic:req.body.isPublic
    })
    try {
        await feedback.save();
        res.json({success:true,message:"FeedBack Sent"})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Error"})
    }
}

const fetchFeedBacks = async (req,res)=>{
    try {
        const feedback= await FeedbackModel.find({isPublic:true})
        res.json({success:true,data:feedback})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Error"})
    }
}

export{addfeedback,fetchFeedBacks}