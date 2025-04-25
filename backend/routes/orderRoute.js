import express from "express";
import authMiddleware from "../middleware/auth.js";
import { placeOrder, verifyOrder,userOrders,listOrders,updateStatus,getOrder,getAmount,getMonthlySales,getPopularProducts } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place",authMiddleware,placeOrder);
orderRouter.post("/verify",verifyOrder);
orderRouter.post("/userorders",authMiddleware,userOrders);
orderRouter.get('/lista',listOrders)
orderRouter.post("/status",updateStatus)
orderRouter.get("/count",getOrder)
orderRouter.get("/amount",getAmount)
orderRouter.get("/monthly", getMonthlySales);
orderRouter.get("/popular", getPopularProducts);

export default orderRouter;