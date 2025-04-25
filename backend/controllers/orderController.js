import orderModel from "../models/orderModel.js";
import userModel from "../models/usermodel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


const placeOrder = async(req,res)=>{

    const frontend_url = "http://localhost:5173"

    try {
        const user = await userModel.findById(req.body.userId);


        let stripeCustomer;
        if (!user.stripeCustomerId) {
            const customer = await stripe.customers.create({
                name: user.name,
                email: user.email,
            });

            stripeCustomer = customer.id;

            // Save Stripe Customer ID in user database
            await userModel.findByIdAndUpdate(user._id, { stripeCustomerId: stripeCustomer });
        } else {
            stripeCustomer = user.stripeCustomerId;
        }



        const newOrder = new orderModel({
            userId:req.body.userId,
            items:req.body.items,
            amount:req.body.amount,
            address:req.body.address
        })

        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}})

        const line_items = req.body.items.map((item)=>({
            price_data:{
                currency:"inr",
                product_data:{
                    name:item.name
                },
                unit_amount:item.price*100
            },
            quantity:item.quantity
        }))

        line_items.push({
            price_data:{
                currency:"inr",
                product_data:{
                    name:"Delivery Charges"
                },
                unit_amount:50*100
            },
            quantity:1
        })

        const session = await stripe.checkout.sessions.create({
            customer: stripeCustomer, 
            payment_method_types: ["card"],
            line_items:line_items,
            mode:'payment',
            success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`,

        })

        res.json({success:true,session_url:session.url})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

const verifyOrder = async (req,res) =>{
    const {orderId,success} = req.body;
    try {
        if(success=="true"){
            await orderModel.findByIdAndUpdate(orderId,{payment:true});
            res.json({success:true,message:"Paid"});
        }
        else{
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false,message:"Not Paid"})
        }
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

//user order for frontend

const userOrders = async(req,res)=>{
    try {
        const orders = await orderModel.find({userId:req.body.userId})
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
        
    }
}

//list of all users orders

const listOrders = async(req,res)=>{
    try {
        const orders = await orderModel.find({ payment: true });
        // console.log(orders);
        
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

const getOrder = async(req,res)=>{
    try{
        const totalOrders = await orderModel.countDocuments({ payment: true });
        
        res.json({success:true,data:totalOrders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

const getMonthlySales = async(req,res)=>{
    try {
        const salesAggregation = await orderModel.aggregate([
          {
            $match: { payment: true } // Only paid orders
          },
          {
            $group: {
              _id: { $month: "$date" },
              totalSales: { $sum: "$amount" }
            }
          },
          {
            $sort: { "_id": 1 }
          }
        ]);
        
        const monthlySales = Array(12).fill(0);
        salesAggregation.forEach(item => {
          monthlySales[item._id - 1] = item.totalSales;
        });
        // console.log(monthlySales);
        res.json({ success: true, data: monthlySales });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error aggregating monthly sales" });
      }
    };

    const getPopularProducts = async(req,res)=>{
        try {
            const dishPopularity = await orderModel.aggregate([
                { $match: { payment: true } }, // Only paid orders
                { $unwind: "$items" }, // Deconstruct items array
                {
                  $group: {
                    _id: "$items.name",
                    count: { $sum: "$items.quantity" } // Total quantity sold per dish
                  }
                },
                { $sort: { count: -1 } }, // Optional: sort by popularity
                { $limit: 5 }  
              ]);
            console.log(dishPopularity);
            res.json({
                success: true,
                labels: dishPopularity.map(d => d._id),
                data: dishPopularity.map(d => d.count)
              });
                         
        } catch (error) {
            console.log(error);
            res.json({success:false,message:"Error"})
        }
    };


const getAmount = async(req,res)=>{
    try {
        const totalAmount = await orderModel.aggregate([
            {
                $match: { payment: true }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);
        // console.log(totalAmount);
        res.json({success:true,data:totalAmount})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

const updateStatus = async(req,res)=>{
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
        res.json({success:true,message:"Updated"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

export {placeOrder,verifyOrder,userOrders,listOrders,updateStatus,getOrder,getAmount,getMonthlySales,getPopularProducts}