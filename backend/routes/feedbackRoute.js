import express from "express"
import { addfeedback, fetchFeedBacks } from "../controllers/feedbackcontroller.js"
import multer from "multer"

const fedRouter = express.Router()





fedRouter.post("/add",addfeedback)
fedRouter.get("/fedlist",fetchFeedBacks)
export default fedRouter;