import express from "express"
import { addCategory, listCategory,removeCat,UpdateCat } from "../controllers/categorycontroller.js";
import multer from "multer"

const catRouter = express.Router()



// image storage engine
const storage = multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`)
    }
})


const upload = multer({storage:storage})

catRouter.get("/add",listCategory)
catRouter.post("/addcategory",upload.single("image"),addCategory)
catRouter.get("/list",listCategory)
catRouter.post("/removecat",removeCat);
catRouter.post("/updatecat",upload.single("image"),UpdateCat);
export default catRouter;