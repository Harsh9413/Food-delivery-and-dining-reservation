import React, { useEffect, useState } from 'react';
import './Orders.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const[area,setArea]=useState([])
  const fetchArea= async()=>{
    try {
      const response= await axios.get(url+"/api/area/arealist")
       if (response.data.success) {
            setArea(response.data.data);
          } else {
            console.log(response.data.message)
          }
    } catch (error) {
      console.log(error)
    }  
  }


  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(url + "/api/order/lista");
      console.log("Full API Response:", response.data); // Debugging API Response

      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error("Error fetching orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    }
  };

  const statusHandler = async (event,orderId)=>{
    // console.log(orderId)
    const response = await axios.post(url+"/api/order/status",{
      orderId,
      status:event.target.value
    })
    if(response.data.success){
      await fetchAllOrders()
    }
  }


  useEffect(() => {
    fetchAllOrders();
    fetchArea()
  }, [url]); 

  return (
    <div className='order add'>
      <h3>Orders</h3>
      <div className='order-list'>
        {orders.map((order, index) => {
          //console.log(`Order ${index} item:`, order.item); // Debugging order.item
           const userarea=area.find(obj=> obj._id===order.address.area)
         
          return (
            <div key={index} className='order-item'>
              <img src={assets.foodpackage} alt="Parcel Icon" />
              <div>
              <p className='order-item-food'>
                {order.items.map((item,index)=>{
                  if(index === order.items.length-1){
                    return item.name + " x " + item.quantity
                  }
                  else{
                    return item.name + " x " + item.quantity + ", "
                  }
                })}
              </p>
              <p className="order-item-name"><b>Name:</b><span>{" "+order.address.name}</span></p>
              <div className="order-item-address">
                <p><b>Address:</b>{" "+order.address.street+","+userarea?.area+","+order.address.city+","+order.address.zipcode}</p>
              </div>
              <p className="order-item-phone"><b>Phone no:</b>{" "+order.address.phone}</p>
              </div>
              <p><b>Items: </b> {" "+order.items.length} </p>
              <p className="amount"><b>Amount:</b><span>{" "}₹{order.amount} </span> </p>
              <select onChange={(event)=>statusHandler(event,order._id)} value={order.status}>
                <option value="Food Processing">Food Processing</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
