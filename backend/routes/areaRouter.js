import express from 'express'
import { AreaList } from '../controllers/areacontroller.js'

const areaRouter = express.Router()

areaRouter.get("/arealist",AreaList)

export default areaRouter