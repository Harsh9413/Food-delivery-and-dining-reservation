import express from 'express'
import { reportGenerate } from '../controllers/reportcontroller.js'

const reportRouter = express.Router()

reportRouter.get("/getreport",reportGenerate)

export default reportRouter