import categoryModel from "../models/categorymodel.js";
import fs from 'fs'

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//category list
const listCategory = async (req,res) => {
    try {
        const category = await categoryModel.find({});
        res.json({success:true,data:category})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

//add category

const addCategory = async (req,res) => {

    let image_filename = `${req.file.filename}`

    const  category = new categoryModel({
        name:req.body.name,
        details:req.body.details,
        image:image_filename
    })
    try {
        await category.save();
        res.json({success:true,message:"Category Added"})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Error"})
    }
}

//deactivte category
const removeCat = async (req,res) => {
    try {
        const cat = await categoryModel.findByIdAndUpdate(req.body.id,{status:req.body.status});
        // fs.unlink(`uploads/${food.image}`,()=>{})
        // await foodModel.findByIdAndDelete(req.body.id);
            
        
            res.json({success:true,message:"Item Updated"})
        

    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"});
        
    }
}

//update category

const UpdateCat=async(req,res)=>{
    try {
        // console.log("Request Body:", req.body); // Debugging
        //console.log("Uploaded File:", req.file); // Debugging

        const { id, name, details, prevImage } = req.body;
        if (!id) {
            return res.status(400).json({ success: false, message: "Food ID is required" });
        }

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, message: "Invalid Food ID format" });
        }

        // Create update object only with non-empty fields
        let updateData = {};
        if (name) updateData.name = name;
        if (details) updateData.details = details;
       
        if (req.file) {
            
            const filePath = path.join(__dirname, "../uploads", prevImage);
            // Check if old image exists before deleting
            
            if (fs.existsSync(filePath)) {
               
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error("Retry failed to delete old image:", err);
                    } else {
                        console.log("Old image deleted after retry!");
                    }
                });
            }
            updateData.image = req.file.filename; // Save new image
        }
        
       
        // Find and update
        const updatedCat = await categoryModel.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedCat) {
            return res.status(404).json({ success: false, message: "Food item not found" });
        }else{
            res.status(200).json({ success: true, message: "Category Updated", data: updatedCat });
        }

       
    } catch (error) {
        console.error("Error updating Category:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }

}

export {listCategory,addCategory,removeCat,UpdateCat};