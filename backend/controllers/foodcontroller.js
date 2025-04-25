
import foodModel from "../models/foodmodel.js";
import fs from 'fs'
import mongoose, { Schema } from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// add items

const addFood = async (req,res) => {

    let image_filename = `${req.file.filename}`

    const food = new foodModel({
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        category:req.body.category,
        image:image_filename
    })
    try {
        await food.save();
        res.json({success:true,message:"Food Added"})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Error"})
    }
}


const updateFood = async (req, res) => {
    try {
        // console.log("Request Body:", req.body); // Debugging
        // console.log("Uploaded File:", req.file); // Debugging

        const { id, name, description, price, category , prevImage } = req.body;

        if (!id) {
            return res.status(400).json({ success: false, message: "Food ID is required" });
        }

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, message: "Invalid Food ID format" });
        }

        // Create update object only with non-empty fields
        let updateData = {};
        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (price) updateData.price = price;
        if (category) updateData.category = category;
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
        const updatedFood = await foodModel.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedFood) {
            return res.status(404).json({ success: false, message: "Food item not found" });
        }else{
            res.status(200).json({ success: true, message: "Food Updated", data: updatedFood });

        }

       
    } catch (error) {
        console.error("Error updating food:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};




// all food list
const listFood = async (req,res) => {
    try {
        const foods = await foodModel.find({});
        res.json({success:true,data:foods})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}


// update food item
const removeFood = async (req,res) => {
    try {
        const food = await foodModel.findByIdAndUpdate(req.body.id,{status:req.body.status});
        // fs.unlink(`uploads/${food.image}`,()=>{})
        // await foodModel.findByIdAndDelete(req.body.id);
            
        
            res.json({success:true,message:"Item Updated"})
        

    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"});
        
    }
}


export {addFood,listFood,removeFood,updateFood}