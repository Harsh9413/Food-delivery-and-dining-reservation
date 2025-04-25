import foodModel from "../models/foodmodel.js";
import orderModel from "../models/orderModel.js";
import ReservationModel from "../models/ReservationModel.js";
import userModel from "../models/usermodel.js";
import FeedbackModel from '../models/feedbackmodel.js'
import Stripe from "stripe"
import AreaModel from '../models/areamodel.js'
import mongoose from "mongoose"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const stripe2 = new Stripe(process.env.STRIPE_SECRET_KEY2)
const reportGenerate = async(req,res)=>{
    try {
        let data=[]
        const {model,startDate,endDate,all}=req.query;
        //console.log(model,startDate,endDate,all)
        const modelMap = {
            userModel: userModel,
            foodModel: foodModel,
            ReservationModel: ReservationModel,
            orderModel: orderModel,
            FeedbackModel: FeedbackModel,
          };
          const start = new Date(startDate);
          const end = new Date(endDate);
       
        const Model = modelMap[model]; 
        if(model=="ReservationModel"){
            if(all=="true"){
             data= await Model.find({}) .select("userId First_Name Last_name People Time Date Status");
            
            }else{
             data= await Model.find({Date:{ $gte: start, $lte: end }}) .select("userId First_Name Last_name People Time Date Status");
            }
            //console.log(data)
            }
        else if(model=="orderModel"){
            if(all=="true"){
                data= await Model.find({ }).select("userId items amount date address date")
                //console.log(data)
            }else{
                 data= await Model.find({date: { $gte: start, $lte: end }, }).select("userId items amount date address");
                //console.log(data) 
            }
            
            //console.log("Fetched Orders:", data);  // Debugging

            // Fetch area names manually
            const areaIds = [...new Set(data.map(order => order.address?.area).filter(Boolean))];
            
           // console.log("Area IDs to Fetch:", areaIds);  // Debugging
        
            if (areaIds.length > 0) {
                const areas = await AreaModel.find({ _id: { $in: areaIds } }).select("area");
                
                // Create a lookup object for area names
                const areaMap = {};
                areas.forEach(a => {
                    areaMap[a._id.toString()] = a.area;
                });
        
                //console.log("Area Map:", areaMap);  // Debugging
        
                // Attach area names to orders
                const modifiedData = data.map(order => {
                    const orderObj = order.toObject();
                    return {
                        ...orderObj,
                        address: {
                            ...orderObj.address,
                            areaName: areaMap[orderObj.address.area] || "Unknown"
                        }
                    };
                });
        
                console.log("Modified Data:", modifiedData);
                data=modifiedData  
            } else {
                console.log("No area IDs found.");
            }
        
        }
        else if(model=="FeedbackModel"){
            if(all=="true"){
                data= await Model.find({ }).select("userId userName feedbackText feedbackDT isPublic").populate("userId" ,"email")
                //console.log(data)
            }else{
                data= await Model.find({feedbackDT: { $gte: start, $lte: end }, }).select("userId userName feedbackText feedbackDT isPublic").populate("userId" ,"email")
                //console.log(data) 
            }
        }
        else if(model=="foodModel"){
             data= await Model.find({ }).select("name description price category status").populate("category","name")
                 //console.log(data) 
        }
        else if(model=="userModel"){
            if(all=="true"){
                data= await Model.find({ }).select("name email phoneNo areaId city").populate("areaId", "area");
                //console.log(data)
                }else{
                data= await Model.find({createdAt: { $gte: start, $lte: end }, }).select("name email phoneNo areaId city").populate("areaId", "area");
            //console.log(data) 
                }
        }
        else if(model=="Payments"){
            const opayments = await stripe.paymentIntents.list({ });
            
            // Fetch additional details for each payment
            const orderDetails = await Promise.all(
              opayments.data.map(async (payment) => {
                let customerInfo = { name: "Unknown", email: "Unknown" };
                let paymentMethodInfo = "Unknown";

                // console.log("Checking Payment:", payment.id); // Debugging
                // console.log("Payment Customer ID:", payment.customer); // Log customer ID
        
                // Check if payment is linked to a customer
                if (payment.customer) {
                    try {
                      const customer = await stripe.customers.retrieve(payment.customer);
                     // console.log("Fetched Customer:", customer); // Debugging
          
                      customerInfo = {
                        name: customer.name || "Unknown",
                        email: customer.email || "Unknown",
                      };
                    } catch (err) {
                      console.error("Error fetching customer:", err.message);
                    }
                  } else {
                    //console.log("No customer ID linked to this payment.");
                  }
        
                // Get payment method details (e.g., card, UPI, etc.)
                if (payment.payment_method) {
                  const paymentMethod = await stripe.paymentMethods.retrieve(payment.payment_method);
                  paymentMethodInfo = paymentMethod.card ? `Card ending in ${paymentMethod.card.last4}` : "Unknown";
                }
        
                return {
                  id: payment.id,
                  user: customerInfo,
                  payment_method: paymentMethodInfo,
                  amount: payment.amount / 100, // Convert to INR or USD
                  currency: payment.currency.toUpperCase(),
                  date: new Date(payment.created * 1000).toLocaleDateString(),
                  time: new Date(payment.created * 1000).toLocaleTimeString(),
                  status: payment.status,
                  type:"Online Order"
                };
              })
            );
          let OrderPayments=[]
           if(all=="true"){
             OrderPayments = orderDetails.filter((payment) => payment.user.name !== "Unknown");
            console.log(OrderPayments)
        }else{
           // Normalize start and end dates (remove time component)
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);

            // console.log("Start Date:", start);
            // console.log("End Date:", end);

             OrderPayments = orderDetails.filter((payment) => {
                if (payment.user.name === "Unknown") return false;
            
                let paymentDate;
            
                if (typeof payment.date === "string" && payment.date.includes("/")) {
                    // Convert "dd/mm/yyyy" → "yyyy-mm-dd"
                    const [day, month, year] = payment.date.split("/");
                    paymentDate = new Date(`${year}-${month}-${day}`);
                } else {
                    // Convert ISO format or Date object
                    paymentDate = new Date(payment.date);
                }
            
                // Ensure paymentDate is valid
                if (isNaN(paymentDate)) {
                    console.error("Invalid date format:", payment.date);
                    return false;
                }
            
                // Normalize paymentDate (remove time component)
                paymentDate.setHours(0, 0, 0, 0);
            
                // console.log("Checking Payment Date:", paymentDate);
                // console.log("Condition 1:", paymentDate >= start);
                // console.log("Condition 2:", paymentDate <= end);
            
                // Compare using timestamps
                return paymentDate.getTime() >= start.getTime() && paymentDate.getTime() <= end.getTime();
            });
            //console.log(OrderPayments);

        }
            const rpayments = await stripe2.paymentIntents.list({ });
            const rservationDetails = await Promise.all(
                rpayments.data.map(async (payment) => {
                  let customerInfo = { name: "Unknown", email: "Unknown" };
                  let paymentMethodInfo = "Unknown";
  
                  // console.log("Checking Payment:", payment.id); // Debugging
                  // console.log("Payment Customer ID:", payment.customer); // Log customer ID
          
                  // Check if payment is linked to a customer
                  if (payment.customer) {
                      try {
                        const customer = await stripe2.customers.retrieve(payment.customer);
                       // console.log("Fetched Customer:", customer); // Debugging
            
                        customerInfo = {
                          name: customer.name || "Unknown",
                          email: customer.email || "Unknown",
                        };
                      } catch (err) {
                        console.error("Error fetching customer:", err.message);
                      }
                    } else {
                      //console.log("No customer ID linked to this payment.");
                    }
          
                  // Get payment method details (e.g., card, UPI, etc.)
                  if (payment.payment_method) {
                    const paymentMethod = await stripe2.paymentMethods.retrieve(payment.payment_method);
                    paymentMethodInfo = paymentMethod.card ? `Card ending in ${paymentMethod.card.last4}` : "Unknown";
                  }
          
                  return {
                    id: payment.id,
                    user: customerInfo,
                    payment_method: paymentMethodInfo,
                    amount: payment.amount / 100, // Convert to INR or USD
                    currency: payment.currency.toUpperCase(),
                    date: new Date(payment.created * 1000).toLocaleDateString(),
                    time: new Date(payment.created * 1000).toLocaleTimeString(),
                    status: payment.status,
                    type:"Reservation"
                  };
                })
              );
              let ReservPayments=[]
              if(all=="true"){
                     ReservPayments = rservationDetails.filter((payment) => payment.user.name !== "Unknown");
                    console.log(ReservPayments)
                }else{
                   // Normalize start and end dates (remove time component)
                    start.setHours(0, 0, 0, 0);
                    end.setHours(23, 59, 59, 999);

                    // console.log("Start Date:", start);
                    // console.log("End Date:", end);

                     ReservPayments = rservationDetails.filter((payment) => {
                        if (payment.user.name === "Unknown") return false;
                    
                        let paymentDate;
                    
                        if (typeof payment.date === "string" && payment.date.includes("/")) {
                            // Convert "dd/mm/yyyy" → "yyyy-mm-dd"
                            const [day, month, year] = payment.date.split("/");
                            paymentDate = new Date(`${year}-${month}-${day}`);
                        } else {
                            // Convert ISO format or Date object
                            paymentDate = new Date(payment.date);
                        }
                    
                        // Ensure paymentDate is valid
                        if (isNaN(paymentDate)) {
                            console.error("Invalid date format:", payment.date);
                            return false;
                        }
                    
                        // Normalize paymentDate (remove time component)
                        paymentDate.setHours(0, 0, 0, 0);
                    
                        // console.log("Checking Payment Date:", paymentDate);
                        // console.log("Condition 1:", paymentDate >= start);
                        // console.log("Condition 2:", paymentDate <= end);
                    
                        // Compare using timestamps
                        return paymentDate.getTime() >= start.getTime() && paymentDate.getTime() <= end.getTime();
                    });
                    //console.log(ReservPayments);
                }

                data = [...OrderPayments, ...ReservPayments];
                //console.log(data)
        }
        res.json({success:true,data:data});
        
        //console.log(data);

    } catch (error) {
        
    }


}

export{reportGenerate}