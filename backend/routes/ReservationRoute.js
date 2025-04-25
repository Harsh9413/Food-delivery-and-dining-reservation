import express from "express"
import authMiddleware from "../middleware/auth.js"
import { addReservation, verifiReservation,FetchReservs, userReservation,UpdateStatus,fetchTotalReservations } from "../controllers/ReservationController.js";

const ReservationRouter = express.Router();

ReservationRouter.post('/reserve',authMiddleware,addReservation);
ReservationRouter.post('/verifi',verifiReservation);
ReservationRouter.get('/reslist',FetchReservs);
ReservationRouter.post('/userreservation',authMiddleware,userReservation);
ReservationRouter.post('/status',UpdateStatus);
ReservationRouter.get('/totalreservations',fetchTotalReservations)

export default ReservationRouter;