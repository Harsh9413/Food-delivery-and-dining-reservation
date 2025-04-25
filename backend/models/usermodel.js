    import mongoose, { Schema } from 'mongoose'

    const userSchema = new mongoose.Schema({
        name:{type:String,require:true},
        email:{type:String,require:true,unique:true},
        password:{type:String,require:true},
        cartData:{type:Object,default:{}},
        phoneNo:{type:Number,length:10},
        createdAt:{type:Date,default:Date.now()},
        address:{type:String},
        areaId:{type:Schema.Types.ObjectId,ref:"area"},
        city:{type:String,default:"Ahmedabad "},
        stripeCustomerId: { type: String, default: null },
        stripeCustomerId2: { type: String, default: null }
       
    },{minimize:false})

    const userModel =  mongoose.models.user || mongoose.model("user",userSchema);
    export default userModel;