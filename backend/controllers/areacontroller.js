import AreaModel from '../models/areamodel.js'

const AreaList = async(req,res)=>{
    try {
        const area = await AreaModel.find({})
        res.json({success:true,data:area})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Can't fetch Areas"})
    }
}
export {AreaList}