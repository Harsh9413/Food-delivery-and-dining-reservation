import express from "express"
import { addFood, listFood, removeFood, updateFood } from "../controllers/foodcontroller.js"
import multer from "multer"


const foodRouter = express.Router();

//image storage engine

const storage = multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`)
    }
})

const upload = multer({storage:storage})

foodRouter.post("/add",upload.single("image"),addFood)
foodRouter.get("/listfood",listFood)
foodRouter.post("/remove",removeFood)
foodRouter.post("/update",upload.single("image"),updateFood)



export default foodRouter;